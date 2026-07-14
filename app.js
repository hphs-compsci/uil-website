"use strict";

/* ---------- constants ---------- */
const NAVY = "var(--navy)";
const GOLD = "var(--gold)";

/* ---------- topic list & question bank (from design) ---------- */
const TOPIC_LIST = ['Number Bases','Literal Expressions','Print & Output','String Methods','Boolean Logic','Math Class','Variable Expressions','Conditionals','Output Loops','1D Arrays','Scanner & File Input','Accumulation Loops','Order of Operations','Data Types & Memory','ArrayList Generics'];

const QUESTION_BANK = [
  { topic:'Number Bases', difficulty:'Medium', text:'What is the decimal value of 2C₁₆?',
    code:null, options:['44','28','32','50','40'], correct:0 },
  { topic:'Literal Expressions', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'int result = 7 + 3 * 2 - 4 / 2;\nSystem.out.println(result);', options:['11','9','13','6','8'], correct:0 },
  { topic:'Print & Output', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'int x = 7;\nSystem.out.printf("Value: %d\\n", x);\nSystem.out.println("Say \\"hi\\"");',
    options:['Value: 7\nSay "hi"','Value: 7\nSay \\"hi\\"','Value: %d\nSay "hi"','7\nSay "hi"','Value: 7 Say "hi"'], correct:0 },
  { topic:'String Methods', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'String s = "UIL Rocks";\nSystem.out.println(s.substring(4, 9).toUpperCase());',
    options:['ROCKS','Rocks','ROCK','ROCKS!','rocks'], correct:0 },
  { topic:'Boolean Logic', difficulty:'Medium', text:'What is output by the code to the right?',
    code:'boolean a = true, b = false, c = true;\nboolean r1 = a && b || c;\nboolean r2 = a || b && !c;\nboolean r3 = a ^ c;\nboolean r4 = !(a && c) || b;\nSystem.out.println("" + r1 + r2 + r3 + r4);',
    options:['truetruefalsefalse','falsetruetruefalse','truetruetruefalse','falsetruefalsefalse','falsefalsefalsefalse'], correct:0 },
  { topic:'Math Class', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'System.out.println(Math.max(Math.abs(-7), Math.min(9, 4)));', options:['7','4','9','-7','3'], correct:0 },
  { topic:'Variable Expressions', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'int a = 5, b = 2, c = 3;\nint result = a * b + c % b - a / c;\nSystem.out.println(result);', options:['10','9','11','8','12'], correct:0 },
  { topic:'Conditionals', difficulty:'Medium', text:'What is output by the code to the right?',
    code:'int x = 6, y = 4;\nString result = "";\nif (x > 5)\n    if (y > 5)\n        result = "A";\n    else\n        result = "B";\nelse if (x > 3)\n    result = "C";\nelse\n    result = "D";\n\nswitch (result) {\n    case "A":\n    case "B":\n        result += "1";\n    case "C":\n        result += "2";\n        break;\n    default:\n        result += "3";\n}\nSystem.out.println(result);',
    options:['B12','B1','C2','A12','B'], correct:0 },
  { topic:'Output Loops', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'for (int i = 1; i <= 4; i++) {\n    System.out.print(i + " ");\n}', options:['1 2 3 4 ','0 1 2 3 ','1 2 3 4','4 3 2 1 ','1 1 1 1 '], correct:0 },
  { topic:'1D Arrays', difficulty:'Easy', text:'What is output by the code to the right?',
    code:'int[] arr = {4, 8, 15, 16, 23};\nSystem.out.println(arr[1] + arr[arr.length - 1]);', options:['31','27','19','39','23'], correct:0 },
  { topic:'Scanner & File Input', difficulty:'Medium', text:'A user types 5 and presses Enter. After int n = input.nextInt(); runs, what does input.nextLine() return on the very next call?',
    code:'Scanner input = new Scanner(System.in);\nint n = input.nextInt();\nString line = input.nextLine();', options:['"" (the leftover newline)','"5"','null','throws an exception'], correct:0 },
  { topic:'Accumulation Loops', difficulty:'Medium', text:'What is output by the code to the right?',
    code:'int total = 0;\nfor (int i = 1; i <= 5; i++) {\n    total += i * i;\n}\nSystem.out.println(total);', options:['55','15','25','50','30'], correct:0 },
  { topic:'Order of Operations', difficulty:'Hard', text:'What is output by the code to the right?',
    code:'int a = 5;\nint b = 2;\nboolean result = a > b && ++a < 7 || a == 7;\nSystem.out.println(result + " " + a);', options:['true 6','true 7','false 6','true 5','false 7'], correct:0 },
  { topic:'Data Types & Memory', difficulty:'Hard', text:'What is output by the code to the right?',
    code:'byte b = 127;\nb++;\nSystem.out.println(b);', options:['-128','128','-1','0','127'], correct:0 },
  { topic:'ArrayList Generics', difficulty:'Medium', text:'What is output by the code to the right?',
    code:'ArrayList<Integer> list = new ArrayList<Integer>();\nlist.add(10);\nlist.add(20);\nlist.add(15);\nlist.remove(1);\nSystem.out.println(list.get(1));', options:['15','20','10','IndexOutOfBoundsException','0'], correct:0 },
];

