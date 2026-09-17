if (false) {
const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
const TOTAL_SECONDS = 30 * 60;

const stages = [
  {
    id: 'classroom', image: 'assets/classroom.webp', location: '2층 일반교실', kicker: 'CHAPTER 01 · 관찰', title: '멈춘 전자칠판',
    story: '야간 점검 중 전자칠판이 잠겼다. 교실에 흩어진 세 단어를 먼저 찾아야 화면이 켜진다.',
    difficulty: 1, hint: '화면 위, 태극기 근처, 오른쪽 출입문 쪽을 살펴보세요.', type: 'hotspot',
    hotspots: [{x:47,y:13,w:'HAVE'},{x:18,y:27,w:'YOU'},{x:91,y:36,w:'EVER'}],
    prompt: '찾은 단어 뒤에 알맞은 말을 붙여 문장을 완성하세요.',
    question: 'Have you ever ___ Chuncheon?', options: ['visit','visited','visiting'], answer: 'visited'
  },
  {
    id: 'homebase', image: 'assets/homebase.webp', location: '2층 홈베이스', kicker: 'CHAPTER 02 · 어휘', title: '잠긴 파란 사물함',
    story: '사물함 번호표 대신 영어 뜻풀이가 남아 있다. 올바른 단어를 세 번 골라 잠금 장치를 해제하자.',
    difficulty: 1, hint: 'travel은 여행, pleasure는 즐거움을 뜻해요. protect는 보호하다입니다.', type: 'vocab',
    rounds: [
      {q:'a person who travels to a place for pleasure', a:'tourist', o:['tourist','battle','display']},
      {q:'a person who wears a uniform and protects a country', a:'soldier', o:['visitor','soldier','tie']},
      {q:'to show great respect to someone', a:'honor', o:['build','fight','honor']}
    ], fragment:['유일한 나라','ONLY']
  },
  {
    id: 'dream', image: 'assets/dream.webp', location: '꿈나래터 계단', kicker: 'CHAPTER 03 · 의사소통', title: '거꾸로 흩어진 질문',
    story: '계단 끝 벽면의 문장이 뒤섞여 있다. 여행 소감을 묻는 질문이 되도록 단어 카드를 순서대로 누르자.',
    difficulty: 2, hint: 'How로 시작하고, 물음표가 있는 카드가 마지막입니다.', type: 'order',
    words:['it?','like','How','you','did'], answer:['How','did','you','like','it?']
  },
  {
    id: 'digital', image: 'assets/digital.webp', location: 'DS실', kicker: 'CHAPTER 04 · 문법', title: '여행 가방 스캐너',
    story: '여행 가방 속 물건과 그 쓰임을 정확히 연결해야 검색대가 열린다. 명사를 뒤에서 꾸미는 to부정사를 사용하자.',
    difficulty: 2, hint: 'pen은 write with처럼 전치사 with를 끝에 남겨야 해요.', type: 'match',
    rows:[
      {label:'snacks',answer:'to eat',options:['to eat','to wear','to write with']},
      {label:'a pen',answer:'to write with',options:['to read','to write with','to drink']},
      {label:'water',answer:'to drink',options:['to visit','to drink','to display']}
    ], fragment:['전시 장소','SECOND']
  },
  {
    id: 'library', image: 'assets/library.webp', location: '3층 도서관', kicker: 'CHAPTER 05 · 본문 독해', title: '사라진 우정의 기록',
    story: '도서관 기록 카드 세 장 중 일부가 조작되었다. 춘천과 에티오피아의 실제 인연과 일치하는지 판별하자.',
    difficulty: 3, hint: '에티오피아는 군인을 보낸 유일한 아프리카 국가였고, 군인들은 아이들을 돕기 위해 자신들의 돈을 썼습니다.', type: 'tf',
    rows:[
      {q:'Ethiopia was the only African country to send soldiers during the Korean War.',a:true},
      {q:'Ethiopian soldiers used their own money to help Korean children.',a:true},
      {q:'The Memorial Hall in Chuncheon has two square roofs.',a:false}
    ], fragment:['기념관 지붕','THREE']
  },
  {
    id: 'study', image: 'assets/study.webp', location: '미디어월드 스터디카페', kicker: 'CHAPTER 06 · 현재완료', title: '여행자의 타임라인',
    story: '여행가 Kate의 기록이 과거와 현재 사이에서 끊어졌다. 현재완료 형태를 모두 복구해야 마지막 장소가 열린다.',
    difficulty: 4, hint: '현재완료는 have/has + 과거분사입니다. Kate는 3인칭 단수예요.', type: 'grammar',
    sentence:[
      {pre:'Kate ',post:' a lot since 2015.',answer:'has traveled',options:['traveled','has traveled','have traveled']},
      {pre:'She ',post:' to Ethiopia once.',answer:'has been',options:['has been','was','have gone']},
      {pre:'She has never ',post:' Australia.',answer:'visited',options:['visit','visiting','visited']}
    ], fragment:['기념관 건립','2006']
  },
  {
    id: 'lounge', image: 'assets/lounge.webp', location: '오션 라운지', kicker: 'FINAL CHAPTER · 종합 추리', title: '피아노의 마지막 암호',
    story: '피아노 안에서 네 개의 기록 조각이 발견되었다. 조각의 뜻을 숫자로 바꿔 네 자리 암호를 완성하자.',
    difficulty: 5, hint: 'ONLY=1, SECOND=2, THREE=3, 2006은 마지막 숫자만 사용하세요.', type: 'code', answer:'1236'
  }
];

let state = {
  screen: 'start', stage: 0, seconds: TOTAL_SECONDS, hints: 0, mistakes: 0,
  found: [], selections: {}, fragments: [], startedAt: null, hintOpen: false
};
let timerId = null;

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem('oceanEscapeV1'));
    if(saved && saved.screen === 'game' && saved.stage < stages.length){
      state = {...state,...saved,hintOpen:false};
      if(saved.savedAt) state.seconds = Math.max(0, saved.seconds - Math.floor((Date.now()-saved.savedAt)/1000));
    }
  } catch(e) {}
}

function saveState(){
  if(state.screen === 'game') localStorage.setItem('oceanEscapeV1',JSON.stringify({...state,savedAt:Date.now()}));
}

