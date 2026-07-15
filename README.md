# UIL Computer Science

Highland Park High School UIL Computer Science team site.

Deployed as a single Cloudflare Worker: static assets are served from `public/`,
and `/api/generate` runs the AI question generator.

## Layout

| Path                     | What it is                                                |
| ------------------------ | --------------------------------------------------------- |
| `public/`                | Public site. Served directly, no auth.                    |
| `public/common.js`       | Shared chrome (nav, footer, DOM helpers) for both pages.  |
| `public/practice/`       | Members-only practice app. Gated by Cloudflare Access.    |
| `src/index.js`           | Worker entry: verifies Access JWTs, routes `/api/*`.      |
| `ai-question-generator/` | Git submodule owning all question-generation logic.       |

The submodule stays independently deployable; `src/index.js` imports its fetch
handler rather than duplicating it.

## Access control

`/practice/*` and `/api/*` require a valid Cloudflare Access JWT; everything
else is public. `run_worker_first` in `wrangler.jsonc` covers those prefixes so
the Worker verifies the token *before* any gated asset is served — without it,
static assets would be handed out without a check.

The Worker verifies the JWT signature itself rather than trusting the header's
presence, so a request that reaches it while bypassing Access (a direct
workers.dev hit, a misrouted domain) is still rejected.

To set it up:

1. In Zero Trust → Access → Applications, create a **self-hosted** app covering
   your domain, with policies for the paths `/practice` and `/api`.
2. Restrict it to your team (for example, emails ending in `@hpisd.org`).
3. Supply the application's **AUD tag** and your team domain. Either plain vars
   in `wrangler.jsonc` or secrets work — both arrive on `env`:

   ```sh
   npx wrangler secret put ACCESS_TEAM_DOMAIN   # https://<team>.cloudflareaccess.com
   npx wrangler secret put ACCESS_AUD           # the application's AUD tag
   ```

Until both are set, gated routes return 403 — it fails closed, not open.

`ACCESS_TEAM_DOMAIN` is normalized before use (scheme added if missing, trailing
slashes and whitespace stripped), because the JWT's `iss` claim is compared as an
exact string — a stray `/` would otherwise reject every valid login.

If sign-in succeeds but the site still says "Not authorized", tail the Worker
logs (`npx wrangler tail`) and look for `access: jwt rejected` — it prints the
expected vs. actual issuer and audience, which is almost always the mismatch.

The practice page gets the signed-in user from `/api/me`, which reads the
verified JWT. There is no client-side sign-in to bypass.

## Setup

```sh
git submodule update --init
npm install
npm install --prefix ai-question-generator
```

## Develop

```sh
npm run dev        # http://localhost:8788
```

Note: the `AI` binding always calls remote Workers AI, so local dev incurs real
usage charges.

## Deploy

```sh
npm run deploy
```

## API

`/api/generate` — topics are numbered 1-15, matching the site's topic list.

```sh
# One topic
curl "localhost:8788/api/generate?question=2&quantity=3"

# Every topic
curl "localhost:8788/api/generate?all=true&quantity=1"

# Per-topic counts; streams NDJSON, one line per topic as it finishes
curl -X POST -H 'content-type: application/json' \
  -d '{"1":1,"2":2,"13":3}' localhost:8788/api/generate
```

Generated questions are verified by evaluating the Java snippet: answers are
confirmed or corrected, and unsalvageable questions are dropped, so a response
may contain fewer questions than requested.