/* ---------- content data (from design) ---------- */
const MEETS = [
  { name:'Invitational A', location:'Princeton High School', date:'January 08, 2027' },
  { name:'Invitational B', location:'Crandall High School', date:'Date TBD' },
  { name:'District Meet', location:'Highland Park High School', date:'Date TBD' },
  { name:'Regional Meet', location:'TBD', date:'Date TBD' },
  { name:'UIL State Meet', location:'Austin, TX', date:'Date TBD' },
];
const RESOURCES = [
  { name:'Java Quick Reference', desc:'Syntax and standard library cheat sheet', href:'#' },
  { name:'UIL CS Contest Format Guide', desc:'How written test + programming scoring works', href:'#' },
  { name:'Past UIL Tests Archive', desc:'Add link to shared drive of past tests', href:'#' },
  { name:'Data Structures Primer', desc:'Arrays, stacks, queues, trees', href:'#' },
];
const PAST_TESTS = [
  { name:'Fall Invitational Written Test', tag:'Full test · 2025', href:'#', level:'Easy' },
  { name:'District Written Test', tag:'Full test · 2025', href:'#', level:'Medium' },
  { name:'Regional Written Test', tag:'Full test · 2024', href:'#', level:'Hard' },
  { name:'State Written Test', tag:'Full test · 2024', href:'#', level:'Hard' },
];
const LEADERBOARD = [
  { rank:1, name:'Will Forsberg', score:'—' },
  { rank:2, name:'Team Member', score:'—' },
  { rank:3, name:'Team Member', score:'—' },
  { rank:4, name:'Team Member', score:'—' },
];
const STAT_CARDS = [
  { value:'142', label:'Average Score' },
  { value:'82%', label:'Accuracy' },
  { value:'156', label:'Questions Answered' },
  { value:'5', label:'Day Streak' },
];
const HEATMAP_LEVELS = [0,2,3,1,0,4,2,2,0,1,3,3,0,0,2,4,4,1,0,2,3,2,0,1,4,3,2,0,3,4,1,0,2,3,4];
const HEATMAP_COLORS = ['oklch(90% 0.006 90)','oklch(88% 0.05 85)','oklch(78% 0.1 85)','oklch(65% 0.13 85)','oklch(24% 0.05 258)'];

const NAV_PAGES = [
  { key:'home', label:'Home' },
  { key:'about', label:'About' },
  { key:'captains', label:'Captains' },
  { key:'coaching', label:'Coaching' },
  { key:'schedule', label:'Schedule' },
  { key:'contact', label:'Contact' },
  { key:'practice', label:'Practice' },
];
const PRACTICE_TABS = [
  { key:'problems', label:'Practice Problems' },
  { key:'resources', label:'Study Resources' },
  { key:'leaderboard', label:'Leaderboard' },
];

