"use strict";

/* Shared by the public site and the practice app. Loaded first on both pages. */

const NAVY = "var(--navy)";
const GOLD = "var(--gold)";

const NAV_PAGES = [
  { key:'home', label:'Home' },
  { key:'about', label:'About' },
  { key:'captains', label:'Captains' },
  { key:'coaching', label:'Coaching' },
  { key:'schedule', label:'Schedule' },
  { key:'contact', label:'Contact' },
  { key:'practice', label:'Practice' },
  { key:'drive', label:'Drive', external:true },
];

/* ---------- small DOM helpers ---------- */
function h(tag, attrs, children){
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs){
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.setAttribute('style', v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  if (children != null){
    (Array.isArray(children)?children:[children]).forEach(c=>{
      if (c == null || c === false) return;
      el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
  }
  return el;
}

function imgSlot(text, imgSrc){
  if (imgSrc) return h('img',{class:'slot-img', src:imgSrc, alt:text,
    onError:(e)=>{ e.target.replaceWith(h('div',{class:'imgslot'}, text)); }});
  return h('div',{class:'imgslot'}, text);
}

// Practice lives at its own path, so nav has to leave the SPA rather than
// just set a hash. Drive points at the Worker's short link rather than the
// Google URL directly, so the folder is only written down in one place.
// Everything else stays a hash route on the public page.
function navHref(key){
  if (key === 'practice') return '/practice/';
  if (key === 'drive') return '/drive';
  return '/#' + key;
}

/* ---------- shared chrome ---------- */
function Nav(activeKey){
  const links = NAV_PAGES.map(p=>{
    const active = activeKey === p.key;
    return h('a', {
      class:'navlink' + (active?' active':''),
      href: navHref(p.key),
      // An off-site destination shouldn't cost you the page you were on.
      target: p.external ? '_blank' : null,
      rel: p.external ? 'noopener' : null,
    }, p.label);
  });
  return h('div',{class:'nav'},[
    h('a',{class:'brand', href:'/'},[
      h('img',{src:'/assets/hp-logo.webp', alt:'Highland Park Scots logo', onError:(e)=>{ e.target.src='/assets/scots-logo.svg'; }}),
      h('div',{style:'display:flex;flex-direction:column;align-items:flex-start;line-height:1.1;gap:4px;text-align:left;'},[
        h('span',{class:'t1'},'Highland Park UIL CS'),
        h('span',{class:'t2'},'SCOTS COMPUTER SCIENCE'),
      ]),
    ]),
    h('div',{class:'navlinks'}, links),
  ]);
}

function Footer(){
  return h('div',{class:'footer'},
    h('span',null,'Highland Park High School · UIL Computer Science · hphs.uilcs.org')
  );
}

// Both pages render the same shell; only the middle differs.
function mount(contentFn, activeKey){
  const root = document.getElementById('root');
  root.innerHTML = '';
  root.appendChild(
    h('div',{class:'app'},[ Nav(activeKey), h('main',{class:'content'}, contentFn()), Footer() ])
  );
}
