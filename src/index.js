import { createRemoteJWKSet, jwtVerify } from "jose";
import generator from "../ai-question-generator/src/index.js";

// Everything under these prefixes requires a valid Cloudflare Access JWT.
// Access itself blocks unauthenticated browsers at the edge; this check is the
// backstop that makes the gate real — without it, anything that reaches the
// Worker while bypassing Access (a direct workers.dev hit, a misconfigured
// route) would be served the practice app and the AI endpoint for free.
const GATED_PREFIXES = ["/practice", "/api/"];

// createRemoteJWKSet handles its own caching and refetches when it sees an
// unknown `kid`, which is what lets Access rotate signing keys without breaking
// verification. Key the cache by team domain so a config change builds a new
// set rather than reusing one pinned to the old issuer's keys.
const jwksByDomain = new Map();
function getJWKS(teamDomain) {
  let set = jwksByDomain.get(teamDomain);
  if (!set) {
    set = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`), {
      // A rotated-in key arrives as an unknown `kid`, which only triggers a
      // refetch once the cooldown has lapsed — the default 30s would reject
      // valid logins until then. Bound cacheMaxAge too, so a retired key stops
      // being trusted within minutes rather than for the isolate's lifetime.
      cooldownDuration: 5_000,
      cacheMaxAge: 300_000,
    });
    jwksByDomain.set(teamDomain, set);
  }
  return set;
}

function isGated(pathname) {
  return GATED_PREFIXES.some((p) => pathname.startsWith(p));
}

// Access issues tokens with `iss` exactly "https://<team>.cloudflareaccess.com",
// and jwtVerify compares it as a literal string. A trailing slash or a missing
// scheme in config would therefore reject every valid login, so normalize to the
// form Access actually uses rather than making the config that brittle.
function normalizeTeamDomain(raw) {
  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

// Turn an HPISD address into something worth greeting:
//   first.last@stu.hpisd.org -> First
//   name@hpisd.org           -> Name
// Anything else falls back to the local part, or the whole string if there
// isn't one. Access sets `name` for some identity providers; prefer that when
// it's a real name rather than a copy of the email.
function displayName(email, name) {
  if (name && name !== email) return name;
  if (!email || !email.includes("@")) return email || "";

  const [local, domain] = email.split("@");
  const host = domain.toLowerCase();
  const part = host === "stu.hpisd.org" ? local.split(".")[0] : local;
  if (!part) return email;
  return part.charAt(0).toUpperCase() + part.slice(1);
}

// Returns the verified Access identity, or null if the request isn't authorized.
// Logs why on failure — a silent 403 is impossible to debug from the outside.
async function verifyAccess(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    console.log("access: not configured", {
      hasTeamDomain: Boolean(env.ACCESS_TEAM_DOMAIN),
      hasAud: Boolean(env.ACCESS_AUD),
    });
    return null;
  }

  const teamDomain = normalizeTeamDomain(env.ACCESS_TEAM_DOMAIN.trim());
  const aud = env.ACCESS_AUD.trim();

  const token =
    request.headers.get("Cf-Access-Jwt-Assertion") ||
    // Access also sets a cookie; browsers navigating directly carry only this.
    (request.headers.get("Cookie") || "").match(/CF_Authorization=([^;]+)/)?.[1];
  if (!token) {
    console.log("access: no token on request", { path: new URL(request.url).pathname });
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS(teamDomain), {
      issuer: teamDomain,
      audience: aud,
    });
    return payload;
  } catch (err) {
    // Decode without verifying purely to report what the token actually claims
    // versus what we expected — the usual cause is an issuer/aud mismatch.
    let claims = {};
    try {
      claims = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    } catch {}
    console.log("access: jwt rejected", {
      code: err.code || err.message,
      expectedIssuer: teamDomain,
      tokenIssuer: claims.iss,
      expectedAud: aud,
      tokenAud: claims.aud,
    });
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    let identity = null;
    if (isGated(url.pathname)) {
      identity = await verifyAccess(request, env);
      if (!identity) {
        // Don't hand back HTML here — Access owns the login redirect. A bare 403
        // is what a bypassing client deserves, and the API needs JSON anyway.
        return url.pathname.startsWith("/api/")
          ? Response.json({ error: "Not authorized." }, { status: 403 })
          : new Response("Not authorized.", { status: 403 });
      }
    }

    // Who am I? Lets the practice page show a real name without trusting input.
    if (url.pathname === "/api/me") {
      return Response.json({
        email: identity.email,
        name: displayName(identity.email, identity.name),
      });
    }

    if (url.pathname === "/api/generate") {
      return generator.fetch(request, env, ctx);
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