/* ---------- routing ---------- */
const VALID_PAGES = NAV_PAGES.map(p => p.key);
function pageFromHash(){
  const key = (location.hash || '').replace(/^#\/?/, '');
  return VALID_PAGES.includes(key) ? key : 'home';
}

/* ---------- state ---------- */
const state = {
  page:pageFromHash(),
  signedIn:false,
  signInName:'',
  signInEmail:'',
  practiceTab:'problems',
  problemsView:'menu',              // menu | generator | quiz | pastTests
  difficulties:{ Easy:true, Medium:true, Hard:true },
  topicQty:Object.fromEntries(TOPIC_LIST.map((t,i)=>[t, i===0?1:0])),
  generatedQuestions:[],
  quizAnswers:{},
  quizSubmitted:false,
};

function setState(patch){ Object.assign(state, patch); render(); }

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

/* ---------- actions ---------- */
function setPage(p){
  // Update the URL hash; the hashchange handler applies it to state.
  // Fall back to a direct state update if the hash is already current (no event fires).
  if (pageFromHash() === p) setState({ page:p });
  else location.hash = p;
}
function goProblemsMenu(){ setState({ problemsView:'menu' }); }
function goGenerator(){ setState({ problemsView:'generator' }); }
function goPastTests(){ setState({ problemsView:'pastTests' }); }
function setPracticeTab(t){ setState({ practiceTab:t }); }
function toggleDifficulty(d){ setState({ difficulties:{ ...state.difficulties, [d]:!state.difficulties[d] } }); }
function setTopicQty(t, qty){ setState({ topicQty:{ ...state.topicQty, [t]:qty } }); }
function presetNone(){ setState({ topicQty:Object.fromEntries(TOPIC_LIST.map(t=>[t,0])) }); }
function presetFull15(){ setState({ topicQty:Object.fromEntries(TOPIC_LIST.map(t=>[t,1])) }); }
function presetAll(){ setState({ topicQty:Object.fromEntries(TOPIC_LIST.map(t=>[t,3])) }); }

function generateQuiz(){
  const pool = [];
  TOPIC_LIST.forEach(t=>{
    const qty = state.topicQty[t] || 0;
    const q = QUESTION_BANK.find(q=>q.topic===t);
    if (q && state.difficulties[q.difficulty]){
      for (let i=0;i<qty;i++) pool.push(q);
    }
  });
  setState({ generatedQuestions:pool, quizAnswers:{}, quizSubmitted:false, problemsView:'quiz' });
}
function selectAnswer(qi, oi){
  if (state.quizSubmitted) return;
  setState({ quizAnswers:{ ...state.quizAnswers, [qi]:oi } });
}
function submitQuiz(){ setState({ quizSubmitted:true }); }

function handleSignIn(e){
  e.preventDefault();
  if (state.signInName.trim()) setState({ signedIn:true });
}
function signOut(){ setState({ signedIn:false, signInName:'', signInEmail:'' }); }

/* ---------- views ---------- */
function Nav(){
  const links = NAV_PAGES.map(p=>{
    const active = state.page === p.key;
    return h('button', {
      class:'navlink' + (active?' active':''),
      onClick:()=>setPage(p.key),
    }, p.label);
  });
  return h('div',{class:'nav'},[
    h('button',{class:'brand', onClick:()=>setPage('home')},[
      h('img',{src:'assets/hp-logo.webp', alt:'Highland Park Scots logo', onError:(e)=>{ e.target.src='assets/scots-logo.svg'; }}),
      h('div',{style:'display:flex;flex-direction:column;align-items:flex-start;line-height:1.1;gap:4px;text-align:left;'},[
        h('span',{class:'t1'},'Highland Park UIL CS'),
        h('span',{class:'t2'},'SCOTS COMPUTER SCIENCE'),
      ]),
    ]),
    h('div',{class:'navlinks'}, links),
  ]);
}

function imgSlot(text, imgSrc){
  if (imgSrc) return h('img',{class:'slot-img', src:imgSrc, alt:text,
    onError:(e)=>{ e.target.replaceWith(h('div',{class:'imgslot'}, text)); }});
  return h('div',{class:'imgslot'}, text);
}

function Home(){
  return h('div',{class:'home fade'},[
    h('div',{class:'hero'},[
      h('div',{class:'hero-copy'},[
        h('span',{class:'eyebrow'},'Highland Park High School'),
        h('h1',null,'UIL Computer Science'),
        h('p',null,'Scots writing code, solving problems, and competing across Texas. We build programmers who think fast, debug faster, and never leave a semicolon behind.'),
        h('div',{class:'cta-row'},[
          h('button',{class:'btn btn-gold', onClick:()=>setPage('captains')},'Meet the Captains'),
          h('button',{class:'btn btn-ghost', onClick:()=>setPage('schedule')},'View Schedule'),
        ]),
      ]),
      h('div',{class:'hero-photo'}, imgSlot("Drop last year's team photo here", 'assets/team.webp')),
    ]),
    h('div',{class:'stats'},[
      stat('Tuesdays','Weekly practice, after school'),
      stat('Grades 9–12','Open to every Scot'),
      stat('All Levels','No experience required'),
    ]),
  ]);
}
function stat(big, sub){
  return h('div',{class:'stat'},[ h('div',{class:'big'},big), h('div',{class:'sub'},sub) ]);
}

function About(){
  return h('div',{class:'page fade', style:'max-width:820px;'},[
    h('span',{class:'eyebrow'},'About'),
    h('h1',{class:'h1'},'What we do'),
    h('p',{class:'prose'},'UIL Computer Science is a Texas academic contest that tests students on programming (in Java), computer science theory, and logic under timed pressure. Teams write short programs to solve problems, answer written questions on data structures and algorithms, and compete individually and as a team at invitational, district, regional, and state meets throughout the year.'),
    h('p',{class:'prose'},"The Highland Park High School team is open to any Scot who wants to get better at programming and problem-solving, whether you've never written a line of code or you're already deep into AP Computer Science. We practice together weekly, work through past contests, and travel to meets across the region."),
    h('p',{class:'prose'},'New members are always welcome — come to a Tuesday practice to see what it’s about.'),
  ]);
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

function Captains(){
  return h('div',{class:'page fade', style:'max-width:680px;'},[
    h('span',{class:'eyebrow'},'Leadership'),
    h('h1',{class:'h1'},'Team Captains'),
    personCard({
      placeholder:'Drop captain photo',
      name:'Will Forsberg',
      role:'TEAM CAPTAIN',
      bio:'Bio coming soon — check back after this season kicks off.',
    }),
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
      bio:'Coach Jones leads the HPHS UIL Computer Science team, guiding students through contest prep, coding practice, and competition-day strategy.',
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
    h('p',{class:'note'},'dates/locations are placeholders — update once the UIL calendar is finalized'),
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
      block('Team Inbox', h('a',{href:'mailto:uilcs@hphs.hpisd.org', style:'font-size:16px;margin-top:4px;display:inline-block;'},'uilcs@hphs.hpisd.org')),
      h('div',{class:'contact-hr'}),
      block('Where we practice', h('div',{style:'font-size:16px;margin-top:4px;color:oklch(28% 0.01 258);'},'Highland Park High School — Tuesdays after school')),
    ]),
  ]);
}

