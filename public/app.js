"use strict";

/* Public site. Practice lives at /practice/ and is gated separately. */

// Ordered alphabetically by last name.
const CAPTAINS = [
  { name:'Will Forsberg', role:'TEAM CAPTAIN', imgSrc:'assets/berg.webp' },
  { name:'Shayen Nair', role:'CO-CAPTAIN', imgSrc:'assets/shayen.webp' },
  { name:'John Shamburger', role:'CO-CAPTAIN', imgSrc:'assets/john.webp' },
];
// In season order. Fall meets are 2026, everything from January on is 2027.
const MEETS = [
  { name:'UTD Battle of the Brains', location:'UT Dallas', date:'November 7, 2026' },
  { name:'Christmas Invitational', location:'Location TBD', date:'December 5, 2026' },
  { name:'UIL Invitational A', location:'Princeton High School (Tentative)', date:'January 9, 2027' },
  { name:'UIL Invitational B', location:'Crandall High School (Tentative)', date:'February 20, 2027' },
  { name:'District Meet', location:'Highland Park High School', date:'April 3, 2027' },
  { name:'Regional Meet', location:'TBD', date:'April 23, 2027' },
  { name:'UIL State Meet', location:'Austin, TX', date:'Date TBD' },
];

const PUBLIC_PAGES = ['home','about','schedule','contact'];
// Captains and Coaching used to be their own pages. They're sections of About
// now, but old links are still out there, so keep resolving them.
const MERGED_INTO_ABOUT = ['captains','coaching'];
function pageFromHash(){
  const key = (location.hash || '').replace(/^#\/?/, '');
  if (MERGED_INTO_ABOUT.includes(key)) return 'about';
  return PUBLIC_PAGES.includes(key) ? key : 'home';
}

const state = { page: pageFromHash() };
function setState(patch){ Object.assign(state, patch); render(); }

/* ---------- views ---------- */
function stat(big, sub){
  return h('div',{class:'stat'},[ h('div',{class:'big'},big), h('div',{class:'sub'},sub) ]);
}
function personCard(opts){
  return h('div',{class:'card person'},[
    h('div',{class:'photo'}, imgSlot(opts.placeholder, opts.imgSrc)),
    h('div',{class:'body'},[
      h('div',{class:'name'},opts.name),
      h('div',{class:'role'},opts.role),
      h('div',{class:'bio'},opts.bio),
      opts.email ? h('a',{href:'mailto:'+opts.email, style:'font-size:14px;font-weight:600;margin-top:12px;display:inline-block;'},opts.email) : null,
    ]),
  ]);
}
function Home(){
  return h('div',{class:'home fade'},[
    h('div',{class:'hero'},[
      h('div',{class:'hero-copy'},[
        h('span',{class:'eyebrow'},'Highland Park High School'),
        h('h1',null,'UIL Computer Science'),
        h('p',null,'Scots writing code, solving problems, and competing across Texas. We build programmers who think fast, debug faster, and never leave a semicolon behind.'),
        h('div',{class:'cta-row'},[
          h('a',{class:'btn btn-gold', href:'/#captains'},'Meet the Captains'),
          h('a',{class:'btn btn-ghost', href:navHref('schedule')},'View Schedule'),
        ]),
      ]),
      h('div',{class:'hero-photo'}, imgSlot("Drop last year's team photo here", 'assets/team.webp')),
    ]),
    h('div',{class:'stats'},[
      stat('Wednesdays','Weekly practice, after school'),
      stat('Grades 9–12','Open to every Scot'),
      stat('All Levels','No experience required'),
    ]),
  ]);
}
// About, the coach, and the captains were three thin pages; they read better as
// one story — what the contest is, then who runs the team. The old #captains and
// #coaching hashes still land here, on their section (see pageFromHash).
function About(){
  return h('div',{class:'page fade', style:'max-width:820px;'},[
    h('span',{class:'eyebrow'},'About'),
    h('h1',{class:'h1'},'What we do'),
    h('p',{class:'prose'},'UIL Computer Science is a Texas academic contest that tests students on programming (in Java), computer science theory, and logic under timed pressure. Teams write short programs to solve problems, answer written questions on data structures and algorithms, and compete individually and as a team at invitational, district, regional, and state meets throughout the year.'),
    h('p',{class:'prose'},"The Highland Park High School team is open to any Scot who wants to get better at programming and problem-solving, whether you've never written a line of code or you're already an expert. We practice together weekly, work through past contests, and travel to meets across the region."),
    h('p',{class:'prose'},'New members are always welcome — come to a Wednesday practice to see what it’s about.'),

    h('h2',{class:'h2 section', id:'captains'},'Team Captains'),
    h('div',{class:'stack'}, CAPTAINS.map(c=>
      personCard({
        placeholder:'Drop captain photo',
        imgSrc:c.imgSrc,
        name:c.name,
        role:c.role,
        bio:c.bio || 'Bio coming soon — check back after this season kicks off.',
      })
    )),

    h('h2',{class:'h2 section', id:'coaching'},'Coaching Staff'),
    personCard({
      placeholder:'Drop coach photo',
      imgSrc:'assets/jones.webp',
      name:'Elizabeth Jones',
      role:'HEAD COACH',
      bio:'In addition to teaching Computer Science, Ms. Jones leads the HPHS UIL Computer Science team, guiding students through contest prep, coding practice, and competition-day strategy.',
      email:'jonese@hpisd.org',
    }),
  ]);
}
function Schedule(){
  return h('div',{class:'page fade', style:'max-width:820px;'},[
    h('span',{class:'eyebrow'},'2026–27 Season'),
    h('h1',{class:'h1'},'Schedule'),
    h('div',{class:'rowlist'}, MEETS.map(m=>
      h('div',{class:'meet'},[
        h('div',null,[
          h('div',{class:'name'},m.name),
          h('div',{class:'loc'},m.location),
        ]),
        h('div',{class:'date'},m.date),
      ])
    )),
    h('p',{class:'note'},'Dates are scheduled but subject to change; locations marked TBD are still being confirmed.'),
  ]);
}
function Contact(){
  const block = (label, node) => h('div',null,[ h('div',{class:'contact-label'},label), node ]);
  return h('div',{class:'page fade', style:'max-width:640px;'},[
    h('span',{class:'eyebrow'},'Get in Touch'),
    h('h1',{class:'h1'},'Contact'),
    h('div',{class:'card contact-card'},[
      block('Coach Elizabeth Jones', h('a',{href:'mailto:jonese@hpisd.org', style:'font-size:16px;margin-top:4px;display:inline-block;'},'jonese@hpisd.org')),
      h('div',{class:'contact-hr'}),
      /*block('Team Inbox', h('a',{href:'mailto:hp@uilcs.org', style:'font-size:16px;margin-top:4px;display:inline-block;'},'hp@uilcs.org')),
      h('div',{class:'contact-hr'}),*/
      block('Where we practice', h('div',{style:'font-size:16px;margin-top:4px;color:oklch(28% 0.01 258);'},'Highland Park High School — Wednesdays after school')),
    ]),
  ]);
}

/* ---------- router / render ---------- */
function CurrentPage(){
  switch(state.page){
    case 'home': return Home();
    case 'about': return About();
    case 'schedule': return Schedule();
    case 'contact': return Contact();
    default: return Home();
  }
}

function render(){ mount(CurrentPage, state.page); }

// A hash naming a section within the current page (#captains, #coaching) should
// scroll to it. The browser can't do this itself: mount() rebuilds the DOM, so
// the target doesn't exist yet at hashchange time — and after a re-render it's
// a different element than the one the browser looked for.
function scrollToHashTarget(){
  const id = (location.hash || '').replace(/^#\/?/, '');
  const el = id && document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  return Boolean(el);
}

window.addEventListener('hashchange', () => {
  const p = pageFromHash();
  if (p === state.page){
    // Same page, so nothing to re-render — but the hash may point at a section.
    scrollToHashTarget();
    return;
  }
  setState({ page:p });
  // A hash change isn't a real navigation, so the browser keeps the old scroll
  // position; landing halfway down a fresh page is disorienting.
  if (!scrollToHashTarget()) window.scrollTo(0, 0);
});

render();
// An inbound link straight to #captains lands mid-page, not at the top.
scrollToHashTarget();