function esc(s){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function stars(n){ return '●'.repeat(n)+'○'.repeat(5-n); }
function timeText(sec){ const m=Math.floor(sec/60),s=sec%60; return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function say(msg){ toast.textContent=msg; toast.classList.add('show'); clearTimeout(say.t); say.t=setTimeout(()=>toast.classList.remove('show'),2200); }
function fail(msg='다시 살펴보세요.'){ state.mistakes++; saveState(); say(msg); document.querySelector('.mission')?.classList.add('shake'); setTimeout(()=>document.querySelector('.mission')?.classList.remove('shake'),420); }

function startGame(){
  state={screen:'game',stage:0,seconds:TOTAL_SECONDS,hints:0,mistakes:0,found:[],selections:{},fragments:[],startedAt:Date.now(),hintOpen:false};
  saveState(); render(); startTimer();
}

function startTimer(){
  clearInterval(timerId);
  timerId=setInterval(()=>{
    if(state.screen!=='game') return;
    state.seconds=Math.max(0,state.seconds-1);
    const el=document.querySelector('.timer');
    if(el){ el.textContent=timeText(state.seconds); el.classList.toggle('danger',state.seconds<180); }
    if(state.seconds===0){ clearInterval(timerId); say('시간은 끝났지만, 끝까지 도전할 수 있어요!'); }
    if(state.seconds%10===0) saveState();
  },1000);
}

function hud(){
  const pct=(state.stage/stages.length)*100;
  return `<header class="hud">
    <div class="brand"><div class="brand-mark">O</div><div class="brand-copy"><strong>OCEAN ESCAPE</strong><small>UNIT 5 · DISCOVER KOREA</small></div></div>
    <div class="progress"><div class="progress-label"><span>탈출 진행도</span><b>${state.stage} / ${stages.length}</b></div><div class="progress-line"><div class="progress-fill" style="width:${pct}%"></div></div></div>
    <div class="hud-actions"><div class="timer ${state.seconds<180?'danger':''}" aria-label="남은 시간">${timeText(state.seconds)}</div><button class="icon-btn" data-action="hint">힌트</button><button class="icon-btn" data-action="restart" aria-label="게임 다시 시작">↻</button></div>
  </header>`;
}

function missionContent(s){
  if(s.type==='hotspot'){
    const words=s.hotspots.map((h,i)=>`<span class="word-chip ${state.found.includes(i)?'':'empty'}">${state.found.includes(i)?h.w:'?'}</span>`).join('');
    const ready=state.found.length===s.hotspots.length;
    return `<p class="prompt">${esc(s.prompt)}</p><div class="found-row">${words}</div>${ready?`<div class="clue-box">${esc(s.question)}</div><div class="choices">${s.options.map(o=>`<button class="choice" data-choice="${o}">${o}</button>`).join('')}</div>`:'<p class="micro">사진 속 파란 신호 3개를 찾아 누르세요.</p>'}`;
  }
  if(s.type==='vocab'){
    const r=state.selections.round||0, item=s.rounds[r];
    return `<p class="micro">단어 카드 ${r+1} / ${s.rounds.length}</p><div class="clue-box">${esc(item.q)}</div><div class="choices">${item.o.map(o=>`<button class="choice" data-vocab="${o}">${o}</button>`).join('')}</div>`;
  }
  if(s.type==='order'){
    const built=state.selections.order||[];
    return `<p class="prompt">여행에 대한 소감을 묻는 문장을 만드세요.</p><div class="sentence-slot">${built.length?built.map(w=>`<span class="word-chip">${esc(w)}</span>`).join(''):'<span class="micro">카드를 차례대로 선택하세요</span>'}</div><div class="tile-bank">${s.words.map((w,i)=>`<button class="tile" data-tile="${i}" ${built.includes(w)?'disabled':''}>${esc(w)}</button>`).join('')}</div><button class="secondary" data-action="clear-order">다시 배열</button>`;
  }
  if(s.type==='match'){
    return `<p class="prompt">각 물건의 쓰임을 알맞게 고르세요.</p><div class="match-list">${s.rows.map((r,i)=>`<div class="match-row"><label for="m${i}">${esc(r.label)}</label><select id="m${i}" data-match="${i}"><option value="">선택</option>${r.options.map(o=>`<option ${state.selections['m'+i]===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`).join('')}</div><button class="primary" data-action="check-match">검색대 열기</button>`;
  }
  if(s.type==='tf'){
    return `<p class="prompt">본문과 일치하면 T, 일치하지 않으면 F를 선택하세요.</p>${s.rows.map((r,i)=>`<div class="tf-row"><p>${esc(r.q)}</p><button class="tf-btn ${state.selections['tf'+i]===true?'active':''}" data-tf="${i}:1">T</button><button class="tf-btn ${state.selections['tf'+i]===false?'active':''}" data-tf="${i}:0">F</button></div>`).join('')}<button class="primary" data-action="check-tf">기록 판별하기</button>`;
  }
  if(s.type==='grammar'){
    return `<p class="prompt">괄호에 들어갈 현재완료 표현을 고르세요.</p><div class="match-list">${s.sentence.map((r,i)=>`<div><p class="micro">${esc(r.pre)} <b style="color:var(--cyan)">[ &nbsp; ? &nbsp; ]</b> ${esc(r.post)}</p><select data-grammar="${i}"><option value="">선택</option>${r.options.map(o=>`<option ${state.selections['g'+i]===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`).join('')}</div><button class="primary" data-action="check-grammar">타임라인 복구</button>`;
  }
  if(s.type==='code'){
    const frags=state.fragments.map(f=>`<div class="fragment"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('');
    return `<p class="prompt">각 기록 조각이 가리키는 숫자를 순서대로 입력하세요.</p><div class="fragment-grid">${frags}</div><input class="code-input" inputmode="numeric" maxlength="4" aria-label="네 자리 암호" placeholder="••••"><button class="primary" data-action="unlock">피아노 열기</button>`;
  }
}

function renderGame(){
  const s=stages[state.stage];
  const hotspots=s.type==='hotspot'?`<div class="hotspots">${s.hotspots.map((h,i)=>`<button class="hotspot ${state.found.includes(i)?'found':''}" style="left:${h.x}%;top:${h.y}%" data-hotspot="${i}" aria-label="숨은 단어 ${i+1}"></button>`).join('')}</div>`:'';
  app.innerHTML=`<main class="shell"><img class="scene-bg" src="${s.image}" alt=""><div>${hud()}<div class="game">
    <section class="scene" aria-label="${esc(s.location)}"><div class="location-chip"><span></span>${esc(s.location)}</div>${hotspots}<div class="chapter"><div class="chapter-kicker">${esc(s.kicker)}</div><h1>${esc(s.title)}</h1><p>${esc(s.story)}</p></div></section>
    <aside class="mission"><div class="mission-head"><div><div class="eyebrow">CURRENT MISSION</div><h2>${esc(s.title)}</h2></div><div class="difficulty">난이도<br><b>${stars(s.difficulty)}</b></div></div><div class="mission-body">${missionContent(s)}</div></aside>
  </div></div>${state.hintOpen?hintPanel(s):''}</main>`;
}

function hintPanel(s){
  return `<div class="scrim" data-action="close-hint"></div><aside class="hint-panel open" aria-modal="true" role="dialog" aria-label="힌트"><button class="icon-btn" data-action="close-hint" style="float:right">닫기</button><div class="eyebrow">FIELD NOTE</div><h2>수사관의 힌트</h2><p>${esc(s.hint)}</p><p class="hint-cost">힌트를 열 때마다 제한 시간 1분이 차감됩니다.</p></aside>`;
}

function renderStart(){
  const hasSave=localStorage.getItem('oceanEscapeV1');
  app.innerHTML=`<main class="start"><section class="start-card"><div class="start-tag">OCEAN MIDDLE SCHOOL · CASE 05</div><h1>사라진<br><span>우정의 기록</span></h1><p class="start-lead">학교에 남겨진 일곱 개의 잠금 장치를 풀고, 춘천과 에티오피아를 잇는 기록을 되찾으세요. 초반 단서는 눈앞에 있지만 마지막 암호는 5과의 모든 지식을 요구합니다.</p><div class="brief"><span>⏱ 제한 시간 30분</span><span>◆ 7개 장소</span><span>영어 2 · Unit 5</span></div><button class="primary" data-action="start">수사 시작</button>${hasSave?'<button class="secondary" data-action="continue" style="width:auto;padding:0 24px;margin-left:8px">이어하기</button>':''}</section></main>`;
}

function renderComplete(){
  clearInterval(timerId); localStorage.removeItem('oceanEscapeV1');
  const used=TOTAL_SECONDS-state.seconds;
  const rank=state.hints===0&&state.mistakes<3?'S':state.mistakes<7?'A':'B';
  app.innerHTML=`<main class="complete"><section class="complete-card"><div class="seal">✓</div><div class="eyebrow">MISSION COMPLETE</div><h1>기록을 되찾았습니다</h1><p>교실에서 시작한 단서가 오션 라운지의 피아노를 열었습니다.<br>두 나라를 이어 온 우정처럼, 배운 표현들도 하나의 이야기로 연결되었습니다.</p><div class="score"><div><b>${timeText(used)}</b><small>탈출 시간</small></div><div><b>${state.hints}</b><small>사용한 힌트</small></div><div><b>${rank}</b><small>수사 등급</small></div></div><button class="primary" data-action="restart-complete" style="width:auto;padding:0 30px">다시 도전하기</button></section></main>`;
}

function render(){
  if(state.screen==='start') renderStart(); else if(state.screen==='complete') renderComplete(); else renderGame();
}

function addFragment(s){ if(s.fragment && !state.fragments.some(f=>f[1]===s.fragment[1])) state.fragments.push(s.fragment); }
function completeStage(){
  const s=stages[state.stage]; addFragment(s); say('잠금 해제! 다음 장소로 이동합니다.');
  setTimeout(()=>{ state.stage++; state.found=[]; state.selections={}; if(state.stage>=stages.length) state.screen='complete'; saveState(); render(); },650);
}

app.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  const a=b.dataset.action;
  if(a==='start'){ localStorage.removeItem('oceanEscapeV1'); startGame(); return; }
  if(a==='continue'){ state.screen='game'; render(); startTimer(); return; }
  if(a==='restart'||a==='restart-complete'){ if(a==='restart-complete'||confirm('처음부터 다시 시작할까요?')) startGame(); return; }
  if(a==='hint'){ if(!state.hintOpen){ state.hintOpen=true; state.hints++; state.seconds=Math.max(0,state.seconds-60); saveState(); render(); } return; }
  if(a==='close-hint'){ state.hintOpen=false; render(); return; }
  if(b.dataset.hotspot!==undefined){ const i=+b.dataset.hotspot; if(!state.found.includes(i)){ state.found.push(i); say(`단어 ${stages[state.stage].hotspots[i].w} 발견!`); saveState(); render(); } return; }
  if(b.dataset.choice){ if(b.dataset.choice===stages[state.stage].answer) completeStage(); else fail('동사의 과거분사형이 필요해요.'); return; }
  if(b.dataset.vocab){ const s=stages[state.stage],r=state.selections.round||0; if(b.dataset.vocab===s.rounds[r].a){ if(r===s.rounds.length-1) completeStage(); else {state.selections.round=r+1;say('정답! 다음 뜻풀이입니다.');render();} } else fail('뜻풀이의 핵심 단어를 다시 확인하세요.'); return; }
  if(b.dataset.tile!==undefined){ const s=stages[state.stage],word=s.words[+b.dataset.tile],arr=state.selections.order||[]; arr.push(word); state.selections.order=arr; if(arr.length===s.answer.length){ if(arr.every((w,i)=>w===s.answer[i])) completeStage(); else {fail('어순이 맞지 않아요. 다시 배열해 보세요.');state.selections.order=[];setTimeout(render,450);} } else render(); return; }
  if(a==='clear-order'){state.selections.order=[];render();return;}
  if(b.dataset.tf){const [i,v]=b.dataset.tf.split(':');state.selections['tf'+i]=v==='1';render();return;}
  if(a==='check-tf'){const s=stages[state.stage]; if(s.rows.every((r,i)=>state.selections['tf'+i]===r.a))completeStage();else fail('세 기록 중 조작된 내용이 있어요.');return;}
  if(a==='check-match'){const s=stages[state.stage];if(s.rows.every((r,i)=>state.selections['m'+i]===r.answer))completeStage();else fail('물건과 쓰임의 연결을 다시 확인하세요.');return;}
  if(a==='check-grammar'){const s=stages[state.stage];if(s.sentence.every((r,i)=>state.selections['g'+i]===r.answer))completeStage();else fail('have/has + 과거분사 형태를 확인하세요.');return;}
  if(a==='unlock'){const val=document.querySelector('.code-input').value.trim();if(val===stages[state.stage].answer)completeStage();else fail('기록 조각을 숫자로 바꾸는 규칙을 다시 찾아보세요.');}
});

app.addEventListener('change',e=>{
  if(e.target.dataset.match!==undefined) state.selections['m'+e.target.dataset.match]=e.target.value;
  if(e.target.dataset.grammar!==undefined) state.selections['g'+e.target.dataset.grammar]=e.target.value;
  saveState();
});

function currentToolPuzzle(){
  if(state.screen==='start') return {screen:'start',instruction:'Start the escape game.'};
  if(state.screen==='complete') return {screen:'complete',progress:`${stages.length}/${stages.length}`};
  const s=stages[state.stage];
  const shape={hotspot:'a single option word',vocab:'three vocabulary words in order',order:'the completed question',match:'three to-infinitive phrases in order',tf:'three true/false values in order',grammar:'three grammar choices in order',code:'a four-digit code'}[s.type];
  return {screen:'game',stage:state.stage+1,totalStages:stages.length,title:s.title,location:s.location,answerFormat:shape,remainingSeconds:state.seconds};
}

function registerWebMCP(){
  const context=document.modelContext;
  if(!context?.registerTool) return;
  const register=tool=>{ try{ Promise.resolve(context.registerTool(tool)).catch(()=>{}); }catch(e){} };
  register({
    name:'read_escape_status', title:'방탈출 진행 상태 읽기',
    description:'Read the visible Ocean Middle School escape-game stage, location, required answer format, progress, and remaining time.',
    inputSchema:{type:'object',properties:{},additionalProperties:false},
    annotations:{readOnlyHint:true,untrustedContentHint:false},
    execute(){ return currentToolPuzzle(); }
  });
  register({
    name:'start_escape_game', title:'방탈출 시작하기',
    description:'Start or restart the visible Unit 5 escape game from chapter 1.',
    inputSchema:{type:'object',properties:{},additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(){ startGame(); return currentToolPuzzle(); }
  });
  register({
    name:'submit_escape_answer', title:'현재 미션 정답 제출',
    description:'Submit one answer for the currently visible puzzle. Use read_escape_status first to learn the expected format.',
    inputSchema:{type:'object',properties:{answer:{description:'A string, or an ordered array of strings or booleans, matching the current puzzle format.'}},required:['answer'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    async execute(input){
      if(state.screen!=='game') throw new Error('The game is not currently in progress.');
      const s=stages[state.stage], a=input?.answer;
      let ok=false;
      if(s.type==='hotspot'){ ok=a===s.answer; if(ok) state.found=s.hotspots.map((_,i)=>i); }
      if(s.type==='vocab') ok=Array.isArray(a)&&a.length===s.rounds.length&&a.every((v,i)=>v===s.rounds[i].a);
      if(s.type==='order') ok=a===s.answer.join(' ');
      if(s.type==='match') ok=Array.isArray(a)&&a.length===s.rows.length&&a.every((v,i)=>v===s.rows[i].answer);
      if(s.type==='tf') ok=Array.isArray(a)&&a.length===s.rows.length&&a.every((v,i)=>v===s.rows[i].a);
      if(s.type==='grammar') ok=Array.isArray(a)&&a.length===s.sentence.length&&a.every((v,i)=>v===s.sentence[i].answer);
      if(s.type==='code') ok=String(a)===s.answer;
      if(!ok){ state.mistakes++; saveState(); throw new Error('Incorrect answer for the current puzzle.'); }
      completeStage(); await new Promise(resolve=>setTimeout(resolve,720)); return currentToolPuzzle();
    }
  });
}

loadState(); render(); if(state.screen==='game') startTimer(); registerWebMCP();
}

(() => {
  'use strict';

  const root = document.querySelector('#app');
  const toastNode = document.querySelector('#toast');
  const SAVE_KEY = 'ocean-night-munjado-grade3-unit8-v1';
  const MAX_SLOTS = 7;

  const ITEMS = {
    pageA: { name: '찢어진 종이 A', glyph: '◩', description: '비에 젖은 종이의 왼쪽 조각. 문장 일부만 보인다.' },
    lockerKey: { name: '3번 열쇠', glyph: '⚿', description: '손때 묻은 작은 사물함 열쇠. 3이라는 숫자가 새겨져 있다.' },
    pageB: { name: '찢어진 종이 B', glyph: '◪', description: '오른쪽 조각. 다른 조각과 이어 붙일 수 있을 것 같다.' },
    blueFilter: { name: '청색 필터', glyph: '▣', description: '어두운 곳의 숨은 글씨를 읽게 해 주는 투명 필터.' },
    restoredNote: { name: '복원된 문자도 기록', glyph: '▤', description: 'EIGHT · ONE · THREE · TWO에 붉은 밑줄이 있다.' },
    accessCard: { name: 'DS실 카드', glyph: '▥', description: 'DS실 출입 카드.' },
    pianoKey: { name: '피아노 열쇠', glyph: '♩', description: '오션 라운지의 오래된 피아노 덮개 열쇠.' },
    battery: { name: '낡은 건전지', glyph: '▰', description: '꿈나래터 방석 아래에서 찾았다. 스터디카페의 카세트에 맞을 것 같다.' }
  };

  const SCENES = {
    exterior: { name: '오션중학교 · 중앙 현관', image: 'assets/horror-exterior.png?v=6' },
    classFront: { name: '2층 일반교실 · 앞쪽', image: 'assets/horror-class-front.png?v=6' },
    classSide: { name: '2층 일반교실 · 창가', image: 'assets/horror-class-side.png?v=6' },
    homebase: { name: '2층 홈베이스', image: 'assets/horror-homebase.png?v=6' },
    library: { name: '도서관 · 자료 열람실', image: 'assets/horror-library.png?v=6' },
    digital: { name: 'DS실', image: 'assets/horror-digital.png?v=6' },
    dream: { name: '꿈나래터 · 계단 광장', image: 'assets/horror-dream-v2.png?v=14' },
    study: { name: '미디어월드 · 스터디카페', image: 'assets/horror-study-v2.png?v=14' },
    workspace: { name: '2층 워크스페이스', image: 'assets/horror-workspace-v26.png' },
    lounge: { name: '오션 라운지', image: 'assets/horror-lounge.png?v=6' }
  };

  const freshState = () => ({
    screen: 'start', scene: 'exterior', inventory: [], selected: [], journal: [],
    flags: {}, log: '정문은 잠기지 않았다. 안쪽에서 희미한 전자음이 들린다.',
    modal: null, startedAt: 0, elapsed: 0, mistakes: 0, hints: 0, sequenceStep: 0, sequenceChosen: [], bookChosen: [], libraryRoute: [], lockerPins: [], workspacePins: [], pianoNotes: [], melodyNotes: [], soundOn: true,
    catches: 0, chaseSeen: [], chaseSolution: null
  });

  let state = freshState();
  let ticker = null;
  let transitioning = false;
  let audioContext = null;
  let ambientStarted = false;
  let ambientMaster = null;
  let ambientAccentTimer = null;
  let chaseTimer = null;
  let libraryLockTimer = null;
  let libraryLockTicker = null;

  function safeLoad() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved && saved.screen === 'game') state = { ...freshState(), ...saved, modal: null };
    } catch (_) { /* start fresh */ }
  }

  function save() {
    const copy = { ...state, modal: null, elapsed: currentElapsed() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(copy));
  }

  function currentElapsed() {
    return state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) + state.elapsed : state.elapsed;
  }

  function timeText(sec = currentElapsed()) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function startTimer() {
    clearInterval(ticker);
    if (!state.startedAt) state.startedAt = Date.now();
    ticker = setInterval(() => {
      const node = document.querySelector('[data-clock]');
      if (node) node.textContent = timeText();
    }, 1000);
  }

  function ensureAudio() {
    if (!state.soundOn) return null;
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return null;
    if (!audioContext) audioContext = new AudioEngine();
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        if (state.soundOn && !ambientStarted) startAmbient();
      }).catch(() => {});
    }
    return audioContext;
  }

  function startAmbient() {
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ambientStarted) {
      if (ambientMaster) ambientMaster.gain.setTargetAtTime(0.038, ctx.currentTime, 0.7);
      return;
    }
    ambientStarted = true;
    ambientMaster = ctx.createGain();
    ambientMaster.gain.setValueAtTime(0.0001, ctx.currentTime);
    ambientMaster.gain.exponentialRampToValueAtTime(0.038, ctx.currentTime + 2.2);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 680; filter.Q.value = 0.8;
    filter.connect(ambientMaster); ambientMaster.connect(ctx.destination);
    [73.42, 110, 146.83].forEach((frequency, index) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = index === 1 ? 'triangle' : 'sine'; osc.frequency.value = frequency; osc.detune.value = [4, -7, 6][index];
      gain.gain.value = [0.32, 0.16, 0.07][index]; osc.connect(gain); gain.connect(filter); osc.start();
    });
    const lfo = ctx.createOscillator(); const lfoDepth = ctx.createGain();
    lfo.frequency.value = 0.065; lfoDepth.gain.value = 0.008; lfo.connect(lfoDepth); lfoDepth.connect(ambientMaster.gain); lfo.start();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.12;
    const noise = ctx.createBufferSource(); const noiseFilter = ctx.createBiquadFilter(); const noiseGain = ctx.createGain();
    noise.buffer = noiseBuffer; noise.loop = true; noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = 430; noiseFilter.Q.value = 0.28; noiseGain.gain.value = 0.028;
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ambientMaster); noise.start();
    scheduleAmbientAccent();
  }

  function scheduleAmbientAccent() {
    clearTimeout(ambientAccentTimer);
    ambientAccentTimer = setTimeout(() => {
      const ctx = audioContext;
      if (ctx && state.soundOn && ctx.state === 'running' && ambientMaster) {
        const now = ctx.currentTime;
        const note = [220, 233.08, 246.94][Math.floor(Math.random() * 3)];
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(note, now); osc.frequency.exponentialRampToValueAtTime(note * 0.985, now + 3.8);
        gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.09, now + 0.18); gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
        osc.connect(gain); gain.connect(ambientMaster); osc.start(now); osc.stop(now + 4.3);
      }
      scheduleAmbientAccent();
    }, 6500 + Math.random() * 4500);
  }

  function wakeAudio() { if (state.soundOn) { ensureAudio(); startAmbient(); } }

  function toggleSound() {
    state.soundOn = !state.soundOn;
    if (state.soundOn) wakeAudio();
    else if (audioContext?.state === 'running') {
      if (ambientMaster) ambientMaster.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.12);
      audioContext.suspend().catch(() => {});
    }
    render();
  }

  function playPianoNote(number) {
    const ctx = ensureAudio();
    if (!ctx || !state.soundOn) return;
    const frequency = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88][Number(number) - 1];
    if (!frequency) return;
    const now = ctx.currentTime; const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now); master.gain.exponentialRampToValueAtTime(0.11, now + 0.018); master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    master.connect(ctx.destination);
    [{ type: 'triangle', ratio: 1, volume: 0.75 }, { type: 'sine', ratio: 2, volume: 0.18 }].forEach(part => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = part.type; osc.frequency.value = frequency * part.ratio; gain.gain.value = part.volume;
      osc.connect(gain); gain.connect(master); osc.start(now); osc.stop(now + 1.2);
    });
  }

  function notify(message) {
    toastNode.textContent = message;
    toastNode.classList.add('show');
    setTimeout(() => toastNode.classList.remove('show'), 1900);
  }

  function addJournal(text) {
    if (!state.journal.includes(text)) state.journal.push(text);
  }

  function has(item) { return state.inventory.includes(item); }

  function addItem(item) {
    if (!has(item)) {
      state.inventory.push(item);
      notify(`${ITEMS[item].name}을(를) 얻었다.`);
    }
  }

  function removeItem(item) {
    state.inventory = state.inventory.filter(id => id !== item);
    state.selected = state.selected.filter(id => id !== item);
  }

  function objective() {
    if (!state.flags.boardSolved) return ['첫 번째 신호', '교실의 꺼진 전자칠판을 조사해 잠금 문제를 풀어라.', '가정법 과거에서 be동사는 일반적으로 were를 씁니다.'];
    if (!state.flags.pageA) return ['첫 번째 흔적', '교실 바닥에 떨어진 것을 찾아라.', '반짝이는 지점을 눌러 자세히 조사하세요.'];
    if (!state.flags.lockerOpened) return ['여덟 개의 자리', '교실의 책상 배열을 관찰하고 3번 사물함의 8핀 자물쇠를 열어라.', '열쇠만으로는 부족합니다. 의자가 빠져 나온 네 자리도 기억하세요.'];
    if (!state.flags.noteCombined) return ['둘로 나뉜 기록', '종이 조각 두 장을 인벤토리에서 선택해 조합하라.', '아이템 두 개를 고른 뒤 ‘조합’을 누르세요.'];
    if (!state.flags.libraryOpen) return ['네 개의 밑줄', '복원된 기록의 수량을 숫자로 바꿔 도서관 문을 열어라.', '밑줄 친 수량 단어를 차례로 숫자로 바꾸세요.'];
    if (!state.flags.libraryBooksSolved) return ['뜻풀이 서가', '세 뜻풀이의 답을 추리하고, 양 끝 글자가 같은 책을 순서대로 골라라.', '문제를 풀면서 책 제목의 첫 글자와 끝 글자를 함께 관찰하세요.'];
    if (!state.flags.librarySolved) return ['방향 자물쇠', '서가의 시작점에서 선택한 세 책을 차례로 지나 잠금장치까지 이동하라.', '격자에서 한 칸씩 움직인 방향을 입력하세요.'];
    if (!state.flags.digitalSolved) return ['끊어진 문장', '출입 카드로 DS실에 들어가 세 문장을 복구하라.', 'to부정사의 의미상 주어와 가정법 과거 구조를 떠올리세요.'];
    if (!state.flags.dreamSolved) return ['방석 아래의 전류', '꿈나래터의 세 흔적을 모아 건전지가 숨은 방석 번호를 추리하라.', '아래 계단, 오른쪽 수납장, 위쪽 난간을 각각 조사하세요.'];
    if (!state.flags.studySolved) return ['멈춘 카세트', '건전지로 카세트를 살리고 들려준 네 음을 그대로 재현하라.', '먼저 재생을 누르고 램프 건반 1·2·3을 순서대로 누르세요.'];
    if (!state.flags.workspaceSolved) return ['남겨진 자리', '워크스페이스 벤치 수납함의 15버튼 잠금을 해제하라.', '방 안에서 자물쇠와 닮은 배열을 찾아보세요.'];
    if (!state.flags.pianoUnlocked) return ['마지막 연주', '오션 라운지 피아노의 네 문장을 풀어 건반 순서를 찾아라.', '각 문장의 정답이 몇 번째 선택지인지 차례로 연주하세요.'];
    if (!state.flags.finished) return ['마지막 증언', '피아노 안의 기록을 읽고 문자도의 세 가치를 완성하라.', '효·충·의 그림의 상징을 떠올리세요.'];
    return ['탈출 성공', '오션중학교의 21시 문자도를 복원했다.', '모든 단서가 조선 시대의 가치로 이어졌다.'];
  }

  function hotspots() {
    const spots = {
      exterior: [
        { x: 52, y: 68, label: '현관으로 들어간다', kind: 'exit', action: 'go', value: 'classFront' }
      ],
      classFront: [
        { x: 50, y: 34, label: '전원이 꺼진 전자칠판', action: 'board' },
        ...(!state.flags.keyFound && state.flags.boardSolved ? [{ x: 38, y: 59, label: '책상 서랍 안의 반짝임', kind: 'item', action: 'pickup', value: 'lockerKey' }] : []),
        ...(state.flags.boardSolved && !state.flags.lockerOpened ? [{ x: 68, y: 68, label: '뒤쪽 8개 책상의 배열', action: 'deskPattern' }] : []),
        { x: 89, y: 49, label: '복도로 나간다', kind: 'exit', action: 'go', value: 'homebase' },
        { x: 10, y: 53, label: '창가 쪽으로 시선을 돌린다', kind: 'exit', action: 'go', value: 'classSide' }
      ],
      classSide: [
        ...(!state.flags.pageA ? [{ x: 44, y: 74, label: '바닥의 구겨진 종이', kind: 'item', action: 'pickup', value: 'pageA' }] : []),
        { x: 11, y: 48, label: '교실 앞쪽을 본다', kind: 'exit', action: 'go', value: 'classFront' }
      ],
      homebase: [
        { x: 51, y: 63, label: '3번 사물함', action: 'locker' },
        { x: 85, y: 54, label: '도서관 방화문', kind: 'exit', action: 'libraryDoor' },
        { x: 13, y: 57, label: '일반교실로 돌아간다', kind: 'exit', action: 'go', value: 'classFront' },
        ...(state.flags.librarySolved ? [{ x: 69, y: 48, label: 'DS실 출입문', kind: 'exit', action: 'digitalDoor' }] : [])
      ],
      library: [
        { x: 50, y: 59, label: state.flags.libraryBooksSolved ? '해결한 책 자물쇠' : '곡선 서가의 숨은 표식', action: 'shelf' },
        ...(state.flags.libraryBooksSolved && !state.flags.librarySolved ? [{ x: 84, y: 42, label: '비상문의 방향 자물쇠', action: 'libraryChaseLock' }] : []),
        { x: 9, y: 66, label: '홈베이스로 돌아간다', kind: 'exit', action: 'go', value: 'homebase' }
      ],
      digital: [
        { x: 38, y: 38, label: '켜진 대형 화면', action: 'monitor' },
        { x: 7, y: 49, label: '홈베이스로 돌아간다', kind: 'exit', action: 'go', value: 'homebase' },
        ...(state.flags.digitalSolved ? [{ x: 88, y: 49, label: '꿈나래터로 간다', kind: 'exit', action: 'go', value: 'dream' }] : [])
      ],
      dream: [
        { x: 24, y: 72, label: state.flags.dreamSteps ? '확인한 계단 번호 흔적' : '아래 계단의 희미한 숫자', action: 'dreamClue', value: 'steps' },
        { x: 82, y: 43, label: state.flags.dreamCubby ? '확인한 수납장 낙서' : '오른쪽 수납장 안의 낙서', action: 'dreamClue', value: 'cubby' },
        { x: 69, y: 31, label: state.flags.dreamRail ? '확인한 난간 긁힘' : '위쪽 난간의 긁힌 문장', action: 'dreamClue', value: 'rail' },
        { x: 45, y: 54, label: state.flags.dreamSolved ? '살펴본 방석' : '번호가 붙은 방석 지도', action: 'cushions' },
        { x: 7, y: 55, label: 'DS실로 돌아간다', kind: 'exit', action: 'go', value: 'digital' },
        ...(state.flags.dreamSolved ? [{ x: 89, y: 53, label: '스터디카페로 간다', kind: 'exit', action: 'go', value: 'study' }] : [])
      ],
      study: [
        { x: 66, y: 50, label: '멈춘 카세트 플레이어', action: 'cassette' },
        { x: 7, y: 54, label: '꿈나래터로 돌아간다', kind: 'exit', action: 'go', value: 'dream' },
        ...(state.flags.studySolved ? [{ x: 91, y: 54, label: '워크스페이스로 간다', kind: 'exit', action: 'go', value: 'workspace' }] : [])
      ],
      workspace: [
        { x: 60, y: 61, label: state.flags.workspaceSolved ? '열린 벤치 수납함' : '벤치 아래 낯선 금속판', action: 'workspaceLock' },
        { x: 7, y: 58, label: '스터디카페로 돌아간다', kind: 'exit', action: 'go', value: 'study' },
        ...(state.flags.workspaceSolved ? [{ x: 92, y: 53, label: '오션 라운지로 간다', kind: 'exit', action: 'go', value: 'lounge' }] : [])
      ],
      lounge: [
        { x: 83, y: 54, label: '잠긴 피아노', action: 'piano' },
        { x: 7, y: 53, label: '워크스페이스로 돌아간다', kind: 'exit', action: 'go', value: 'workspace' }
      ]
    };
    return spots[state.scene] || [];
  }

  function hotspotMarkup(spot) {
    return `<button class="hotspot ${spot.kind || ''}" style="left:${spot.x}%;top:${spot.y}%" data-action="${spot.action}" ${spot.value ? `data-value="${spot.value}"` : ''} aria-label="${spot.label}"><span class="tip">${spot.label}</span></button>`;
  }

  function inventoryMarkup() {
    const slots = [...state.inventory];
    while (slots.length < MAX_SLOTS) slots.push(null);
    return slots.map((item, index) => item
      ? `<button class="slot ${state.selected.includes(item) ? 'selected' : ''}" data-action="selectItem" data-value="${item}" aria-label="${ITEMS[item].name}"><span class="glyph">${ITEMS[item].glyph}</span><span class="name">${ITEMS[item].name}</span></button>`
      : `<div class="slot empty" aria-label="빈 칸"><span class="glyph">·</span><span class="name">${index + 1}</span></div>`).join('');
  }

  function modalMarkup() {
    if (!state.modal) return '';
    const type = state.modal;
    let body = '';
    if (type === 'board') body = `<div class="eyebrow">교실 전자칠판 · 비상 전원</div><h2>멈춘 문장을 완성하라</h2><p>화면은 꺼져 있지만 아래쪽 비상 표시창에 한 문장만 희미하게 남아 있다.</p><div class="dark-screen-note"><strong>If I ___ a bird, I could fly.</strong><small>가정법 과거 문장을 완성하면 위치 정보가 나타난다.</small></div><div class="board-options"><button class="token" data-action="answerBoard" data-value="am">am</button><button class="token" data-action="answerBoard" data-value="was">was</button><button class="token" data-action="answerBoard" data-value="were">were</button></div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">나중에</button></div>`;
    if (type === 'deskPattern') body = deskPatternMarkup();
    if (type === 'lockerPins') body = lockerPinsMarkup();
    if (type === 'workspaceShelf') body = workspaceShelfMarkup();
    if (type === 'workspaceLock') body = workspaceLockMarkup();
    if (type === 'pageA') body = `<div class="eyebrow">습득한 단서</div><h2>찢어진 종이 A</h2><div class="clue-paper">One of <strong>EIGHT</strong> Chinese characters<br>appears in Munja<span class="cut">do...</span><br><br><span class="cut">Three...</span> carp came out of the <span class="cut">water...</span></div><p>오른쪽 절반이 있어야 내용을 읽을 수 있다.</p><div class="modal-actions"><button class="button primary" data-action="closeModal">접어 둔다</button></div>`;
    if (type === 'restoredNote') body = `<div class="eyebrow">조합 성공</div><h2>복원된 문자도의 기록</h2><div class="clue-paper">One of <strong>EIGHT</strong> Chinese characters appears in Munjado.<br><br>Munjado is <strong>ONE</strong> type of folk painting.<br><br><strong>THREE</strong> carp came out of the water.<br><br>Children learned harmony in <strong>TWO</strong> places: family and society.<br><br><em>“밑줄 친 네 수량을 한 자리씩 읽어라.”</em></div><p>수량 단어를 숫자로 바꾸면 네 자리 암호가 된다.</p><div class="modal-actions"><button class="button primary" data-action="closeModal">기록한다</button></div>`;
    if (type === 'libraryKeypad') body = `<div class="eyebrow">도서관 방화문</div><h2>4자리 기록 번호</h2><p>복원된 종이의 붉은 밑줄 네 개가 순서대로 열쇠가 된다.</p><label class="field-label" for="codeAnswer">암호 입력</label><input id="codeAnswer" class="code-input" inputmode="numeric" maxlength="4" autocomplete="off"><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">취소</button><button class="button primary" data-action="submitCode">해제</button></div>`;
    if (type === 'shelfPuzzle') body = bookOrderMarkup();
    if (type === 'libraryChaseLock') body = libraryChaseLockMarkup();
    if (type === 'sequence') body = sequenceMarkup();
    if (type === 'dreamClue') body = dreamClueMarkup();
    if (type === 'cushions') body = `<div class="eyebrow">꿈나래터 · 최종 추리</div><h2>건전지는 몇 번 방석 아래에 있을까?</h2><p>모은 세 흔적을 동시에 만족하는 방석은 하나뿐이다. 지도는 실제 계단을 정면에서 바라본 모습이다.</p><div class="seat-orientation"><span>← 창문</span><span>위쪽 계단</span><span>계단 →</span></div><div class="seat-map" aria-label="방석 번호 지도"><button class="gray" data-action="answerCushions" data-value="7"><b>7</b><small>회색</small></button><button class="red" data-action="answerCushions" data-value="8"><b>8</b><small>빨강</small></button><button class="gray" data-action="answerCushions" data-value="9"><b>9</b><small>회색</small></button><button class="red" data-action="answerCushions" data-value="4"><b>4</b><small>빨강</small></button><button class="gray" data-action="answerCushions" data-value="5"><b>5</b><small>회색</small></button><button class="gray" data-action="answerCushions" data-value="6"><b>6</b><small>회색</small></button><button class="gray" data-action="answerCushions" data-value="1"><b>1</b><small>회색</small></button><button class="gray" data-action="answerCushions" data-value="2"><b>2</b><small>회색</small></button><button class="red" data-action="answerCushions" data-value="3"><b>3</b><small>빨강</small></button></div><div class="collected-clues"><span>① 아래에서 위로 번호를 읽는다</span><span>② 숨은 곳은 회색, 바로 아래는 빨강</span><span>③ 창문보다 계단 쪽에 가깝다</span></div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">현장을 다시 본다</button></div>`;
    if (type === 'cassette') body = cassetteMarkup();
    if (type === 'pianoCode') body = pianoCodeMarkup();
    if (type === 'final') body = `<div class="eyebrow">피아노 내부의 마지막 기록</div><h2>문자도의 세 가치</h2><p>효·충·의 문자도가 상징하는 가치를 영어로 완성하라.</p><label class="field-label">1. Carp in the paintings of hyo symbolize ____ for parents.</label><input class="code-input answer-input" data-final="0" autocomplete="off"><label class="field-label">2. Bamboo came to symbolize ____ to the king.</label><input class="code-input answer-input" data-final="1" autocomplete="off"><label class="field-label">3. Lotus flowers symbolize a will to fight for ____.</label><input class="code-input answer-input" data-final="2" autocomplete="off"><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">기록 다시 보기</button><button class="button primary" data-action="submitFinal">기록 완성</button></div>`;
    if (type === 'journal') body = `<div class="eyebrow">조사 수첩</div><h2>발견한 기록</h2><ul class="journal-list">${state.journal.length ? state.journal.map(x => `<li>${x}</li>`).join('') : '<li>아직 기록한 단서가 없다.</li>'}</ul><div class="modal-actions"><button class="button primary" data-action="closeModal">닫기</button></div>`;
    if (type === 'hint') body = `<div class="eyebrow">현재 단계 힌트</div><h2>조금만 더 자세히</h2><p>${hintText()}</p><div class="modal-actions"><button class="button primary" data-action="closeModal">계속 조사</button></div>`;
    if (type === 'chase') body = `<div class="chase-clock"><span></span></div><div class="chase-stage"><img class="hero-sprite" src="assets/hero-sword.png?v=14" alt="커다란 파란 스펀지 대검을 멘 학생"><div class="chase-copy"><div class="eyebrow">토끼 안전요원 접근 중 · 8초</div><h2>들켰다! 어디로 피할까?</h2><p>폭신한 발소리가 빠르게 가까워진다. 주변 공간과 소품을 보고 가장 안전한 행동을 고르자.</p><div class="chase-actions">${chaseChoices()}</div><small>틀리거나 시간이 끝나면 안전도 한 칸이 줄어듭니다.</small></div><img class="rabbit-sprite" src="assets/rabbit-mascot.png?v=14" alt="귀여운 토끼 탈을 쓴 안전요원"></div>`;
    if (type === 'gameOver') body = `<div class="gameover-rabbit">🐰</div><div class="eyebrow">GAME OVER · 토끼 안전요원에게 발견됨</div><h2>“방과후 학생 발견!”</h2><p>무서운 일은 일어나지 않았다. 토끼 탈 안전요원이 출입 기록표를 내밀 뿐이다. 체크포인트에서 다시 숨으면 아이템과 퍼즐 진행은 그대로 유지된다.</p><div class="modal-actions"><button class="button primary" data-action="checkpoint">체크포인트에서 계속</button><button class="button" data-action="restart">처음부터</button></div>`;
    if (type === 'item') {
      const item = state.modalItem;
      body = `<div class="eyebrow">소지품</div><h2>${ITEMS[item].glyph} ${ITEMS[item].name}</h2><p>${ITEMS[item].description}</p><div class="modal-actions"><button class="button primary" data-action="closeModal">닫기</button></div>`;
    }
    return `<div class="modal-backdrop" role="dialog" aria-modal="true"><section class="modal" tabindex="-1">${body}</section></div>`;
  }

  const sequences = [
    { prompt: 'to부정사의 의미상 주어 for를 쓴 문장', tokens: ['to catch', 'It was impossible', 'any fish.', 'for him'], answer: ['It was impossible', 'for him', 'to catch', 'any fish.'] },
    { prompt: '사람의 성품을 나타내어 of를 쓴 문장', tokens: ['to take me home.', 'It was nice', 'of him'], answer: ['It was nice', 'of him', 'to take me home.'] },
    { prompt: '가정법 과거로 소원을 말하는 문장', tokens: ['I would travel', 'If I had', 'all over the world.', 'a lot of money,'], answer: ['If I had', 'a lot of money,', 'I would travel', 'all over the world.'] }
  ];

  function sequenceMarkup() {
    const seq = sequences[state.sequenceStep];
    const chosen = state.sequenceChosen;
    return `<div class="eyebrow">화면 ${state.sequenceStep + 1} / ${sequences.length}</div><h2>끊어진 문장 신호</h2><p>${seq.prompt}. 아래 조각을 올바른 순서로 누르세요.</p><div class="token-board" aria-label="조립한 문장">${chosen.map((t, i) => `<button class="token" data-action="removeToken" data-value="${i}">${t}</button>`).join('') || '<span style="color:var(--muted)">여기에 문장을 조립하세요.</span>'}</div><div class="token-board" aria-label="문장 조각">${seq.tokens.map(t => `<button class="token ${chosen.includes(t) ? 'chosen' : ''}" data-action="addToken" data-value="${t}" ${chosen.includes(t) ? 'disabled' : ''}>${t}</button>`).join('')}</div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="resetTokens">다시 배열</button><button class="button primary" data-action="submitSequence">신호 전송</button></div>`;
  }

  const libraryBooks = [
    ['pond', 'Carp in the Pond'],
    ['bamboo', 'Bamboo and Ginkgo'],
    ['loyalty', 'Loyalty of the Dynasty'],
    ['justice', 'Journey to Justice'],
    ['painting', 'People and Painting'],
    ['museum', 'Munjado Museum'],
    ['flower', 'Lotus Flower'],
    ['value', 'Values of Joseon'],
    ['story', 'A Winter Story']
  ];

  function bookOrderMarkup() {
    const chosen = state.bookChosen || [];
    const title = id => libraryBooks.find(book => book[0] === id)?.[1] || id;
    const clues = [
      'a large fish that lives in lakes and rivers',
      'a giant woody grass that grows mainly in the tropics',
      'a feeling of support for someone or something'
    ];
    return `<div class="eyebrow">청색 필터로 드러난 책 자물쇠</div><h2>주어진 영영풀이에 해당하는 단어가 포함된 책을 고르시오.</h2><p>각 영영풀이의 답을 찾은 뒤, 그 단어가 제목에 포함된 책을 아래 책장에서 순서대로 고르세요.</p><ol class="shelf-clues">${clues.map((clue, index) => `<li class="${chosen[index] ? 'filled' : ''}"><b>${index + 1}</b><span>${clue}</span><strong>${chosen[index] ? title(chosen[index]) : '이 문제에 맞는 책을 선택'}</strong></li>`).join('')}</ol><div class="book-shelf" aria-label="책 제목 목록">${libraryBooks.map(([id, bookTitle]) => `<button class="book-spine ${chosen.includes(id) ? 'chosen' : ''}" data-action="addBook" data-value="${id}" ${chosen.includes(id) ? 'disabled' : ''}>${bookTitle}</button>`).join('')}</div><p class="book-note">영영풀이의 답이 제목에 직접 포함된 책을 고르자. 아래 선택 목록의 책을 누르면 취소할 수 있다.</p><div class="book-order" aria-label="선택한 책 순서">${chosen.length ? chosen.map((id, index) => `<button data-action="removeBook" data-value="${index}" aria-label="${index + 1}번 선택 취소"><b>${index + 1}</b>${title(id)}</button>`).join('') : '<span>첫 번째 문제에 맞는 책부터 누르세요.</span>'}</div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="resetBooks">순서 지우기</button><button class="button" data-action="closeModal">잠시 닫기</button><button class="button primary" data-action="submitBooks">세 권을 당긴다</button></div>`;
  }

  function libraryChaseLockMarkup() {
    const route = state.libraryRoute || [];
    const arrows = { U: '↑', R: '→', D: '↓', L: '←' };
    const remaining = state.libraryLockDeadline ? Math.max(0, Math.ceil((state.libraryLockDeadline - Date.now()) / 1000)) : 15;
    const cells = [
      '<span class="maze-wall">▥</span>', '<span class="maze-wall">▥</span>', '<span class="maze-floor">·</span>', '<span class="maze-exit">EXIT</span>',
      '<span class="maze-wall">▥</span>', '<span class="maze-wall">▥</span>', '<span class="maze-floor">·</span>', '<span class="maze-wall">▥</span>',
      '<span class="maze-wall">▥</span>', '<span class="maze-floor">·</span>', '<span class="maze-floor">·</span>', '<span class="maze-wall">▥</span>',
      '<span class="maze-start">START</span>', '<span class="maze-floor">·</span>', '<span class="maze-wall">▥</span>', '<span class="maze-wall">▥</span>'
    ];
    return `<div class="lock-countdown"><span style="animation-duration:${remaining}s"></span></div><div class="library-chase-lock"><section><div class="eyebrow danger">토끼 안전요원 접근 중 · <b data-lock-seconds>${remaining}</b>초</div><h2>서가 미로를 빠져나가라!</h2><p>책 문제가 풀리자 비상문이 잠기고 뒤에서 발소리가 들린다. <strong>START</strong>에서 <strong>EXIT</strong>까지 서가를 피해 한 칸씩 이동한 방향을 입력하세요.</p><div class="library-maze" aria-label="도서관 서가 미로">${cells.join('')}</div><div class="route-display" aria-label="입력한 방향">${route.length ? route.map(value => `<span>${arrows[value]}</span>`).join('') : '<em>빠르게 경로를 입력하세요.</em>'}</div><div class="direction-pad" aria-label="방향 자물쇠"><button data-action="routeStep" data-value="U" aria-label="위">↑</button><button data-action="routeStep" data-value="L" aria-label="왼쪽">←</button><button data-action="routeStep" data-value="D" aria-label="아래">↓</button><button data-action="routeStep" data-value="R" aria-label="오른쪽">→</button></div><p class="keyboard-hint">방향키로 입력하고 <strong>Enter</strong>를 누르면 제출됩니다.</p><p class="error" data-error></p><div class="modal-actions chase-submit"><button class="button" data-action="resetRoute">입력 지우기</button><button class="button primary" data-action="submitRoute">비상문 열기</button></div></section><aside><img src="assets/rabbit-mascot.png?v=14" alt="복도에서 다가오는 귀여운 토끼 탈 안전요원"><strong>폭신… 폭신…</strong><small>시간이 끝나면 안전도가 감소합니다.</small></aside></div>`;
  }

  function cassetteMarkup() {
    const notes = state.melodyNotes || [];
    return `<div class="eyebrow">미디어월드 · 카세트 플레이어</div><h2>네 번의 안내음</h2><p>건전지를 넣자 세 개의 램프가 켜졌다. 재생 버튼으로 안내음을 듣고 같은 순서로 눌러라.</p><button class="cassette-play" data-action="playMelody">▶ 안내음 재생</button><div class="melody-display">${notes.length ? notes.map(n => `<span>${n}</span>`).join('') : '<em>소리를 먼저 들어 보세요</em>'}</div><div class="lamp-keys">${[1,2,3].map(n => `<button data-action="melodyNote" data-value="${n}"><b>${n}</b><small>${['낮은 음','가운데 음','높은 음'][n-1]}</small></button>`).join('')}</div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="resetMelody">다시 입력</button><button class="button primary" data-action="submitMelody">패턴 확인</button></div>`;
  }

  function dreamClueMarkup() {
    const clues = {
      steps: ['계단 모서리의 숫자', '닳은 숫자 옆에 화살표가 있다.', '<strong>“바닥 가까운 줄의 왼쪽부터 1, 2, 3.<br>한 줄 올라가도 번호는 이어진다.”</strong>', '방석 번호를 읽는 방향을 알았다.'],
      cubby: ['수납장 안쪽의 분필 낙서', '토끼 모양 귀 옆에 짧은 메모가 남아 있다.', '<strong>“나는 빨강이 아니다.<br>하지만 내 바로 아래에는 빨강이 있다.”</strong>', '숨은 방석의 색과 아래쪽 방석의 관계다.'],
      rail: ['난간 아래의 긁힌 문장', '손전등을 비스듬히 비추자 마지막 조건이 드러난다.', '<strong>“창문보다 계단이 더 가깝다.”</strong>', '같은 조건의 후보 중 오른쪽을 골라야 한다.']
    };
    const [title, intro, clue, note] = clues[state.dreamClueType];
    return `<div class="eyebrow">현장 단서 ${dreamClueCount()} / 3</div><h2>${title}</h2><p>${intro}</p><div class="etched-clue">${clue}</div><p>${note}</p><div class="modal-actions"><button class="button primary" data-action="closeModal">수첩에 기록한다</button></div>`;
  }

  function dreamClueCount() {
    return ['dreamSteps','dreamCubby','dreamRail'].filter(key => state.flags[key]).length;
  }

  function chaseChoices() {
    const sets = {
      study: [['desk','책상 아래로 조용히 숨기'],['run','유리문 쪽으로 달리기'],['lamp','탁상등을 모두 켜기']],
      lounge: [['sword','스펀지 대검으로 문을 살짝 받치기'],['piano','피아노를 크게 두드리기'],['freeze','그 자리에 꼼짝 않고 서 있기']]
    };
    return (sets[state.scene] || sets.study).map(([value,label]) => `<button class="chase-choice" data-action="chaseChoice" data-value="${value}">${label}</button>`).join('');
  }

  function pianoCodeMarkup() {
    const notes = state.pianoNotes || [];
    const noteNames = ['도', '레', '미', '파', '솔', '라', '시'];
    return `<div class="eyebrow">피아노 위의 낡은 악보</div><h2>정답의 번호를 연주하라</h2><p>각 문장의 빈칸에 맞는 말을 고르고, 그 선택지의 번호를 위에서부터 누르세요.</p><ol class="music-clues"><li>It is dangerous ___ her to go there alone.<br><span>① of　② for　③ from</span></li><li>It was ___ of him to take me home.<br><span>① nice　② nicely　③ niceness</span></li><li>If I ___ a bird, I could fly.<br><span>① am　② were　③ will be</span></li><li>Bamboo does not ___.<br><span>① bends　② bend　③ bent</span></li></ol><div class="note-display" aria-label="입력한 건반">${notes.length ? notes.map(n => `<span>${n}</span>`).join('') : '<em>— — — —</em>'}</div><div class="piano-keyboard" aria-label="피아노 건반"><div class="white-keys">${noteNames.map((name, i) => `<button class="piano-white" data-action="pianoNote" data-value="${i + 1}" ${notes.length >= 4 ? 'disabled' : ''}><b>${name}</b><small>${i + 1}</small></button>`).join('')}</div><div class="black-keys" aria-hidden="true"><i style="left:14.3%"></i><i style="left:28.6%"></i><i style="left:57.1%"></i><i style="left:71.4%"></i><i style="left:85.7%"></i></div></div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="resetPiano">다시 연주</button><button class="button primary" data-action="submitPianoCode">잠금 해제</button></div>`;
  }

  function hintText() {
    state.hints += 1;
    const [,, base] = objective();
    if (!state.flags.lockerOpened && !state.flags.deskPatternSeen) return '교실 앞쪽 화면에서 뒤쪽 8개 책상을 조사하세요. 다른 의자보다 뒤로 빠져 나온 의자가 네 개 있습니다.';
    if (!state.flags.lockerOpened && state.flags.deskPatternSeen) return '교실의 2×4 책상 배열에서 의자가 빠져 나온 네 자리와 똑같은 위치의 사물함 핀을 누르세요.';
    if (!state.flags.libraryOpen && state.flags.noteCombined) return 'EIGHT=8, ONE=1, THREE=3, TWO=2입니다.';
    if (!state.flags.libraryBooksSolved && state.flags.libraryOpen) return '각 영영풀이의 답은 carp, bamboo, loyalty입니다. 이 단어가 포함된 책 제목을 순서대로 찾으세요.';
    if (!state.flags.librarySolved && state.flags.libraryBooksSolved) return 'START에서 EXIT까지 빈 통로만 따라가세요. 정답은 → ↑ → ↑ ↑ → 입니다.';
    if (!state.flags.digitalSolved && state.flags.librarySolved) return '일반적인 의미상 주어는 for+목적격, 사람의 성품을 나타내면 of+목적격입니다. 가정법은 If+과거형, would+동사원형을 씁니다.';
    if (!state.flags.dreamSolved && state.flags.digitalSolved) {
      if (dreamClueCount() < 3) return '방석만 보지 말고 아래 계단의 숫자, 오른쪽 수납장, 위쪽 난간을 각각 조사하세요.';
      return '“회색이고 바로 아래가 빨강”인 후보를 먼저 두 개 찾은 뒤, 창문과 계단 중 어느 쪽에 가까운지 비교하세요.';
    }
    if (!state.flags.studySolved && state.flags.dreamSolved) return '카세트 안내음은 3-1-2-3입니다. 소리를 켜고 재생 버튼을 눌러도 됩니다.';
    if (!state.flags.workspaceSolved && state.flags.studySolved) return state.flags.workspaceShelfSeen ? '금속판의 문구처럼 빈자리는 누르지 말고, 남겨진 물건의 자리만 표시하세요.' : '자물쇠와 똑같이 가로 세 칸씩 나뉜 구조물이 방 안에 있는지 살펴보세요.';
    if (!state.flags.pianoUnlocked && state.flags.workspaceSolved) return '네 문장의 정답 선택지 번호는 차례로 2, 1, 2, 2입니다.';
    return base;
  }

  function render() {
    if (state.screen === 'start') {
      root.innerHTML = `<main class="start-screen"><div class="start-bg"></div><img class="start-hero" src="assets/hero-sword.png?v=14" alt="커다란 파란 스펀지 대검을 멘 학생"><section class="start-card"><div class="eyebrow">GRADE 3 · UNIT 8 · THE JOSEON DYNASTY THROUGH PAINTINGS · 약 20분</div><h1>21시의 문자도<span>오션중학교 방과후 교내 조사</span></h1><p>방과후 수업이 끝난 뒤, 학교의 모든 전자문이 잠겼다. 사라진 문자도의 기록을 복원하고, 순찰 중인 토끼 탈 안전요원을 피해 중앙 현관을 다시 열어야 한다.</p><div class="warning">관찰·아이템 조합·색 규칙·소리 기억·8과 어휘·문법·본문 문제를 차례로 해결합니다. 추격과 게임오버가 있지만 잔혹 표현이나 큰 놀람 연출은 없습니다. 등에 멘 커다란 대검은 안전한 스펀지 소품입니다.</div><button class="button primary" data-action="start">학교에 들어가기</button></section></main>`;
      bind(); return;
    }
    if (state.screen === 'ending') { renderEnding(); return; }
    const [chapter, title, sub] = objective();
    const scene = SCENES[state.scene];
    root.innerHTML = `<main class="game scene-${state.scene}"><div class="scene ${transitioning ? 'is-transitioning' : ''}"><img class="scene-image" src="${scene.image}" alt="${scene.name}" draggable="false">${hotspots().map(hotspotMarkup).join('')}</div><div class="grain"></div><div class="hud"><div class="topbar"><section class="objective"><div class="eyebrow">${chapter}</div><strong>${title}</strong><small>${sub}</small></section><div class="top-actions"><div class="status-chip safety" title="토끼에게 두 번 잡히면 게임오버">안전도 ${state.catches === 0 ? '♥♥' : '♥♡'}</div><div class="status-chip">◷ <b data-clock>${timeText()}</b></div><button class="icon-button sound-button" data-action="toggleSound" aria-label="${state.soundOn ? 'BGM 끄기' : 'BGM 켜기'}">${state.soundOn ? '♪' : '×'} <span>${state.soundOn ? 'BGM' : '음소거'}</span></button><button class="icon-button" data-action="showHint" aria-label="힌트">? <span>힌트</span></button><button class="icon-button" data-action="showJournal" aria-label="조사 수첩">▤ <span>수첩</span></button></div></div><div class="scene-label">${scene.name}</div><div class="log-box" aria-live="polite"><strong>조사</strong>${state.log}</div></div><section class="inventory-wrap"><div class="inventory-head"><span>INVENTORY · ${state.inventory.length}/${MAX_SLOTS}</span><span>${state.selected.length ? `${state.selected.length}개 선택됨` : '아이템을 선택하세요'}</span></div><div class="inventory">${inventoryMarkup()}<button class="combine-button" data-action="combine" ${state.selected.length !== 2 ? 'disabled' : ''}>조합</button></div></section>${modalMarkup()}</main>`;
    bind(); save();
  }

  function renderEnding() {
    clearInterval(ticker);
    root.innerHTML = `<main class="start-screen"><div class="start-bg"></div><section class="start-card ending"><div class="ending-mark">◇</div><div class="eyebrow">MUNJADO RESTORED</div><h1>탈출 성공<span>그림 속 가치는 오래 남는다</span></h1><p>문자도와 조선 시대의 가치에 관한 기록을 모두 복원했습니다.</p><div class="ending-stats"><div><strong>${timeText(state.elapsed)}</strong>소요 시간</div><div><strong>${state.mistakes}</strong>오답</div><div><strong>${state.hints}</strong>힌트</div></div><button class="button primary" data-action="restart">처음부터 다시 하기</button></section></main>`;
    bind();
  }

  function bind() {
    root.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => act(el.dataset.action, el.dataset.value)));
  }

  function handleDirectionKey(event) {
    if (state.modal !== 'libraryChaseLock' || event.repeat) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      wakeAudio();
      submitLibraryRoute();
      return;
    }
    const directions = { ArrowUp: 'U', ArrowRight: 'R', ArrowDown: 'D', ArrowLeft: 'L' };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    wakeAudio();
    addLibraryRoute(direction);
  }

  function handleSubmitKey(event) {
    if (event.key !== 'Enter' || event.repeat) return;
    if (state.modal === 'libraryKeypad' && event.target?.matches('#codeAnswer')) {
      event.preventDefault(); submitCode();
    }
    if (state.modal === 'final' && event.target?.matches('[data-final]')) {
      event.preventDefault(); submitFinal();
    }
  }

  function go(scene) {
    if (transitioning) return;
    transitioning = true;
    setTimeout(() => {
      state.scene = scene; transitioning = false;
      const messages = {
        classFront: '빗소리가 멀어졌다. 교실 안에는 전자칠판의 대기음만 남아 있다.',
        classSide: '창가 쪽 바닥에 누군가 급히 떨어뜨린 흔적이 보인다.',
        homebase: '사물함들이 늘어서 있다. 3번 문에 긁힌 자국이 선명하다.',
        library: '오래된 나무 냄새가 난다. 가운데 서가에 푸른 흔적이 번져 있다.',
        digital: 'DS실의 빈 모니터 사이에서 대형 화면 하나만 불규칙하게 깜박인다.',
        dream: '넓은 나무 계단에 붉고 회색인 방석들이 일정한 간격으로 놓여 있다.',
        study: '따뜻한 탁상등 사이에서 낡은 카세트 플레이어가 희미하게 켜져 있다.',
        workspace: '달빛이 든 워크스페이스. 벽면 가구와 긴 벤치가 고요한 방 안에 서로 마주 보고 있다.',
        lounge: '달빛 아래 피아노 한 대만 따뜻한 빛을 받고 있다.'
      };
      state.log = messages[scene] || '다시 익숙한 장소로 돌아왔다.'; render();
      setTimeout(() => maybeTriggerChase(scene), 260);
    }, 90);
  }

  function openModal(type) {
    state.modal = type;
    render();
    setTimeout(() => {
      const modal = root.querySelector('.modal');
      if (type === 'workspaceShelf') {
        modal?.focus();
        if (modal) modal.scrollTop = 0;
        return;
      }
      root.querySelector('.modal button, .modal input')?.focus();
    }, 0);
  }
  function closeModal() { state.modal = null; state.modalItem = null; render(); }
  function error(message) { const node = root.querySelector('[data-error]'); if (node) node.textContent = message; state.mistakes += 1; save(); }

  function act(action, value) {
    if (action !== 'toggleSound') wakeAudio();
    if (action === 'start') { state = freshState(); state.screen = 'game'; state.startedAt = Date.now(); wakeAudio(); render(); startTimer(); return; }
    if (action === 'restart') { clearLibraryLockTimers(); localStorage.removeItem(SAVE_KEY); state = freshState(); render(); return; }
    if (action === 'toggleSound') return toggleSound();
    if (action === 'go') return go(value);
    if (action === 'closeModal') return closeModal();
    if (action === 'showJournal') return openModal('journal');
    if (action === 'showHint') return openModal('hint');
    if (action === 'board') return inspectBoard();
    if (action === 'answerBoard') return answerBoard(value);
    if (action === 'deskPattern') return inspectDeskPattern();
    if (action === 'pickup') return pickup(value);
    if (action === 'locker') return openLocker();
    if (action === 'pinToggle') return toggleLockerPin(Number(value));
    if (action === 'resetLockerPins') { state.lockerPins = []; return render(); }
    if (action === 'submitLockerPins') return submitLockerPins();
    if (action === 'selectItem') return selectItem(value);
    if (action === 'combine') return combineItems();
    if (action === 'libraryDoor') return libraryDoor();
    if (action === 'submitCode') return submitCode();
    if (action === 'shelf') return inspectShelf();
    if (action === 'addBook') { if ((state.bookChosen || []).length < 3 && !state.bookChosen.includes(value)) state.bookChosen.push(value); return render(); }
    if (action === 'removeBook') { state.bookChosen.splice(Number(value), 1); return render(); }
    if (action === 'resetBooks') { state.bookChosen = []; return render(); }
    if (action === 'submitBooks') return submitBooks();
    if (action === 'libraryChaseLock') return startLibraryChase();
    if (action === 'routeStep') return addLibraryRoute(value);
    if (action === 'resetRoute') return resetLibraryRoute();
    if (action === 'submitRoute') return submitLibraryRoute();
    if (action === 'digitalDoor') return digitalDoor();
    if (action === 'monitor') return monitor();
    if (action === 'addToken') { if (!state.sequenceChosen.includes(value)) state.sequenceChosen.push(value); return render(); }
    if (action === 'removeToken') { state.sequenceChosen.splice(Number(value), 1); return render(); }
    if (action === 'resetTokens') { state.sequenceChosen = []; return render(); }
    if (action === 'submitSequence') return submitSequence();
    if (action === 'dreamClue') return inspectDreamClue(value);
    if (action === 'cushions') return inspectCushions();
    if (action === 'answerCushions') return answerCushions(value);
    if (action === 'cassette') return inspectCassette();
    if (action === 'playMelody') return playMelody();
    if (action === 'melodyNote') { playPianoNote(Number(value) + 1); if ((state.melodyNotes || []).length < 4) state.melodyNotes.push(Number(value)); return render(); }
    if (action === 'resetMelody') { state.melodyNotes = []; return render(); }
    if (action === 'submitMelody') return submitMelody();
    if (action === 'workspaceShelf') return inspectWorkspaceShelf();
    if (action === 'workspaceLock') return inspectWorkspaceLock();
    if (action === 'workspacePin') return toggleWorkspacePin(Number(value));
    if (action === 'resetWorkspacePins') { state.workspacePins = []; return render(); }
    if (action === 'submitWorkspaceLock') return submitWorkspaceLock();
    if (action === 'chaseChoice') return resolveChase(value);
    if (action === 'checkpoint') return checkpoint();
    if (action === 'piano') return piano();
    if (action === 'pianoNote') { playPianoNote(value); if ((state.pianoNotes || []).length < 4) state.pianoNotes.push(value); return render(); }
    if (action === 'resetPiano') { state.pianoNotes = []; return render(); }
    if (action === 'submitPianoCode') return submitPianoCode();
    if (action === 'submitFinal') return submitFinal();
  }

  function pickup(item) {
    addItem(item);
    if (item === 'pageA') { state.flags.pageA = true; state.log = '종이 한쪽이 찢겨 있다. 반대쪽 조각이 학교 어딘가에 있다.'; addJournal('종이 A: EIGHT, THREE가 붉게 표시되어 있다.'); openModal('pageA'); }
    if (item === 'lockerKey') { state.flags.keyFound = true; state.log = '책상 서랍 안에 숨겨진 3번 사물함 열쇠다. 홈베이스에서 맞는 문을 찾아야 한다.'; addJournal('교실 책상 서랍에서 “3”이 새겨진 열쇠를 발견했다.'); render(); }
  }

  function inspectBoard() {
    if (state.flags.boardSolved) { state.log = '비상 표시창에는 “이 교실 앞쪽, 가운데 왼편 책상 서랍”이라는 위치 정보가 남아 있다.'; return render(); }
    openModal('board');
  }

  function answerBoard(answer) {
    if (answer !== 'were') return error('표시창이 다시 어두워진다. 가정법 과거의 be동사 형태를 확인하자.');
    state.flags.boardSeen = true; state.flags.boardSolved = true; state.modal = null;
    state.log = '정답을 누르자 비상 표시창에 “이 교실 앞쪽, 가운데 왼편 책상 서랍”이 나타났다.';
    addJournal('전자칠판: If I were a bird, I could fly. — 가정법 과거의 be동사 were.');
    notify('책상 서랍의 위치가 드러났다.'); render();
  }

  const DESK_PIN_PATTERN = [0, 3, 5, 6];

  function deskPatternMarkup() {
    return `<div class="eyebrow">교실 뒤쪽 · 관찰 단서</div><h2>의자가 빠진 책상을 기억하라</h2><p>여덟 자리 중 네 개의 의자만 유난히 뒤로 빠져 있다. 사물함 자물쇠도 같은 배열이다.</p><div class="desk-pattern" aria-label="2행 4열 책상 배치">${Array.from({ length: 8 }, (_, index) => `<span class="desk-unit ${DESK_PIN_PATTERN.includes(index) ? 'pulled' : ''}"><span class="sr-only">${index < 4 ? '윗줄' : '아랫줄'} 왼쪽에서 ${(index % 4) + 1}번째, 의자 ${DESK_PIN_PATTERN.includes(index) ? '빠짐' : '정상'}</span><i aria-hidden="true"></i><b aria-hidden="true"></b></span>`).join('')}</div><p class="pattern-note">숫자는 없다. 줄과 위치만 눈에 담아 두자.</p><div class="modal-actions"><button class="button primary" data-action="closeModal">배열을 기억한다</button></div>`;
  }

  function lockerPinsMarkup() {
    const pins = state.lockerPins || [];
    return `<div class="eyebrow">홈베이스 · 3번 사물함</div><h2>8핀 버튼 자물쇠</h2><p>열쇠를 돌리자 안쪽 덮개가 열리고 2×4 버튼이 나타났다. 교실에서 본 자리만 눌러야 한다.</p><div class="pin-lock" aria-label="2행 4열 버튼 자물쇠">${Array.from({ length: 8 }, (_, index) => `<button class="pin-button ${pins.includes(index) ? 'active' : ''}" data-action="pinToggle" data-value="${index}" aria-pressed="${pins.includes(index)}" aria-label="${index < 4 ? '윗줄' : '아랫줄'} 왼쪽에서 ${(index % 4) + 1}번째 핀"><span></span></button>`).join('')}</div><div class="pin-status">눌린 핀 <strong>${pins.length}</strong> / 4</div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">교실을 다시 본다</button><button class="button" data-action="resetLockerPins">모두 올리기</button><button class="button primary" data-action="submitLockerPins">잠금 해제</button></div>`;
  }

  function inspectDeskPattern() {
    if (!state.flags.deskPatternSeen) {
      state.flags.deskPatternSeen = true;
      addJournal('교실 뒤쪽 8개 책상: 의자가 빠진 네 자리와 사물함 8핀의 배열이 같다.');
    }
    openModal('deskPattern');
  }

  function openLocker() {
    if (state.flags.lockerOpened) { state.log = '3번 사물함은 비어 있다. 안에서 찾은 물건은 인벤토리에 있다.'; return render(); }
    if (!state.flags.lockerKeyInserted) {
      if (!has('lockerKey') || !state.selected.includes('lockerKey')) { state.log = has('lockerKey') ? '3번 열쇠를 인벤토리에서 먼저 선택해야 한다.' : '열쇠 구멍이 있다. 교실 어딘가에 맞는 열쇠가 있을 것이다.'; return render(); }
      state.flags.lockerKeyInserted = true;
      state.selected = state.selected.filter(id => id !== 'lockerKey');
      state.log = '열쇠는 맞지만 문은 열리지 않는다. 안쪽 덮개에서 8핀 버튼 자물쇠가 나타났다.';
    }
    state.lockerPins = state.lockerPins || [];
    openModal('lockerPins');
  }

  function toggleLockerPin(index) {
    const pins = state.lockerPins || [];
    state.lockerPins = pins.includes(index) ? pins.filter(pin => pin !== index) : [...pins, index];
    render();
  }

  function submitLockerPins() {
    const answer = [...(state.lockerPins || [])].sort((a, b) => a - b).join(',');
    if (answer !== DESK_PIN_PATTERN.join(',')) return error('딸깍, 잠금쇠가 튕겨 나왔다. 교실의 의자 위치와 위아래 줄을 다시 비교하자.');
    removeItem('lockerKey'); addItem('pageB'); addItem('blueFilter');
    state.flags.lockerOpened = true; state.modal = null; state.lockerPins = [];
    state.log = '네 핀이 동시에 들어가며 3번 사물함이 열렸다. 종이의 나머지 절반과 청색 필터가 들어 있다.';
    addJournal('8핀 자물쇠: 교실에서 의자가 빠져 있던 네 자리와 같은 버튼을 눌러 해제했다.');
    addJournal('종이 B: ONE, TWO가 붉게 표시되어 있다.');
    notify('3번 사물함이 열렸다.'); render();
  }

  function selectItem(item) {
    if (state.selected.includes(item)) state.selected = state.selected.filter(id => id !== item);
    else { if (state.selected.length === 2) state.selected.shift(); state.selected.push(item); }
    state.log = `${ITEMS[item].name}: ${ITEMS[item].description}`; render();
  }

  function combineItems() {
    const pair = [...state.selected].sort().join('+');
    if (pair === ['pageA', 'pageB'].sort().join('+')) {
      removeItem('pageA'); removeItem('pageB'); addItem('restoredNote'); state.flags.noteCombined = true; state.selected = []; addJournal('복원 기록: EIGHT → ONE → THREE → TWO. 한 자리 숫자로 읽으면 8-1-3-2.'); state.log = '두 조각의 찢어진 면이 정확히 맞는다. 네 개의 밑줄이 하나의 암호를 만든다.'; openModal('restoredNote');
    } else { state.log = '두 물건은 서로 맞지 않는다.'; state.selected = []; render(); }
  }

  function libraryDoor() {
    if (state.flags.libraryOpen) return go('library');
    if (!state.flags.noteCombined) { state.log = '숫자 키패드가 켜져 있다. 아직 네 자리 암호를 알 수 없다.'; return render(); }
    openModal('libraryKeypad');
  }

  function submitCode() {
    const answer = root.querySelector('#codeAnswer')?.value.trim();
    if (answer !== '8132') return error('짧은 경고음이 난다. 밑줄 친 수량 단어 네 개를 숫자로 바꿔 보자.');
    state.flags.libraryOpen = true; state.modal = null; addJournal('도서관 문 암호 8132: EIGHT(8), ONE(1), THREE(3), TWO(2).'); state.log = '잠금 장치가 풀렸다. 도서관 안쪽에서 푸른 표식이 반짝인다.'; notify('도서관 문이 열렸다.'); render();
  }

  function inspectShelf() {
    if (state.flags.librarySolved) { state.log = '숨은 서랍은 이미 열려 있다.'; return render(); }
    if (state.flags.libraryBooksSolved) { state.log = '책 세 권은 이미 맞췄다. 오른쪽 비상문의 방향 자물쇠를 풀어야 한다.'; return render(); }
    if (!state.selected.includes('blueFilter')) { state.log = has('blueFilter') ? '글씨가 너무 어둡다. 청색 필터를 선택해 서가에 대 보자.' : '푸른 흔적은 보이지만 글씨를 읽을 수 없다.'; return render(); }
    state.bookChosen = state.bookChosen || [];
    openModal('shelfPuzzle');
  }

  function submitBooks() {
    const chosen = (state.bookChosen || []).join('|');
    if (chosen !== 'pond|bamboo|loyalty') return error('서가가 꿈쩍하지 않는다. 각 영영풀이의 영어 답을 다시 생각하고, 그 단어가 포함된 책 제목을 찾자.');
    state.flags.libraryBooksSolved = true;
    addJournal('도서관 책 순서: carp(C…P) → Carp in the Pond, bamboo(B…O) → Bamboo and Ginkgo, loyalty(L…Y) → Loyalty of the Dynasty.');
    notify('발소리가 가까워진다!'); startLibraryChase();
  }

  function clearLibraryLockTimers() {
    clearTimeout(libraryLockTimer); clearInterval(libraryLockTicker);
    libraryLockTimer = null; libraryLockTicker = null;
  }

  function startLibraryChase() {
    clearLibraryLockTimers();
    state.libraryRoute = []; state.libraryLockDeadline = Date.now() + 15000; state.modal = 'libraryChaseLock'; render();
    libraryLockTicker = setInterval(() => {
      const seconds = root.querySelector('[data-lock-seconds]');
      if (seconds) seconds.textContent = Math.max(0, Math.ceil((state.libraryLockDeadline - Date.now()) / 1000));
    }, 200);
    libraryLockTimer = setTimeout(() => {
      clearLibraryLockTimers(); state.libraryLockDeadline = 0;
      caughtByRabbit('방향 자물쇠를 푸는 사이 토끼 안전요원이 뒤에서 어깨를 톡 쳤다.');
    }, 15000);
  }

  function routeDisplayMarkup() {
    const arrows = { U: '↑', R: '→', D: '↓', L: '←' };
    return state.libraryRoute.length ? state.libraryRoute.map(value => `<span>${arrows[value]}</span>`).join('') : '<em>빠르게 경로를 입력하세요.</em>';
  }

  function addLibraryRoute(value) {
    state.libraryRoute = state.libraryRoute || [];
    if (state.libraryRoute.length < 8) state.libraryRoute.push(value);
    const display = root.querySelector('.route-display'); if (display) display.innerHTML = routeDisplayMarkup(); save();
  }

  function resetLibraryRoute() {
    state.libraryRoute = [];
    const display = root.querySelector('.route-display'); if (display) display.innerHTML = routeDisplayMarkup(); save();
  }

  function submitLibraryRoute() {
    if ((state.libraryRoute || []).join('') !== 'RURUUR') return error('붉은 불이 켜진다. START에서 EXIT까지 검은 서가를 피해 빈 통로를 한 칸씩 다시 따라가자.');
    clearLibraryLockTimers(); state.libraryLockDeadline = 0;
    removeItem('blueFilter'); addItem('accessCard'); state.flags.librarySolved = true; state.selected = []; state.bookChosen = []; state.libraryRoute = []; state.modal = null;
    state.log = '마지막 방향을 누르자 비상문이 열렸다. 토끼 안전요원의 손이 닿기 직전 복도로 빠져나왔다.';
    addJournal('도서관 타임어택: 서가 미로의 탈출 경로는 → ↑ → ↑ ↑ →.');
    notify('추격 탈출 성공 · DS실 카드를 얻었다.'); render();
  }

  function digitalDoor() {
    if (state.flags.digitalSolved) { state.selected = []; return go('digital'); }
    if (!state.selected.includes('accessCard')) { state.log = '카드 인식기가 붉게 깜박인다. 출입 카드를 선택해야 한다.'; return render(); }
    state.selected = []; go('digital');
  }

  function monitor() {
    if (state.flags.digitalSolved) { state.log = '복원된 문장과 함께 라운지 방향 화살표가 떠 있다.'; return render(); }
    state.sequenceStep = 0; state.sequenceChosen = []; openModal('sequence');
  }

  function submitSequence() {
    const seq = sequences[state.sequenceStep];
    if (state.sequenceChosen.join('|') !== seq.answer.join('|')) return error('신호가 끊겼다. 문장 성분과 시제를 다시 확인하자.');
    if (state.sequenceStep < sequences.length - 1) { state.sequenceStep += 1; state.sequenceChosen = []; notify(`${state.sequenceStep}번째 문장 복구 완료.`); return render(); }
    addItem('pianoKey'); state.flags.digitalSolved = true; state.selected = []; state.modal = null; state.log = '세 문장이 연결되며 화면 아래에서 작은 피아노 열쇠가 떨어졌다. DS실 카드는 계속 사용할 수 있다.'; addJournal('의미상 주어: It was impossible for him to catch any fish.'); addJournal('성품을 나타내는 형용사: It was nice of him to take me home.'); addJournal('가정법 과거: If I had a lot of money, I would travel all over the world.'); notify('피아노 열쇠를 얻었다.'); render();
  }

  function inspectDreamClue(type) {
    const flag = { steps: 'dreamSteps', cubby: 'dreamCubby', rail: 'dreamRail' }[type];
    if (!flag) return;
    state.flags[flag] = true; state.dreamClueType = type; state.modal = 'dreamClue';
    const notes = {
      steps: '꿈나래터 번호 규칙: 바닥 가까운 줄의 왼쪽부터 1-2-3, 위로 갈수록 번호가 이어진다.',
      cubby: '꿈나래터 낙서: 숨은 곳은 빨강이 아니며, 바로 아래 방석은 빨강이다.',
      rail: '꿈나래터 난간: 숨은 곳은 창문보다 계단 쪽에 더 가깝다.'
    };
    addJournal(notes[type]); render();
  }

  function inspectCushions() {
    if (state.flags.dreamSolved) { state.log = '들춰 본 6번 회색 방석 아래에는 건전지가 있던 빈 홈만 남아 있다.'; return render(); }
    if (dreamClueCount() < 3) {
      const missing = [];
      if (!state.flags.dreamSteps) missing.push('아래 계단의 숫자');
      if (!state.flags.dreamCubby) missing.push('오른쪽 수납장 낙서');
      if (!state.flags.dreamRail) missing.push('위쪽 난간의 문장');
      state.log = `번호만으로는 방석을 고를 수 없다. 아직 ${missing.join(', ')} 단서가 필요하다.`;
      return render();
    }
    openModal('cushions');
  }

  function answerCushions(answer) {
    if (answer !== '6') return error('빈 홈이 없다. “회색이며 바로 아래가 빨강”인 후보를 찾고, 그중 계단에 가까운 쪽을 고르자.');
    addItem('battery'); state.flags.dreamSolved = true; state.modal = null;
    state.log = '6번 회색 방석을 들추자 아래 홈에서 낡은 건전지가 굴러 나왔다.';
    addJournal('꿈나래터 최종 추리: 후보 6번과 7번 중 계단에 가까운 6번 방석 아래에 건전지가 있었다.');
    notify('낡은 건전지를 얻었다.'); render();
  }

  function inspectCassette() {
    if (state.flags.studySolved) { state.log = '카세트의 세 램프가 3-1-2-3 순서로 천천히 깜박인다.'; return render(); }
    if (state.flags.cassettePowered) { state.melodyNotes = []; return openModal('cassette'); }
    if (!state.selected.includes('battery')) { state.log = has('battery') ? '건전지를 인벤토리에서 선택해 카세트에 넣자.' : '카세트에 전원이 없다. 어딘가에서 건전지를 찾아야 한다.'; return render(); }
    if (!state.flags.cassettePowered) { removeItem('battery'); state.flags.cassettePowered = true; addJournal('스터디카페 카세트에 꿈나래터의 건전지를 넣었다.'); }
    state.melodyNotes = []; openModal('cassette');
  }

  function playMelody() {
    const pattern = [3, 1, 2, 3];
    pattern.forEach((note, index) => setTimeout(() => playPianoNote(note + 1), index * 430));
    notify('안내음이 네 번 울린다.');
  }

  function submitMelody() {
    if ((state.melodyNotes || []).join('') !== '3123') return error('카세트가 되감긴다. 높고 낮은 음의 순서를 다시 들어 보자.');
    state.flags.studySolved = true; state.melodyNotes = []; state.modal = null;
    state.log = '3-1-2-3 패턴을 재현하자 카세트에서 “워크스페이스”라는 안내가 흘러나왔다.';
    addJournal('카세트 안내음: 높은 음(3) - 낮은 음(1) - 가운데 음(2) - 높은 음(3).');
    notify('워크스페이스 통로가 열렸다.'); render();
  }

  const WORKSPACE_OBJECTS = {
    0: ['🌿', '늘어진 화분'],
    2: ['📚', '세워 둔 책'],
    4: ['🌐', '작은 지구본'],
    6: ['🗃️', '작은 보관함'],
    8: ['🪴', '하얀 화분'],
    10: ['📖', '눕혀 둔 책'],
    14: ['◇', '철제 장식']
  };
  const WORKSPACE_PATTERN = Object.keys(WORKSPACE_OBJECTS).map(Number);

  function workspaceShelfMarkup() {
    return `<div class="eyebrow">워크스페이스 · 정면 벽</div><h2>누군가 두고 간 물건들</h2><p>정면의 오래된 책장은 대부분 비어 있다. 몇몇 칸에만 작은 물건들이 놓인 채 먼지가 끊겨 있다.</p><div class="workspace-shelf" aria-label="가로 3칸 세로 5칸 책장">${Array.from({ length: 15 }, (_, index) => { const object = WORKSPACE_OBJECTS[index]; return `<span class="shelf-cell ${object ? 'occupied' : ''}"><span class="sr-only">${Math.floor(index / 3) + 1}번째 줄 왼쪽에서 ${(index % 3) + 1}번째 칸, ${object ? object[1] : '빈 칸'}</span>${object ? `<b aria-hidden="true">${object[0]}</b><small>${object[1]}</small>` : '<i aria-hidden="true"></i>'}</span>`; }).join('')}</div><p class="pattern-note">물건들은 우연히 놓인 것처럼 보이지 않는다.</p><div class="modal-actions"><button class="button primary" data-action="closeModal">살펴보고 돌아선다</button></div>`;
  }

  function workspaceLockMarkup() {
    const pins = state.workspacePins || [];
    return `<div class="eyebrow">워크스페이스 · 벤치 수납함</div><h2>열다섯 개의 낡은 버튼</h2><div class="lock-inscription">“빈자리는 침묵하고,<br>남겨진 자리만 문을 연다.”</div><div class="workspace-lock" aria-label="가로 3칸 세로 5칸 버튼 자물쇠">${Array.from({ length: 15 }, (_, index) => `<button class="workspace-pin ${pins.includes(index) ? 'active' : ''}" data-action="workspacePin" data-value="${index}" aria-pressed="${pins.includes(index)}" aria-label="${Math.floor(index / 3) + 1}번째 줄 왼쪽에서 ${(index % 3) + 1}번째 버튼"><span></span></button>`).join('')}</div><div class="pin-status">눌린 버튼 <strong>${pins.length}</strong> / ${WORKSPACE_PATTERN.length}</div><p class="error" data-error></p><div class="modal-actions"><button class="button" data-action="closeModal">방 안을 다시 살핀다</button><button class="button" data-action="resetWorkspacePins">모두 해제</button><button class="button primary" data-action="submitWorkspaceLock">잠금 해제</button></div>`;
  }

  function inspectWorkspaceShelf() {
    if (!state.flags.workspaceShelfSeen) {
      state.flags.workspaceShelfSeen = true;
      addJournal('워크스페이스 정면 벽: 3×5 책장의 일부 칸에만 물건이 놓여 있다.');
    }
    openModal('workspaceShelf');
  }

  function inspectWorkspaceLock() {
    if (state.flags.workspaceSolved) { state.log = '벤치 수납함은 열려 있다. 안쪽 통로 표시등이 오션 라운지를 가리킨다.'; return render(); }
    state.workspacePins = state.workspacePins || [];
    openModal('workspaceLock');
  }

  function toggleWorkspacePin(index) {
    const pins = state.workspacePins || [];
    state.workspacePins = pins.includes(index) ? pins.filter(pin => pin !== index) : [...pins, index];
    render();
  }

  function submitWorkspaceLock() {
    const answer = [...(state.workspacePins || [])].sort((a, b) => a - b).join(',');
    if (answer !== WORKSPACE_PATTERN.join(',')) return error('잠금 표시등이 붉게 깜박인다. “빈자리”와 “남겨진 자리”의 뜻을 방 안에서 다시 찾아보자.');
    state.flags.workspaceSolved = true; state.workspacePins = []; state.modal = null;
    state.log = '일곱 버튼이 동시에 들어가며 벤치 수납함이 열렸다. 안쪽에는 오션 라운지로 이어지는 통로 스위치가 있다.';
    addJournal('워크스페이스 15버튼 자물쇠: 책장의 물건이 있던 일곱 칸과 같은 위치를 눌러 해제했다.');
    notify('오션 라운지 통로가 열렸다.'); render();
  }

  function maybeTriggerChase(scene) {
    const solutions = { study: 'desk', lounge: 'sword' };
    if (!solutions[scene] || state.chaseSeen.includes(scene) || state.screen !== 'game') return;
    state.chaseSeen.push(scene); state.chaseSolution = solutions[scene]; state.modal = 'chase'; render();
    clearTimeout(chaseTimer); chaseTimer = setTimeout(() => caughtByRabbit('시간이 끝났다. 토끼 안전요원이 살며시 어깨를 톡 쳤다.'), 8000);
  }

  function resolveChase(choice) {
    clearTimeout(chaseTimer);
    if (choice !== state.chaseSolution) return caughtByRabbit('선택한 길 앞에 토끼 안전요원의 커다란 슬리퍼가 나타났다.');
    state.modal = null; state.chaseSolution = null;
    state.log = state.scene === 'study' ? '책상 아래에서 발소리가 멀어질 때까지 기다렸다.' : '파란 스펀지 대검으로 문을 조용히 받치자 토끼 안전요원이 다른 복도로 지나갔다.';
    addJournal(state.scene === 'study' ? '추격 회피: 스터디카페의 긴 책상 아래에 숨었다.' : '추격 회피: 안전한 스펀지 대검으로 라운지 문을 받쳤다.');
    notify('토끼 안전요원을 피했다!'); render();
  }

  function caughtByRabbit(message) {
    clearTimeout(chaseTimer); state.catches += 1; state.mistakes += 1; state.chaseSolution = null;
    if (state.catches >= 2) { state.modal = 'gameOver'; state.log = message; render(); return; }
    state.modal = null; state.log = `${message} 아직 한 번 더 기회가 있다.`; notify('안전도 1 감소'); render();
  }

  function checkpoint() {
    state.catches = 0; state.modal = null; state.chaseSolution = null;
    state.elapsed = currentElapsed() + 30; state.startedAt = Date.now();
    state.log = '출입 기록을 쓰고 체크포인트로 돌아왔다. 아이템과 퍼즐 기록은 그대로다.';
    notify('30초 페널티 · 조사 계속'); render();
  }

  function piano() {
    if (!state.selected.includes('pianoKey') && !state.flags.pianoUnlocked) { state.log = has('pianoKey') ? '피아노 열쇠를 인벤토리에서 선택해 덮개를 열자.' : '덮개가 잠겨 있다. DS실의 신호와 관련 있어 보인다.'; return render(); }
    if (state.flags.pianoUnlocked) return openModal('final');
    state.pianoNotes = [];
    openModal('pianoCode');
  }

  function submitPianoCode() {
    if ((state.pianoNotes || []).join('') !== '2122') return error('낮은 불협화음이 울린다. 각 문장의 정답이 몇 번째 선택지인지 다시 확인하자.');
    removeItem('pianoKey'); state.flags.pianoUnlocked = true; state.pianoNotes = []; addJournal('피아노 악보: for(②), nice(①), were(②), bend(②) → 2-1-2-2.'); state.log = '정답 번호대로 건반을 누르자 피아노 안쪽 비밀 칸이 열렸다.'; notify('피아노의 비밀 칸이 열렸다.'); openModal('final');
  }

  function submitFinal() {
    const a = [...root.querySelectorAll('[data-final]')].map(n => n.value.trim().toLowerCase().replace(/[.]/g, ''));
    const ok = a[0] === 'respect' && a[1] === 'loyalty' && a[2] === 'justice';
    if (!ok) return error('피아노가 불협화음을 낸다. 효·충·의 문자도에서 잉어, 대나무, 연꽃이 상징하는 가치를 다시 확인하자.');
    state.elapsed = currentElapsed(); state.startedAt = 0; state.flags.finished = true; state.screen = 'ending'; localStorage.removeItem(SAVE_KEY); render();
  }

  function registerWebMCP() {
    if (!document.modelContext?.registerTool) return;
    const register = def => { try { document.modelContext.registerTool(def); } catch (_) { /* already registered */ } };
    register({ name: 'read_night_investigation', description: 'Read the visible game location, objective, inventory, and collected journal clues.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: () => ({ content: [{ type: 'text', text: JSON.stringify({ scene: SCENES[state.scene]?.name, objective: objective()[1], inventory: state.inventory.map(i => ITEMS[i].name), journal: state.journal }, null, 2) }] }) });
    register({ name: 'move_to_school_scene', description: 'Move to an available named scene in the visible escape game.', inputSchema: { type: 'object', properties: { scene: { type: 'string', enum: Object.keys(SCENES) } }, required: ['scene'], additionalProperties: false }, execute: ({ scene }) => { const target = hotspots().find(h => h.action === 'go' && h.value === scene); if (!target) throw new Error('That scene is not currently reachable.'); go(scene); return { content: [{ type: 'text', text: `Moved to ${SCENES[scene].name}.` }] }; } });
  }

  document.addEventListener('keydown', handleDirectionKey);
  document.addEventListener('keydown', handleSubmitKey);
  safeLoad(); render(); if (state.screen === 'game') startTimer(); registerWebMCP();
})();