/* ----- practice: sign-in ----- */
function SignIn(){
  const form = h('form',{class:'signin', onSubmit:handleSignIn},[
    h('div',{style:'text-align:center;margin-bottom:6px;'},[
      h('img',{src:'assets/hp-monogram.webp', alt:'HP monogram', onError:(e)=>{ e.target.src='assets/hp-monogram.svg'; }}),
      h('h2',null,'Team Sign In'),
      h('p',{class:'lede'},'Practice materials are for HPHS UIL CS team members only.'),
    ]),
    h('input',{ type:'text', placeholder:'Name', required:'true', value:state.signInName,
      onInput:(e)=>{ state.signInName = e.target.value; } }),
    h('input',{ type:'email', placeholder:'you@hpisd.org', required:'true', value:state.signInEmail,
      onInput:(e)=>{ state.signInEmail = e.target.value; } }),
    h('button',{type:'submit'},'Sign In'),
  ]);
  return h('div',{class:'signin-wrap'}, form);
}

/* ----- practice: dashboard ----- */
function Practice(){
  if (!state.signedIn) return SignIn();

  const tabs = h('div',{class:'tabs'}, PRACTICE_TABS.map(t=>
    h('button',{ class:'tab'+(state.practiceTab===t.key?' active':''), onClick:()=>setPracticeTab(t.key) }, t.label)
  ));

  let mainContent;
  if (state.practiceTab === 'problems') mainContent = ProblemsPane();
  else if (state.practiceTab === 'resources') mainContent = ResourcesPane();
  else mainContent = LeaderboardPane();

  return h('div',{class:'practice'},[
    h('div',{class:'practice-head'},[
      h('div',null,[
        h('span',{class:'eyebrow'},'Members Only'),
        h('h1',null,'Welcome, '+state.signInName),
      ]),
      h('button',{class:'signout', onClick:signOut},'Sign out'),
    ]),
    tabs,
    h('div',{class:'practice-grid'},[
      h('div',{class:'practice-main'}, mainContent),
      Sidebar(),
    ]),
  ]);
}

