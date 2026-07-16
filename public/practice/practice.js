"use strict";

/* Practice app. Served from /practice/, which Cloudflare Access gates.
   Identity comes from the Access JWT via /api/me — there is no client-side
   sign-in to bypass, because the page itself is unreachable without auth. */

const TOPIC_LIST = ['Number Bases','Literal Expressions','Print & Output','String Methods','Boolean Logic','Math Class','Variable Expressions','Conditionals','Output Loops','1D Arrays','Scanner & File Input','Accumulation Loops','Order of Operations','Data Types & Memory','ArrayList Generics'];
const RESOURCES = [
  { name:'Java Quick Reference', desc:'Syntax and standard library cheat sheet',
    href:'https://javacheatsheet.vercel.app/' },
  { name:'UIL CS Contest Format Guide', desc:'The official 2025–26 Java topic list',
    href:'https://www.uiltexas.org/files/academics/UILCS-JavaTopicList2526.pdf' },
  { name:'Past UIL Tests Archive', desc:'Shared drive of past contest tests',
    href:'https://drive.google.com/drive/folders/1KjrekcfWCzct9wFcUj6x_9LwbK3n2cQu' },
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
const PRACTICE_TABS = [
  { key:'problems', label:'Practice Problems' },
  { key:'resources', label:'Study Resources' },
  { key:'leaderboard', label:'Leaderboard' },
];
const CHOICE_LETTERS = ['A','B','C','D','E'];

const state = {
  user: null,
  practiceTab:'problems',
  problemsView:'menu',              // menu | generator | quiz | pastTests
  difficulties:{ Easy:true, Medium:true, Hard:true },
  topicQty:Object.fromEntries(TOPIC_LIST.map((t,i)=>[t, i===0?1:0])),
  generatedQuestions:[],
  quizAnswers:{},
  quizSubmitted:false,
  generating:false,
  generateError:null,
};

function setState(patch){ Object.assign(state, patch); render(); }

/* ---------- number-base notation ---------- */
// Questions write bases as `265_8` or `B5_(16)`. Render the suffix as a real
// subscript.
//
// The catch: Java also uses `_` as a digit separator, and the banks contain
// both `0b1010_1100` and bare `0100_0011`. Those must stay literal. Two things
// keep them out: the suffix must be a valid radix (2-36), and a leading zero
// disqualifies it — no one writes base 08, but `0100_0011` is exactly that
// shape. Parenthesised suffixes are unambiguous, so they skip the checks.
const BASE_NOTATION = /\b([0-9A-Za-z]+)_(?:\((\d{1,2})\)|(\d{1,2}))(?![\w(])/g;

function isPlausibleBase(digits, parenthesised){
  if (parenthesised) return true;
  if (digits.length > 1 && digits[0] === '0') return false;  // 0100_0011
  const n = Number(digits);
  return n >= 2 && n <= 36;
}

// Returns an array of strings and <sub> elements for h() to append. Text is
// never parsed as HTML, so model output can't inject markup.
function withSubscripts(text){
  const src = String(text ?? '');
  const out = [];
  let last = 0;
  BASE_NOTATION.lastIndex = 0;
  for (let m; (m = BASE_NOTATION.exec(src)) !== null; ){
    const [full, value, paren, bare] = m;
    const digits = paren ?? bare;
    if (!isPlausibleBase(digits, paren !== undefined)) continue;
    if (m.index > last) out.push(src.slice(last, m.index));
    out.push(value, h('sub', null, digits));
    last = m.index + full.length;
  }
  if (!out.length) return [src];
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/* ---------- actions ---------- */
// Switching tab or view swaps the whole pane, so keeping the old scroll offset
// drops you into the middle of the new one. Only the navigation actions reset
// it — a slider drag or an answer click must not move the page.
function toTop(){ window.scrollTo(0, 0); }
function setPracticeTab(t){ setState({ practiceTab:t }); toTop(); }
function goProblemsMenu(){ setState({ problemsView:'menu' }); toTop(); }
function goGenerator(){ setState({ problemsView:'generator' }); toTop(); }
function goPastTests(){ setState({ problemsView:'pastTests' }); toTop(); }
function toggleDifficulty(d){ setState({ difficulties:{ ...state.difficulties, [d]:!state.difficulties[d] } }); }
function setTopicQty(t, qty){ setState({ topicQty:{ ...state.topicQty, [t]:qty } }); }
function presetNone(){ setState({ topicQty:Object.fromEntries(TOPIC_LIST.map(t=>[t,0])) }); }
function presetFull15(){ setState({ topicQty:Object.fromEntries(TOPIC_LIST.map(t=>[t,1])) }); }
function presetAll(){ setState({ topicQty:Object.fromEntries(TOPIC_LIST.map(t=>[t,3])) }); }
function toApiSpec(topicQty){
  const spec = {};
  TOPIC_LIST.forEach((t,i)=>{
    const qty = topicQty[t] || 0;
    if (qty > 0) spec[String(i+1)] = qty;
  });
  return spec;
}
function toUiQuestion(apiQuestion, topicName){
  const options = CHOICE_LETTERS.map(l=>apiQuestion.choices?.[l]).filter(v=>v != null);
  return {
    topic: topicName,
    difficulty: 'Medium',
    text: apiQuestion.stem,
    code: apiQuestion.code || null,
    options,
    correct: Math.max(0, CHOICE_LETTERS.indexOf(apiQuestion.answer)),
    explanation: apiQuestion.explanation,
    verified: apiQuestion.verified,
  };
}
async function generateQuiz(){
  const spec = toApiSpec(state.topicQty);
  if (Object.keys(spec).length === 0){
    setState({ generateError:'Pick at least one topic first.' });
    return;
  }

  // Scroll once as we leave the topic list; the streaming updates below
  // re-render repeatedly and must not keep yanking the page back up.
  toTop();
  setState({
    generatedQuestions:[], quizAnswers:{}, quizSubmitted:false,
    generating:true, generateError:null, problemsView:'quiz',
  });

  try {
    const res = await fetch('/api/generate', {
      method:'POST',
      headers:{ 'content-type':'application/json' },
      body: JSON.stringify(spec),
    });
    if (!res.ok){
      const body = await res.json().catch(()=>({}));
      throw new Error(body.error || `Request failed (${res.status}).`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // Results stream as one JSON object per line, in completion order.
    const handleLine = (line)=>{
      if (!line.trim()) return;
      let result;
      try { result = JSON.parse(line); } catch { return; }
      if (!Array.isArray(result.questions)) return;
      const topicName = TOPIC_LIST[result.question_number - 1] || result.topic;
      const incoming = result.questions.map(q=>toUiQuestion(q, topicName));
      // Append to the live array — topics finish independently, so each result
      // must build on whatever has already arrived.
      state.generatedQuestions.push(...incoming);
      setState({ generatedQuestions: state.generatedQuestions });
    };

    for (;;){
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream:true });
      const lines = buffer.split('\n');
      buffer = lines.pop();          // last piece may be a partial line
      lines.forEach(handleLine);
    }
    handleLine(buffer);              // flush any trailing line

    setState({ generating:false });
    if (state.generatedQuestions.length === 0){
      setState({ generateError:'The generator returned no usable questions. Try again.' });
    }
  } catch (err) {
    setState({ generating:false, generateError:String(err.message || err) });
  }
}
function selectAnswer(qi, oi){
  if (state.quizSubmitted) return;
  setState({ quizAnswers:{ ...state.quizAnswers, [qi]:oi } });
}
function submitQuiz(){ setState({ quizSubmitted:true }); }
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
    card('The First 15 (AI Generated)','Pick topics and difficulty, get a fresh multiple-choice set, and see your score.', goGenerator),
    card('Past UIL Written Tests (Under Construction)','Full past contest tests to work through at your own pace.', goPastTests),
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
      h('button',{
        class:'btn-navy', style:'align-self:flex-start;',
        onClick:generateQuiz, disabled:state.generating,
      }, state.generating ? 'Generating…' : 'Generate Practice Set'),
      state.generateError ? h('p',{class:'note', style:'margin-top:12px;color:oklch(50% 0.18 25);'}, state.generateError) : null,
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
        h('span',{class:'lab'}, withSubscripts(label)),
      ]);
    });
    const topicNum = TOPIC_LIST.indexOf(q.topic)+1;
    const body = h('div',{class:'q-body', style:`grid-template-columns:${q.code?'1fr 1fr':'1fr'};`},[
      h('div',{class:'prompt'},[
        h('div',{class:'text'}, withSubscripts(q.text)),
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
      // The code block is deliberately excluded: `_` there is Java's digit
      // separator, not base notation.
      (state.quizSubmitted && q.explanation) ? h('div',{class:'q-explain'},[
        h('span',{class:'lbl'},'Explanation'),
        h('span',null, withSubscripts(q.explanation)),
      ]) : null,
    ]);
  });

  return h('div',null,[
    h('button',{class:'back', onClick:goProblemsMenu},'← Back to Practice Problems'),
    state.quizSubmitted ? h('div',{class:'scorebar'},[
      h('div',{class:'txt'}, 'Score: '+scoreText),
      h('button',{class:'new', onClick:generateQuiz},'New Set'),
    ]) : null,
    h('div',{style:'display:flex;flex-direction:column;gap:20px;'}, questions),
    // Questions stream in topic by topic, so this sits below whatever has
    // arrived so far rather than replacing the list.
    state.generating ? h('p',{class:'note', style:'margin-top:20px;'},
      total ? 'Generating more questions…' : 'Generating questions with AI — this takes a few seconds.') : null,
    state.generateError ? h('p',{class:'note', style:'margin-top:20px;color:oklch(50% 0.18 25);'}, state.generateError) : null,
    (!state.quizSubmitted && total>0 && !state.generating) ? h('button',{class:'btn-navy', style:'margin-top:20px;', onClick:submitQuiz},'Submit Answers') : null,
    (total===0 && !state.generating && !state.generateError) ? h('p',{class:'note', style:'margin-top:20px;'},'No questions selected — go back and pick some topics.') : null,
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
  // These all point off-site, so open them in a new tab rather than dropping
  // someone out of a practice session.
  return h('div',{class:'stack'}, RESOURCES.map(r=>
    h('a',{href:r.href, class:'menu-card', style:'text-decoration:none;',
           target:'_blank', rel:'noopener noreferrer'},[
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

/* ---------- shell ---------- */
function Practice(){
  const tabs = h('div',{class:'tabs'}, PRACTICE_TABS.map(t=>
    h('button',{ class:'tab'+(state.practiceTab===t.key?' active':''), onClick:()=>setPracticeTab(t.key) }, t.label)
  ));

  let mainContent;
  if (state.practiceTab === 'problems') mainContent = ProblemsPane();
  else if (state.practiceTab === 'resources') mainContent = ResourcesPane();
  else mainContent = LeaderboardPane();

  // Answering questions wants the width — stems and code sit side by side — so
  // drop the sidebar and let the grid collapse to a single column.
  const wide = state.practiceTab === 'problems' && state.problemsView === 'quiz';

  return h('div',{class:'practice'},[
    h('div',{class:'practice-head'},[
      h('div',null,[
        h('span',{class:'eyebrow'},'Members Only'),
        h('h1',null,'Welcome, '+(state.user || '')),
      ]),
      // Access owns the session; this ends it for real.
      h('a',{class:'signout', href:'/cdn-cgi/access/logout'},'Sign out'),
    ]),
    tabs,
    h('div',{class:'practice-grid' + (wide ? ' full' : '')},[
      h('div',{class:'practice-main'}, mainContent),
      wide ? null : Sidebar(),
    ]),
  ]);
}

function render(){ mount(Practice, 'practice'); }

// Ask the Worker who Access says we are, then draw.
(async function init(){
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      const me = await res.json();
      // The Worker derives a display name from the verified email; don't fall
      // back to the raw address here or we'd undo that.
      state.user = me.name;
    }
  } catch {}
  render();
})();
