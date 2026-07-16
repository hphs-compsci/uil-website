"use strict";

/* Public site. Practice lives at /practice/ and is gated separately. */

// Ordered alphabetically by last name.
const CAPTAINS = [
  { name:'Will Forsberg', role:'TEAM CAPTAIN', imgSrc:'assets/berg.webp' },
  { name:'Shayen Nair', role:'CO-CAPTAIN', imgSrc:'assets/shayen.webp' },
  { name:'John Shamburger', role:'CO-CAPTAIN', imgSrc:'assets/john.webp' },
];
const MEETS = [
  { name:'Invitational A', location:'Princeton High School', date:'January 08, 2027' },
  { name:'Invitational B', location:'Crandall High School', date:'Date TBD' },
  { name:'District Meet', location:'Highland Park High School', date:'Date TBD' },
  { name:'Regional Meet', location:'TBD', date:'Date TBD' },
  { name:'UIL State Meet', location:'Austin, TX', date:'Date TBD' },
];

const PUBLIC_PAGES = ['home','about','captains','coaching','schedule','contact'];
function pageFromHash(){
  const key = (location.hash || '').replace(/^#\/?/, '');
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
          h('a',{class:'btn btn-gold', href:navHref('captains')},'Meet the Captains'),
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
function About(){
  return h('div',{class:'page fade', style:'max-width:820px;'},[
    h('span',{class:'eyebrow'},'About'),
    h('h1',{class:'h1'},'What we do'),
    h('p',{class:'prose'},'UIL Computer Science is a Texas academic contest that tests students on programming (in Java), computer science theory, and logic under timed pressure. Teams write short programs to solve problems, answer written questions on data structures and algorithms, and compete individually and as a team at invitational, district, regional, and state meets throughout the year.'),
    h('p',{class:'prose'},"The Highland Park High School team is open to any Scot who wants to get better at programming and problem-solving, whether you've never written a line of code or you're already an expert. We practice together weekly, work through past contests, and travel to meets across the region."),
    h('p',{class:'prose'},'New members are always welcome — come to a Wednesday practice to see what it’s about.'),
  ]);
}
function Captains(){
  return h('div',{class:'page fade', style:'max-width:680px;'},[
    h('span',{class:'eyebrow'},'Leadership'),
    h('h1',{class:'h1'},'Team Captains'),
    h('div',{class:'stack'}, CAPTAINS.map(c=>
      personCard({
        placeholder:'Drop captain photo',
        imgSrc:c.imgSrc,
        name:c.name,
        role:c.role,
        bio:c.bio || 'Bio coming soon — check back after this season kicks off.',
      })
    )),
  ]);
}
function Coaching(){
  return h('div',{class:'page fade', style:'max-width:680px;'},[
    h('span',{class:'eyebrow'},'Coaching Staff'),
    h('h1',{class:'h1'},'Meet the Coach'),
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
    h('p',{class:'note'},'Dates and locations are not finalized.'),
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
      block('Team Inbox', h('a',{href:'mailto:hp@uilcs.org', style:'font-size:16px;margin-top:4px;display:inline-block;'},'hp@uilcs.org')),
      h('div',{class:'contact-hr'}),
      block('Where we practice', h('div',{style:'font-size:16px;margin-top:4px;color:oklch(28% 0.01 258);'},'Highland Park High School — Wednesdays after school')),
    ]),
  ]);
}

/* ---------- router / render ---------- */
function CurrentPage(){
  switch(state.page){
    case 'home': return Home();
    case 'about': return About();
    case 'captains': return Captains();
    case 'coaching': return Coaching();
    case 'schedule': return Schedule();
    case 'contact': return Contact();
    default: return Home();
  }
}

function render(){ mount(CurrentPage, state.page); }

window.addEventListener('hashchange', () => {
  const p = pageFromHash();
  if (p === state.page) return;
  setState({ page:p });
  // A hash change isn't a real navigation, so the browser keeps the old scroll
  // position; landing halfway down a fresh page is disorienting.
  window.scrollTo(0, 0);
});

render();