function ProblemsPane(){
  if (state.problemsView === 'menu') return ProblemsMenu();
  if (state.problemsView === 'generator') return Generator();
  if (state.problemsView === 'quiz') return QuizView();
  if (state.problemsView === 'pastTests') return PastTests();
}

function ProblemsMenu(){
  const card = (title, desc, onClick) => h('div',{class:'menu-card', onClick},[
    h('div',null,[ h('div',{class:'title'},title), h('div',{class:'desc'},desc) ]),
    h('div',{class:'pill'},'Easy–Hard'),
  ]);
  return h('div',{class:'stack'},[
    card('Custom Generated Questions','Pick topics and difficulty, get a fresh multiple-choice set, and see your score.', goGenerator),
    card('Past UIL Written Tests','Full past contest tests to work through at your own pace.', goPastTests),
  ]);
}

function Generator(){
  const diffChips = h('div',{class:'chips'}, ['Easy','Medium','Hard'].map(d=>
    h('button',{ class:'chip'+(state.difficulties[d]?' on':''), onClick:()=>toggleDifficulty(d) }, d)
  ));
  const topicRows = TOPIC_LIST.map((t,i)=>{
    const qty = state.topicQty[t] || 0;
    return h('div',{class:'topic-row'},[
      h('div',{class:'num'}, (i+1)+'.'),
      h('div',{class:'label'}, t),
      h('input',{ type:'range', min:'0', max:'5', step:'1', value:String(qty),
        onInput:(e)=>setTopicQty(t, Number(e.target.value)) }),
      h('div',{class:'qty'}, qty),
    ]);
  });
  return h('div',null,[
    h('button',{class:'back', onClick:goProblemsMenu},'← Back'),
    h('div',{class:'gen-card'},[
      h('div',null,[
        h('div',{class:'field-label'},'Difficulty'),
        diffChips,
      ]),
      h('div',null,[
        h('div',{style:'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;'},[
          h('div',{class:'field-label', style:'margin-bottom:0;'},'Topics'),
          h('div',{style:'display:flex;gap:8px;flex-wrap:wrap;'},[
            h('button',{class:'preset', onClick:presetNone},'None'),
            h('button',{class:'preset', onClick:presetFull15},'Full 15 (1 each)'),
            h('button',{class:'preset', onClick:presetAll},'All Difficulties (3 each)'),
          ]),
        ]),
        h('div',{style:'display:flex;flex-direction:column;gap:14px;'}, topicRows),
      ]),
      h('button',{class:'btn-navy', style:'align-self:flex-start;', onClick:generateQuiz},'Generate Practice Set'),
    ]),
  ]);
}

function QuizView(){
  const total = state.generatedQuestions.length;
  const correct = state.generatedQuestions.filter((q,qi)=>state.quizAnswers[qi]===q.correct).length;
  const scoreText = total ? correct+' / '+total : '0 / 0';

  const questions = state.generatedQuestions.map((q,qi)=>{
    const opts = q.options.map((label,oi)=>{
      const selected = state.quizAnswers[qi] === oi;
      let bg='transparent', color='oklch(28% 0.01 258)';
      if (state.quizSubmitted){
        if (oi === q.correct){ bg='oklch(95% 0.05 145)'; color='oklch(30% 0.1 145)'; }
        else if (selected){ bg='oklch(95% 0.05 25)'; color='oklch(35% 0.14 25)'; }
      } else if (selected){ bg='oklch(94% 0.03 258)'; color=NAVY; }
      return h('button',{ class:'opt', style:`background:${bg};color:${color};`, onClick:()=>selectAnswer(qi,oi) },[
        h('span',{class:'letter'}, String.fromCharCode(65+oi)+')'),
        h('span',{class:'lab'}, label),
      ]);
    });
    const topicNum = TOPIC_LIST.indexOf(q.topic)+1;
    const body = h('div',{class:'q-body', style:`grid-template-columns:${q.code?'1fr 1fr':'1fr'};`},[
      h('div',{class:'prompt'},[
        h('div',{class:'text'}, q.text),
        h('div',{class:'opts'}, opts),
      ]),
      q.code ? h('pre',{class:'q-code'}, q.code) : null,
    ]);
    return h('div',{class:'q'},[
      h('div',{class:'q-head'},[
        h('span',{class:'n'}, `Question ${qi+1} (${topicNum})`),
        h('span',{class:'d'}, q.difficulty),
      ]),
      body,
    ]);
  });

  return h('div',null,[
    h('button',{class:'back', onClick:goProblemsMenu},'← Back to Practice Problems'),
    state.quizSubmitted ? h('div',{class:'scorebar'},[
      h('div',{class:'txt'}, 'Score: '+scoreText),
      h('button',{class:'new', onClick:generateQuiz},'New Set'),
    ]) : null,
    h('div',{style:'display:flex;flex-direction:column;gap:20px;'}, questions),
    (!state.quizSubmitted && total>0) ? h('button',{class:'btn-navy', style:'margin-top:20px;', onClick:submitQuiz},'Submit Answers') : null,
    (total===0) ? h('p',{class:'note', style:'margin-top:20px;'},'No questions selected — go back and pick some topics.') : null,
  ]);
}

function PastTests(){
  return h('div',null,[
    h('button',{class:'back', onClick:goProblemsMenu},'← Back'),
    h('div',{class:'stack'}, PAST_TESTS.map(p=>
      h('a',{href:p.href, class:'menu-card', style:'text-decoration:none;'},[
        h('div',null,[
          h('div',{class:'title'},p.name),
          h('div',{class:'desc'},p.tag),
        ]),
        h('div',{class:'pill'}, p.level),
      ])
    )),
  ]);
}

function ResourcesPane(){
  return h('div',{class:'stack'}, RESOURCES.map(r=>
    h('a',{href:r.href, class:'menu-card', style:'text-decoration:none;'},[
      h('div',null,[
        h('div',{class:'title'},r.name),
        h('div',{class:'desc'},r.desc),
      ]),
      h('div',{style:'font-size:13px;color:oklch(45% 0.1 258);'},'Open →'),
    ])
  ));
}

function LeaderboardPane(){
  return h('div',{class:'lb'},[
    h('div',{class:'lb-head'},[ h('div',null,'#'), h('div',null,'Member'), h('div',{class:'r'},'Score') ]),
    ...LEADERBOARD.map(row=>
      h('div',{class:'lb-row'},[
        h('div',{class:'rank'}, row.rank),
        h('div',{class:'nm'}, row.name),
        h('div',{class:'sc'}, row.score),
      ])
    ),
    h('p',{class:'note', style:'padding:14px 20px;margin:0;'},'placeholder scores — wire up to real practice-meet results'),
  ]);
}

function Sidebar(){
  const statRows = STAT_CARDS.map(s=>
    h('div',{class:'statrow'},[ h('div',{class:'l'},s.label), h('div',{class:'v'},s.value) ])
  );
  const cells = HEATMAP_LEVELS.map(level=>
    h('div',{class:'hm-cell', style:`background:${HEATMAP_COLORS[level]};`})
  );
  return h('div',{class:'side'},[
    h('div',{class:'title'},'Your Performance'),
    h('div',{class:'statlist'}, statRows),
    h('div',{class:'hm-label'},'Last 5 weeks'),
    h('div',{class:'heatmap-wrap'}, h('div',{class:'heatmap'}, cells)),
    h('div',{class:'ph'},'placeholder data'),
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
    case 'practice': return Practice();
    default: return Home();
  }
}

function Footer(){
  return h('div',{class:'footer'},
    h('span',null,'Highland Park High School · UIL Computer Science · hphs.uilcs.org')
  );
}

function render(){
  const root = document.getElementById('root');
  root.innerHTML = '';
  root.appendChild(
    h('div',{class:'app'},[ Nav(), h('main',{class:'content'}, CurrentPage()), Footer() ])
  );
}

// Sync state when the hash changes (nav clicks, back/forward, manual edits).
window.addEventListener('hashchange', () => {
  const p = pageFromHash();
  if (p !== state.page) setState({ page:p });
});

render();
