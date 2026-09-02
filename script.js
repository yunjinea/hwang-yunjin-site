/*
 * AFTER THE NUMBERS — VERSION 1
 * Front-end baseline: 2026-08-30
 *
 * Stable desktop engine + mobile Career scroll story
 * Mobile Cases and Expertise have dedicated one-time motion systems
 * Writing uses normal flow on mobile
 */

const qs=(s,ctx=document)=>ctx.querySelector(s);
const qsa=(s,ctx=document)=>[...ctx.querySelectorAll(s)];

// Progressive reveal: content is visible when JS is unavailable.
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revealObserver.unobserve(e.target)}})
},{threshold:.1,rootMargin:'0px 0px -7% 0px'});
qsa('.reveal').forEach(el=>revealObserver.observe(el));

// Navigation state.
const sections=qsa('[data-nav]');
const railItems=qsa('.rail-item');
const sectionObserver=new IntersectionObserver((entries)=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  const id=visible.target.dataset.nav;
  railItems.forEach(a=>a.classList.toggle('active',a.dataset.section===id));
},{threshold:[.18,.35,.55],rootMargin:'-24% 0px -56% 0px'});
sections.forEach(s=>sectionObserver.observe(s));

// Header / dark-section theme.
const topbar=qs('.topbar');
const rail=qs('.section-rail');
const nav=qs('.topnav');
const menu=qs('.menu-toggle');
const darkSections=[...qsa('[data-case-theme="dark"]'),qs('#about')].filter(Boolean);
function updateChrome(){
  topbar.classList.toggle('scrolled',scrollY>24);
  const probe=42;
  const onDark=darkSections.some(s=>{const r=s.getBoundingClientRect();return r.top<=probe&&r.bottom>=probe});
  topbar.classList.toggle('on-dark',onDark);
  rail?.classList.toggle('on-dark',onDark);
}
window.addEventListener('scroll',updateChrome,{passive:true});updateChrome();
function closeMenu({focus=false}={}){
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','메뉴 열기');
  if(focus)menu.focus();
}
menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');
});
qsa('.topnav a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu({focus:true})});

// Career scrollytelling — current role intentionally receives the longest dwell time.
const careerSection=qs('#career');
const careerRoles=qsa('[data-career-role]');
const careerYears=qsa('[data-career-year]');
const careerBar=qs('#career-progress-bar');
let careerIndex=-1;
function careerStepFromProgress(p){if(p<.40)return 0;if(p<.65)return 1;if(p<.85)return 2;return 3}
function updateCareer(){
  return; // B4.3 pinned career owns motion
  if(innerWidth<=760)return;
  const r=careerSection.getBoundingClientRect();
  const total=Math.max(1,careerSection.querySelector('.career-scroll').offsetHeight-innerHeight);
  const p=Math.min(1,Math.max(0,-r.top/total));
  const idx=careerStepFromProgress(p);
  if(idx!==careerIndex){
    careerIndex=idx;
    careerRoles.forEach((el,i)=>el.classList.toggle('active',i===idx));
    careerYears.forEach((el,i)=>el.classList.toggle('active',i===idx));
  }
  careerBar.style.width=`${Math.round(p*100)}%`;
}
window.addEventListener('scroll',updateCareer,{passive:true});updateCareer();

// Selected Cases — Forecast is tap/hover driven so mobile never depends on horizontal scroll.
const forecastSteps=qsa('#case-forecast .forecast-step');
const inventory=qs('#inventory-subflow');
const forecastStageTitle=qs('#forecast-stage-title');
const forecastStageDesc=qs('#forecast-stage-desc');
function setForecastStep(i){
  forecastSteps.forEach((el,j)=>{
    const active=i===j;
    el.classList.toggle('active',active);
    el.setAttribute('aria-pressed',String(active));
  });
  const active=forecastSteps[i];
  if(!active)return;
  if(forecastStageTitle)forecastStageTitle.textContent=active.querySelector('b').textContent;
  if(forecastStageDesc)forecastStageDesc.textContent=active.querySelector('span').textContent;
  inventory?.classList.toggle('visible',i===2);
}
forecastSteps.forEach((step,i)=>{
  step.addEventListener('mouseenter',()=>setForecastStep(i));
  step.addEventListener('focus',()=>setForecastStep(i));
  step.addEventListener('click',()=>setForecastStep(i));
});
setForecastStep(0);

// Case panels animate their own visual language when they enter the viewport.
const casePanelObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting));
},{threshold:.25});
qsa('.case-panel').forEach(panel=>casePanelObserver.observe(panel));

// Expertise interactive index.
const expertiseData=[
  {num:'01',title:'PLANNING<br>& FORECASTING',items:['Business Planning','Target Profit','3-Month Rolling Forecast','Mid / Long-term P&L']},
  {num:'02',title:'PROFITABILITY<br>ANALYSIS',items:['P&L Analysis','Variance Analysis','Item Profitability','Project Profitability']},
  {num:'03',title:'MANAGEMENT<br>ACCOUNTING',items:['Costing','Inventory Effect','Cost Allocation','Manufacturing Cost']},
  {num:'04',title:'BUDGET<br>& PERFORMANCE',items:['Budget Planning','Budget Control','KPI Management','Performance Tracking']},
  {num:'05',title:'INVESTMENT<br>& DECISION SUPPORT',items:['Investment Analysis','NPV / IRR','Feasibility Study','Executive Reporting']}
];
const expRows=qsa('.expertise-row');const expNum=qs('#expertise-num');const expTitle=qs('#expertise-title');const expList=qs('#expertise-list');
function setExpertise(i){
  const d=expertiseData[i];
  expNum.textContent=d.num;
  expTitle.innerHTML=d.title;
  expList.innerHTML=d.items.map(x=>`<li>${x}</li>`).join('');
  expRows.forEach((r,j)=>{
    const active=i===j;
    r.classList.toggle('active',active);
    r.setAttribute('aria-selected',String(active));
    r.tabIndex=active?0:-1;
  });
}
expRows.forEach((r,i)=>{r.addEventListener('mouseenter',()=>setExpertise(i));r.addEventListener('focus',()=>setExpertise(i));r.addEventListener('click',()=>setExpertise(i))});
expRows.forEach((row,index)=>row.addEventListener('keydown',event=>{
  if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
  event.preventDefault();
  let next=index;
  if(event.key==='ArrowDown')next=(index+1)%expRows.length;
  if(event.key==='ArrowUp')next=(index-1+expRows.length)%expRows.length;
  if(event.key==='Home')next=0;
  if(event.key==='End')next=expRows.length-1;
  setExpertise(next);
  expRows[next].focus({preventScroll:true});
}));


// B3.3.1 — Mobile scroll motion.
// Desktop keeps hover/in-view behavior. Mobile gets explicit scroll-driven states.
const mobileCaseMQ=window.matchMedia('(max-width:0px)'); // B4.3 disabled
const clamp01=n=>Math.max(0,Math.min(1,n));
function mobileSectionProgress(el){
  if(!el)return 0;
  const r=el.getBoundingClientRect();
  const vh=Math.max(1,window.innerHeight);
  // Starts after the case enters the lower viewport and completes before it fully exits.
  const start=vh*.76;
  const end=vh*.18-r.height;
  return clamp01((start-r.top)/Math.max(1,start-end));
}
function stepIndex(progress,count){
  return Math.max(0,Math.min(count-1,Math.floor(progress*count)));
}

let forecastManualUntil=0;
forecastSteps.forEach(step=>step.addEventListener('click',()=>{
  if(mobileCaseMQ.matches)forecastManualUntil=performance.now()+1700;
},{passive:true}));

const bridgeCols=qsa('#case-profitability .bridge-col');
const investmentNodes=qsa('#case-investment .decision-flow > div');
const investmentArrows=qsa('#case-investment .decision-flow > i');
const decisionOrbit=qs('#case-investment .decision-orbit');
const budgetPoints=qsa('#case-budget .budget-point');
const budgetStatus=qs('#case-budget .budget-status');
const budgetAlert=qs('#case-budget .budget-alert');

let mobileMotionFrame=0;
function updateMobileCaseMotion(){
  mobileMotionFrame=0;
  if(!mobileCaseMQ.matches){
    document.documentElement.classList.remove('mobile-case-motion');
    return;
  }
  document.documentElement.classList.add('mobile-case-motion');

  // 01 Forecast: scroll auto-plays, tap temporarily takes manual control.
  const fp=mobileSectionProgress(qs('#case-forecast'));
  const fi=stepIndex(fp,forecastSteps.length);
  if(performance.now()>forecastManualUntil)setForecastStep(fi);

  // 02 Profitability: build the bridge from Plan to Actual.
  const pp=mobileSectionProgress(qs('#case-profitability'));
  const pi=stepIndex(pp,bridgeCols.length);
  bridgeCols.forEach((el,i)=>{
    el.classList.toggle('mobile-passed',i<=pi);
    el.classList.toggle('mobile-current',i===pi);
  });

  // 03 Investment: move through the five decision gates.
  const ip=mobileSectionProgress(qs('#case-investment'));
  const ii=stepIndex(ip,investmentNodes.length);
  investmentNodes.forEach((el,i)=>{
    el.classList.toggle('mobile-passed',i<=ii);
    el.classList.toggle('mobile-current',i===ii);
  });
  investmentArrows.forEach((el,i)=>el.classList.toggle('mobile-passed',i<ii));
  decisionOrbit?.classList.toggle('mobile-active',ii>=2);

  // 04 Budget: reveal 82 → 91 → 104 and only then show the variance alert.
  const bp=mobileSectionProgress(qs('#case-budget'));
  const bi=stepIndex(bp,budgetPoints.length);
  budgetPoints.forEach((el,i)=>{
    el.classList.toggle('mobile-passed',i<=bi);
    el.classList.toggle('mobile-current',i===bi);
  });
  if(budgetStatus){
    const over=bi===budgetPoints.length-1;
    budgetStatus.textContent=over?'OVER BUDGET':'CONTROL RANGE';
    budgetStatus.classList.toggle('mobile-over',over);
  }
  budgetAlert?.classList.toggle('mobile-visible',bi===budgetPoints.length-1);
}
function requestMobileMotion(){
  if(!mobileMotionFrame)mobileMotionFrame=requestAnimationFrame(updateMobileCaseMotion);
}
window.addEventListener('scroll',requestMobileMotion,{passive:true});
window.addEventListener('resize',requestMobileMotion,{passive:true});
mobileCaseMQ.addEventListener?.('change',requestMobileMotion);
requestMobileMotion();



// =========================================================
// B3.4 — DESKTOP SCROLL-DIRECTED CASE STORY
// =========================================================
const desktopStoryMQ=window.matchMedia('(min-width:99999px)'); // B4.3 disabled
const reduceMotionMQ=window.matchMedia('(prefers-reduced-motion: reduce)');
const storyPanels=qsa('.case-panel[data-story-count]');
const profitabilityCols=qsa('#case-profitability .bridge-col');
const investStoryNodes=qsa('#case-investment .decision-flow > div');
const investStoryArrows=qsa('#case-investment .decision-flow > i');
const budgetStoryPoints=qsa('#case-budget .budget-point');
const expertiseVisual=qs('.expertise-visual');
const heroSpark=qs('.hero .spark');
const heroVerbs=qsa('.hero .verbs li');
let storyState=new Map(storyPanels.map(p=>[p,0]));
let storyLock=false;
let wheelAccumulator=0;
let storyActivePanel=null;

function addStoryProgress(){
  storyPanels.forEach(panel=>{
    if(panel.querySelector('.case-scene-progress'))return;
    const count=Number(panel.dataset.storyCount||1);
    const el=document.createElement('div');
    el.className='case-scene-progress';
    el.innerHTML=`<strong>${panel.dataset.storyLabel||'STEP'} · <span>01</span> / ${String(count).padStart(2,'0')}</strong><i><em></em></i>`;
    panel.appendChild(el);
  });
}
addStoryProgress();

function updateStoryProgress(panel,index){
  const count=Number(panel.dataset.storyCount||1);
  const p=panel.querySelector('.case-scene-progress');
  if(!p)return;
  const n=p.querySelector('strong span');
  const bar=p.querySelector('em');
  if(n)n.textContent=String(index+1).padStart(2,'0');
  if(bar)bar.style.width=`${((index+1)/count)*100}%`;
}

function setProfitabilityStep(i){
  profitabilityCols.forEach((el,j)=>{
    el.classList.toggle('story-passed',j<=i);
    el.classList.toggle('story-current',j===i);
  });
}
function setInvestmentStep(i){
  investStoryNodes.forEach((el,j)=>{
    el.classList.toggle('story-passed',j<=i);
    el.classList.toggle('story-current',j===i);
  });
  investStoryArrows.forEach((el,j)=>el.classList.toggle('story-passed',j<i));
  qs('#case-investment .decision-orbit')?.classList.toggle('story-active',i>=2);
}
function setBudgetStep(i){
  budgetStoryPoints.forEach((el,j)=>{
    el.classList.toggle('story-passed',j<=i);
    el.classList.toggle('story-current',j===i);
  });
  const over=i>=budgetStoryPoints.length-1;
  if(budgetStatus){
    budgetStatus.textContent=over?'OVER BUDGET':'CONTROL RANGE';
    budgetStatus.classList.toggle('mobile-over',over);
  }
  budgetAlert?.classList.toggle('story-visible',over);
}
function renderStory(panel,index,{pulse=true}={}){
  if(!panel)return;
  const count=Number(panel.dataset.storyCount||1);
  index=Math.max(0,Math.min(count-1,index));
  storyState.set(panel,index);
  if(panel.id==='case-forecast')setForecastStep(index);
  if(panel.id==='case-profitability')setProfitabilityStep(index);
  if(panel.id==='case-investment')setInvestmentStep(index);
  if(panel.id==='case-budget')setBudgetStep(index);
  updateStoryProgress(panel,index);
  requestRailMotion();
  if(pulse){
    panel.classList.remove('story-step-change');
    void panel.offsetWidth;
    panel.classList.add('story-step-change');
    setTimeout(()=>panel.classList.remove('story-step-change'),330);
  }
}

// Initial story rendering is deferred until rail helpers are initialized.

// Keep direct Forecast hover/click selection synchronized with the wheel story state.
forecastSteps.forEach((step,i)=>{
  const sync=()=>{if(desktopStoryMQ.matches){const panel=qs('#case-forecast');storyState.set(panel,i);updateStoryProgress(panel,i)}};
  step.addEventListener('mouseenter',sync);
  step.addEventListener('focus',sync);
  step.addEventListener('click',sync);
});

function panelAtStoryViewport(){
  if(!desktopStoryMQ.matches)return null;
  const targetTop=76;
  let best=null,bestDist=Infinity;
  storyPanels.forEach(panel=>{
    const r=panel.getBoundingClientRect();
    const dist=Math.abs(r.top-targetTop);
    if(r.bottom>innerHeight*.62 && r.top<innerHeight*.25 && dist<bestDist){best=panel;bestDist=dist}
  });
  return bestDist<160?best:null;
}

function activateStoryPanel(panel){
  if(storyActivePanel===panel)return;
  storyActivePanel=panel;
  storyPanels.forEach(p=>p.classList.toggle('story-active',p===panel));
  requestRailMotion();
}
function syncActivePanel(){
  if(!desktopStoryMQ.matches){
    document.documentElement.classList.remove('desktop-case-story');
    storyPanels.forEach(p=>p.classList.remove('story-active'));
    storyActivePanel=null;
    return;
  }
  document.documentElement.classList.add('desktop-case-story');
  activateStoryPanel(panelAtStoryViewport());
}
window.addEventListener('scroll',syncActivePanel,{passive:true});
window.addEventListener('resize',syncActivePanel,{passive:true});
desktopStoryMQ.addEventListener?.('change',syncActivePanel);
// Initial sync is deferred until rail helpers are initialized.

function scrollStoryTarget(target){
  if(!target)return;
  storyLock=true;
  if(target.matches?.('.case-panel'))activateStoryPanel(target);
  target.scrollIntoView({behavior:reduceMotionMQ.matches?'auto':'smooth',block:'start'});
  setTimeout(()=>{storyLock=false;wheelAccumulator=0;syncActivePanel()},reduceMotionMQ.matches?120:760);
}

function advanceStory(direction){
  const panel=panelAtStoryViewport();
  if(!panel)return false;
  activateStoryPanel(panel);
  const count=Number(panel.dataset.storyCount||1);
  let idx=storyState.get(panel)||0;
  const pos=storyPanels.indexOf(panel);
  if(direction>0){
    if(idx<count-1){renderStory(panel,idx+1);return true}
    const next=storyPanels[pos+1]||qs('#expertise');
    if(next){
      if(next.matches?.('.case-panel'))renderStory(next,0,{pulse:false});
      scrollStoryTarget(next);return true;
    }
  }else{
    if(idx>0){renderStory(panel,idx-1);return true}
    const prev=storyPanels[pos-1]||qs('.cases-intro');
    if(prev){
      if(prev.matches?.('.case-panel'))renderStory(prev,Number(prev.dataset.storyCount||1)-1,{pulse:false});
      scrollStoryTarget(prev);return true;
    }
  }
  return false;
}

window.addEventListener('wheel',(e)=>{
  if(!desktopStoryMQ.matches || storyLock)return;
  const panel=panelAtStoryViewport();
  if(!panel)return;
  e.preventDefault();
  wheelAccumulator+=e.deltaY;
  if(Math.abs(wheelAccumulator)<52)return;
  const dir=wheelAccumulator>0?1:-1;
  wheelAccumulator=0;
  advanceStory(dir);
},{passive:false});

window.addEventListener('keydown',(e)=>{
  if(!desktopStoryMQ.matches || storyLock)return;
  if(!panelAtStoryViewport())return;
  const down=['ArrowDown','PageDown',' '].includes(e.key);
  const up=['ArrowUp','PageUp'].includes(e.key);
  if(!down&&!up)return;
  e.preventDefault();
  advanceStory(down?1:-1);
});

// Direct clicking a case index starts that chapter at step 1.
qsa('.case-index a').forEach(a=>a.addEventListener('click',()=>{
  const panel=qs(a.getAttribute('href'));
  if(panel?.matches('.case-panel'))renderStory(panel,0,{pulse:false});
}));

// Expertise transition motion + animated graph, without putting the circle on top of the numeral.
function triggerExpertiseMotion(){
  if(!expertiseVisual)return;
  expertiseVisual.classList.remove('expertise-switch');
  void expertiseVisual.offsetWidth;
  expertiseVisual.classList.add('expertise-switch');
  setTimeout(()=>expertiseVisual.classList.remove('expertise-switch'),520);
}
expRows.forEach(r=>{
  r.addEventListener('mouseenter',triggerExpertiseMotion);
  r.addEventListener('focus',triggerExpertiseMotion);
  r.addEventListener('click',triggerExpertiseMotion);
});

// Hero graph periodically changes shape, while the two circles breathe.
const heroSeries=[
  [[20,220],[84,182],[135,194],[194,128],[248,146],[315,60],[370,85]],
  [[20,202],[84,210],[135,148],[194,166],[248,103],[315,116],[370,54]],
  [[20,226],[84,160],[135,175],[194,105],[248,126],[315,78],[370,98]],
  [[20,214],[84,192],[135,132],[194,151],[248,90],[315,72],[370,45]]
];
let heroSeriesIndex=0;
function renderHeroSeries(points){
  if(!heroSpark)return;
  const path=heroSpark.querySelector('path');
  if(path)path.setAttribute('d','M'+points.map(p=>p.join(' ')).join(' L'));
  const circles=qsa('circle',heroSpark);
  circles.forEach((c,i)=>{if(points[i]){c.setAttribute('cx',points[i][0]);c.setAttribute('cy',points[i][1])}});
}

// Smooth SVG interpolation rather than snapping between graph shapes.
let heroCurrentPoints=heroSeries[0].map(p=>[...p]);
let heroMorphRunning=false;
const easeMorph=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

function morphHeroSeries(nextPoints,duration=1750){
  if(!heroSpark || reduceMotionMQ.matches)return;
  const from=heroCurrentPoints.map(p=>[...p]);
  const to=nextPoints.map(p=>[...p]);
  const start=performance.now();
  heroMorphRunning=true;

  const frame=(now)=>{
    const t=Math.min(1,(now-start)/duration);
    const e=easeMorph(t);
    heroCurrentPoints=from.map((p,i)=>[
      p[0]+(to[i][0]-p[0])*e,
      p[1]+(to[i][1]-p[1])*e
    ]);
    renderHeroSeries(heroCurrentPoints);
    if(t<1){
      requestAnimationFrame(frame);
    }else{
      heroMorphRunning=false;
    }
  };
  requestAnimationFrame(frame);
}

// B4.1.1: automatic Hero morph / verb cycling disabled; scroll controls the scene.



// =========================================================
// B3.4.1 — LEFT RAIL THAT FOLLOWS REAL + VIRTUAL SCROLL
// During CASE internal steps the page may not physically move,
// so the cursor also reflects the virtual 01→04 case progression.
// =========================================================
sectionObserver.disconnect();

let railCursor=null;
let railProgress=null;
let railFrame=0;

function ensureRailMotionUI(){
  if(!rail || railCursor)return;
  railProgress=document.createElement('span');
  railProgress.className='rail-progress';
  railCursor=document.createElement('span');
  railCursor.className='rail-cursor';
  rail.append(railProgress,railCursor);
}

function railCenters(){
  if(!rail)return [];
  return railItems.map(item=>item.offsetTop+item.offsetHeight/2);
}

function absTop(el){
  const r=el.getBoundingClientRect();
  return r.top+window.scrollY;
}

function virtualCaseRailPosition(centers){
  if(!desktopStoryMQ.matches || !storyActivePanel)return null;
  const panelRect=storyActivePanel.getBoundingClientRect();
  if(panelRect.bottom<76 || panelRect.top>innerHeight*.55)return null;

  const caseIdx=Math.max(0,storyPanels.indexOf(storyActivePanel));
  const count=Math.max(1,Number(storyActivePanel.dataset.storyCount||1));
  const step=Math.max(0,storyState.get(storyActivePanel)||0);
  const stepP=count>1?step/(count-1):0;
  const chapterP=(caseIdx+stepP)/Math.max(1,storyPanels.length);

  const caseRailIdx=railItems.findIndex(i=>i.dataset.section==='case');
  const expertiseRailIdx=railItems.findIndex(i=>i.dataset.section==='expertise');
  if(caseRailIdx<0 || expertiseRailIdx<0)return null;

  return centers[caseRailIdx]+
    (centers[expertiseRailIdx]-centers[caseRailIdx])*Math.min(.94,chapterP*.94);
}

function syncRailMotion(){
  railFrame=0;
  if(!rail || innerWidth<=1100)return;
  ensureRailMotionUI();

  const centers=railCenters();
  if(!centers.length)return;

  let y=virtualCaseRailPosition(centers);
  let activeIdx=-1;

  if(y!==null){
    activeIdx=railItems.findIndex(i=>i.dataset.section==='case');
  }else{
    const probe=window.scrollY+Math.min(innerHeight*.42,420);
    const tops=sections.map(absTop);
    let seg=0;
    for(let i=0;i<tops.length;i++){
      if(probe>=tops[i])seg=i;
    }
    activeIdx=Math.min(seg,railItems.length-1);

    if(activeIdx>=tops.length-1){
      y=centers[centers.length-1];
    }else{
      const a=tops[activeIdx];
      const b=tops[activeIdx+1];
      const p=Math.max(0,Math.min(1,(probe-a)/Math.max(1,b-a)));
      y=centers[activeIdx]+(centers[activeIdx+1]-centers[activeIdx])*p;
    }
  }

  railItems.forEach((item,i)=>item.classList.toggle('active',i===activeIdx));
  railCursor.style.transform=`translate(-50%,${y}px)`;

  const start=centers[0];
  railProgress.style.top=`${start}px`;
  railProgress.style.height=`${Math.max(0,y-start)}px`;
}

function requestRailMotion(){
  if(!railFrame)railFrame=requestAnimationFrame(syncRailMotion);
}

window.addEventListener('scroll',requestRailMotion,{passive:true});
window.addEventListener('resize',requestRailMotion,{passive:true});

// Rail state is initialized now, so story rendering is safe.
storyPanels.forEach(p=>renderStory(p,0,{pulse:false}));
syncActivePanel();
requestRailMotion();


// =========================================================
// VERSION 2 — WRITING SERIES SELECTOR
// READ / DECIDE / CONTROL
// =========================================================
const writingTopics=qsa('.writing-topic');
const writingTopicsEl=qs('.writing-topics');
const writingPanel=qs('#writing-panel');
const writingPostList=qs('#writing-post-list');
const writingTitle=qs('#writing-title');
const writingKicker=qs('#writing-kicker');
const writingCount=qs('#writing-count');
const writingDescription=qs('#writing-description');
const writingQuote=qs('#writing-quote-text');
const writingViewAll=qs('#writing-view-all');

const writingData={
  read:{
    title:'READ',
    kicker:'ANALYSIS NOTES',
    description:'숫자가 만들어지고 달라지는 흐름을 기록합니다.',
    quote:'결과가 나오기 전과 나온 뒤의 흐름을 함께 읽습니다.<br>숫자 뒤에 있는 Driver를 연결합니다.',
    posts:[]
  },
  decide:{
    title:'DECIDE',
    kicker:'DECISION NOTES',
    description:'숫자를 선택과 의사결정의 기준으로 연결합니다.',
    quote:'좋은 분석은 결론을 대신하지 않습니다.<br>더 나은 선택을 할 수 있는 구조를 만듭니다.',
    posts:[]
  },
  control:{
    title:'CONTROL',
    kicker:'PERFORMANCE NOTES',
    description:'목표와 실적의 차이를 다음 행동으로 바꿉니다.',
    quote:'측정에서 멈추지 않고 관리로 이어갑니다.<br>차이를 발견하고 다음 기준을 다시 세웁니다.',
    posts:[]
  }
};

function writingPreview(type,index){
  if(type==='read'){
    return `<span class="post-preview preview-work" aria-hidden="true">
      <i></i><i></i><i></i><i></i>
    </span>`;
  }
  if(type==='explain'){
    const variants=[
      'M5 42 L22 34 L35 37 L50 22 L66 27 L82 9',
      'M5 35 L20 24 L34 31 L49 18 L64 21 L82 12',
      'M5 40 L19 36 L34 27 L49 31 L65 18 L82 20'
    ];
    return `<span class="post-preview preview-invest" aria-hidden="true">
      <svg viewBox="0 0 88 50"><path d="${variants[index%variants.length]}"></path><circle cx="82" cy="${[9,12,20][index%3]}" r="2.6"></circle></svg>
    </span>`;
  }
  return `<span class="post-preview preview-life" aria-hidden="true">
    <b>${String(index+1).padStart(2,'0')}</b><small>${type==='decide'?'DECIDE':'CONTROL'}</small>
  </span>`;
}

const escapeWritingHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeWritingHref=value=>/^\/writing\/[a-z0-9-]+\/$/.test(String(value||''))?String(value):'/writing/';
let activeWritingTopic='read';
let writingSwitchTimer=0;

function renderWritingTopic(key,{focus=false}={}){
  const d=writingData[key];
  if(!d || !writingPanel)return;
  activeWritingTopic=key;

  const idx=Object.keys(writingData).indexOf(key);
  writingTopicsEl?.style.setProperty('--topic-index',idx);
  writingTopics.forEach(btn=>{
    const active=btn.dataset.writingTopic===key;
    btn.classList.toggle('active',active);
    btn.setAttribute('aria-selected',String(active));
    btn.tabIndex=active?0:-1;
    if(active)writingPanel.setAttribute('aria-labelledby',btn.id);
    if(active && focus)btn.focus({preventScroll:true});
  });

  writingPanel.classList.add('switching');
  if(writingDescription)writingDescription.style.opacity='.25';
  if(writingQuote)writingQuote.style.opacity='.25';

  clearTimeout(writingSwitchTimer);
  writingSwitchTimer=setTimeout(()=>{
    writingTitle.textContent=d.title;
    writingKicker.textContent=d.kicker;
    const totalCount=Number.isFinite(d.totalCount)?d.totalCount:d.posts.length;
    const homePosts=d.posts.slice(0,3);
    writingCount.textContent=`${String(totalCount).padStart(2,'0')} ${totalCount===1?'STORY':'STORIES'}`;
    writingDescription.textContent=d.description;
    writingQuote.innerHTML=d.quote;
    if(writingViewAll){
      writingViewAll.href=`/writing/?series=${encodeURIComponent(key)}`;
      writingViewAll.innerHTML=`VIEW ALL ${String(totalCount).padStart(2,'0')} ${totalCount===1?'STORY':'STORIES'} <span>→</span>`;
      writingViewAll.hidden=totalCount<=homePosts.length;
    }

    writingPostList.innerHTML=homePosts.length ? homePosts.map((post,i)=>`
      <a class="post-row" style="--row-index:${i}" href="${safeWritingHref(post.url)}">
        <span class="post-num nowrap">${String(i+1).padStart(2,'0')}</span>
        <div>
          <small>${escapeWritingHTML(post.category)}</small>
          <h3>${escapeWritingHTML(post.title)}</h3>
        </div>
        <span class="read-time nowrap">${escapeWritingHTML(post.time)}</span>
        ${writingPreview(post.preview,i)}
      </a>
    `).join('') : `
      <div class="writing-empty">
        <b>NO PUBLISHED STORIES YET</b>
        <p>아직 공개된 글이 없습니다. 새 글을 발행하면 이곳에 표시됩니다.</p>
      </div>`;

    requestAnimationFrame(()=>{
      writingPanel.classList.remove('switching');
      if(writingDescription)writingDescription.style.opacity='1';
      if(writingQuote)writingQuote.style.opacity='1';
    });
  },150);
}

writingTopics.forEach(btn=>{
  btn.addEventListener('click',()=>renderWritingTopic(btn.dataset.writingTopic));
  btn.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();
    const current=writingTopics.indexOf(btn);
    let next=current;
    if(e.key==='ArrowRight')next=(current+1)%writingTopics.length;
    if(e.key==='ArrowLeft')next=(current-1+writingTopics.length)%writingTopics.length;
    if(e.key==='Home')next=0;
    if(e.key==='End')next=writingTopics.length-1;
    renderWritingTopic(writingTopics[next].dataset.writingTopic,{focus:true});
  });
});

Object.values(writingData).forEach(d=>{d.posts=[];d.totalCount=0});
renderWritingTopic('read');

function normalizePublishedPost(p){
  const key=p.series||p.category||'read';
  return{category:p.series_label||p.category_label||writingData[key]?.title||'WRITING',title:p.title||'',time:p.read_time||'',preview:key,url:p.url,excerpt:p.excerpt||''};
}
async function loadPublishedWriting(){
  try{
    const r=await fetch('/writing/index.json',{cache:'no-store'});
    if(!r.ok)throw new Error('Writing index unavailable');
    const posts=await r.json();
    Object.keys(writingData).forEach(key=>{
      const filtered=posts.filter(post=>(post.series||post.category)===key).map(normalizePublishedPost);
      writingData[key].posts=filtered;
      writingData[key].totalCount=filtered.length;
    });
    renderWritingTopic(activeWritingTopic);
  }catch(e){
    Object.values(writingData).forEach(data=>{data.posts=[];data.totalCount=0});
    renderWritingTopic(activeWritingTopic);
    console.warn('Writing index unavailable — empty state shown');
  }
}
loadPublishedWriting();





// =========================================================
// B5.0 — AUTO CINEMATIC HERO
// One entrance sequence. Scroll no longer controls Hero animation.
// =========================================================
const heroStorySection=qs('.hero-story');
const heroStickyScene=qs('.hero-story .hero-sticky');

function startHeroAutoMotion(){
  if(!heroStorySection)return;
  if(reduceMotionMQ.matches){
    heroStorySection.classList.add('hero-auto');
    return;
  }
  // Wait one frame so the hidden initial state is painted first.
  requestAnimationFrame(()=>requestAnimationFrame(()=>heroStorySection.classList.add('hero-auto')));
}
startHeroAutoMotion();

// =========================================================
// B4.3 — PINNED CHAPTER MOTION SYSTEM
// Each chapter remains visually fixed while scroll advances its scene.
// =========================================================
document.documentElement.classList.add('b43-pinned-story');

const c43=n=>Math.max(0,Math.min(1,n));
const e43=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const r43=(p,a,b)=>e43(c43((p-a)/Math.max(.0001,b-a)));

function sectionPinProgress(el){
  if(!el)return 0;
  const r=el.getBoundingClientRect();
  return c43(-r.top/Math.max(1,el.offsetHeight-innerHeight));
}
function reveal43(el,p,{x=0,y=22,scale=.985,min=.04}={}){
  if(!el)return;
  const q=e43(c43(p));
  el.style.opacity=String(min+(1-min)*q);
  el.style.transform=`translate3d(${((1-q)*x).toFixed(1)}px,${((1-q)*y).toFixed(1)}px,0) scale(${(scale+(1-scale)*q).toFixed(4)})`;
}
function plateau43(p,a,b,fade=.05){
  if(p<a-fade||p>b+fade)return 0;
  const enter=a<=0?1:r43(p,a-fade,a+fade);
  const leave=b>=1?0:r43(p,b-fade,b+fade);
  return c43(enter*(1-leave));
}

/* ---------- Career impact UI ---------- */
let careerImpact=qs('.career-impact');
if(!careerImpact && qs('.career-sticky')){
  careerImpact=document.createElement('div');
  careerImpact.className='career-impact';
  careerImpact.innerHTML='<span>01 / 04 · CURRENT</span><strong>BUSINESS<br>ANALYSIS</strong><i></i>';
  qs('.career-sticky').appendChild(careerImpact);
}
const careerImpactMeta=qs('span',careerImpact);
const careerImpactWord=qs('strong',careerImpact);

const careerScenes=[
  {a:0,b:.38,label:'01 / 04 · CURRENT',word:'BUSINESS<br>ANALYSIS'},
  {a:.38,b:.61,label:'02 / 04 · 2022—2025',word:'PLAN · COST<br>PERFORMANCE'},
  {a:.61,b:.82,label:'03 / 04 · 2018—2022',word:'PROJECT<br>PROFITABILITY'},
  {a:.82,b:1,label:'04 / 04 · FOUNDATION',word:'SALES<br>SUPPORT'}
];

function career43(){
  const scroll=qs('#career .career-scroll');
  if(!scroll)return;
  const p=sectionPinProgress(scroll);
  let best=0,bestW=-1;

  careerScenes.forEach((scene,i)=>{
    const w=plateau43(p,scene.a,scene.b,.035);
    if(w>bestW){bestW=w;best=i}
    const role=careerRoles[i];
    if(!role)return;

    role.classList.toggle('active',i===best);
    role.style.opacity=String(w);
    role.style.pointerEvents=w>.58?'auto':'none';
    role.style.transform=`translate3d(${((1-w)*(i%2?26:-20)).toFixed(1)}px,${((1-w)*24).toFixed(1)}px,0) scale(${(.982+.018*w).toFixed(4)})`;

    const year=qs('.career-role-year',role);
    if(year){
      const local=c43((p-scene.a)/Math.max(.001,scene.b-scene.a));
      year.style.transform=`translate3d(${(-18+36*local).toFixed(1)}px,${(-18*local).toFixed(1)}px,0) scale(${(.92+.10*local).toFixed(3)})`;
      year.style.opacity=String(.025+.05*w);
    }

    const elements=[
      qs('.period',role),qs('.company-type',role),qs('h3',role),
      qs('.role',role),qs('.tags',role),qs('.career-desc',role)
    ].filter(Boolean);
    const local=c43((p-scene.a)/Math.max(.001,scene.b-scene.a));
    elements.forEach((el,j)=>reveal43(el,r43(local,.02+j*.045,.20+j*.045),{y:18,min:.03}));

    qsa('.selected-work article,.role-points span',role).forEach((el,j)=>{
      reveal43(el,r43(local,.40+j*.065,.58+j*.065),{y:13,min:.06});
    });
    const endmark=qs('.career-endmark',role);
    if(endmark)reveal43(endmark,r43(local,.48,.72),{y:14,min:.06});
  });

  careerYears.forEach((el,i)=>{
    const on=i===best;
    el.classList.toggle('active',on);
    el.style.opacity=on?'1':'.43';
  });
  if(careerBar)careerBar.style.width=`${(p*100).toFixed(1)}%`;

  const sc=careerScenes[best];
  if(careerImpactMeta)careerImpactMeta.textContent=sc.label;
  if(careerImpactWord)careerImpactWord.innerHTML=sc.word;
  if(careerImpact)careerImpact.style.setProperty('--career-scene-progress',String(c43((p-sc.a)/Math.max(.001,sc.b-sc.a))));

  const side=qs('#career .career-side h2');
  if(side){
    const fade=r43(p,.10,.26);
    side.style.opacity=String(1-.64*fade);
    side.style.transform=`translate3d(0,${(-9*fade).toFixed(1)}px,0)`;
  }
  // A direct #career link must open on a readable first frame.
  if(p<=.02 && careerRoles[0]){
    careerRoles[0].style.opacity='1';
    careerRoles[0].style.transform='none';
    careerRoles[0].style.pointerEvents='auto';
    qsa('.period,.company-type,h3,.role,.tags,.career-desc,.selected-work article',careerRoles[0]).forEach(el=>{
      el.style.opacity='1';
      el.style.transform='none';
    });
  }
}

/* ---------- Cases intro ---------- */
function casesIntro43(){
  const runway=qs('.cases-intro-runway');
  const intro=qs('.cases-intro');
  if(!runway||!intro)return;
  qsa('.cases-intro-copy,.case-index,.cases-intro-copy > *,.case-index a',intro).forEach(el=>{
    el.style.opacity='1';
    el.style.transform='none';
  });
}

/* ---------- Case pinned scenes ---------- */
function forecast43(panel,p){
  const story=r43(p,.22,.88);
  const idx=Math.min(forecastSteps.length-1,Math.floor(story*forecastSteps.length));
  setForecastStep(idx);
  const track=qs('.forecast-track',panel);
  if(track){
    track.style.transformOrigin='left center';
    track.style.transform=`scaleX(${story.toFixed(3)})`;
  }
  forecastSteps.forEach((step,i)=>{
    const q=r43(story,(i-.35)/forecastSteps.length,(i+.75)/forecastSteps.length);
    const current=i===idx;
    step.style.opacity=String(current?1:.22+.55*q);
    step.style.transform=`translate3d(0,${current?-8:(8-8*q)}px,0)`;
  });
  if(inventory){
    const q=r43(story,.36,.62);
    inventory.style.opacity=String(.08+.92*q);
    inventory.style.transform=`translate3d(0,${((1-q)*15).toFixed(1)}px,0)`;
  }
  qsa('.forecast-live-bars i',panel).forEach((bar,i)=>{
    const q=r43(story,.48+i*.035,.65+i*.035);
    bar.style.transform=`scaleY(${(.12+.88*q).toFixed(3)})`;
    bar.style.transformOrigin='bottom';
    bar.style.opacity=String(.16+.84*q);
  });
}
function bridge43(panel,p){
  qsa('.bridge-col',panel).forEach((col,i)=>{
    const q=r43(p,.25+i*.075,.44+i*.075);
    const bar=qs('i',col),value=qs('.bridge-value',col);
    if(bar){bar.style.transform=`scaleY(${(.05+.95*q).toFixed(3)})`;bar.style.opacity=String(.12+.80*q)}
    if(value){value.style.opacity=String(.10+.90*q);value.style.transform=`translateY(${((1-q)*11).toFixed(1)}px)`}
  });
}
function investment43(panel,p){
  const nodes=qsa('.decision-flow>div',panel);
  const arrows=qsa('.decision-flow>i',panel);
  nodes.forEach((node,i)=>{
    const q=r43(p,.22+i*.10,.39+i*.10);
    reveal43(node,q,{y:20,scale:.96,min:.08});
  });
  arrows.forEach((a,i)=>{
    const q=r43(p,.29+i*.10,.43+i*.10);
    a.style.opacity=String(.08+.92*q);
    a.style.transform=`scaleY(${(.2+.8*q).toFixed(3)})`;
  });
  const orbit=qs('.decision-orbit',panel);
  if(orbit){
    const q=r43(p,.52,.86);
    orbit.style.opacity=String(.10+.90*q);
    orbit.style.transform=`rotate(${(-20+46*q).toFixed(1)}deg) scale(${(.88+.12*q).toFixed(3)})`;
  }
}
function budget43(panel,p){
  const pts=qsa('.budget-point',panel);
  pts.forEach((pt,i)=>{
    const q=r43(p,.28+i*.18,.47+i*.18);
    reveal43(pt,q,{y:18,scale:.96,min:.08});
  });
  const over=r43(p,.65,.87);
  if(budgetStatus)budgetStatus.textContent=over>.55?'OVER BUDGET':'CONTROL RANGE';
  if(budgetAlert){
    budgetAlert.style.opacity=String(over);
    budgetAlert.style.transform=`translate3d(0,${((1-over)*15).toFixed(1)}px,0)`;
  }
}
function cases43(){
  casesIntro43();
  storyPanels.forEach(panel=>{
    const p=sectionPinProgress(panel);
    const copy=qs('.case-copy',panel), visual=qs('.case-visual',panel);
    if(copy){copy.style.opacity='1';copy.style.transform='none'}
    if(visual){visual.style.opacity='1';visual.style.transform='none'}

    if(panel.id==='case-forecast')forecast43(panel,p);
    if(panel.id==='case-profitability')bridge43(panel,p);
    if(panel.id==='case-investment')investment43(panel,p);
    if(panel.id==='case-budget')budget43(panel,p);
  });
}

/* ---------- Expertise: richer content + 5 complete beats ---------- */
const expertiseRich=[
  {
    question:'앞으로 어떤 숫자가 만들어질 것인가?',
    desc:'사업계획과 Rolling Forecast를 통해 판매·생산·재고·원가의 흐름을 하나의 손익 전망으로 연결합니다.'
  },
  {
    question:'계획과 실제 사이에서 무엇이 달라졌는가?',
    desc:'매출과 손익의 변화를 Volume·Price·Cost 등 핵심 Driver로 나눠 변화의 원인과 다음 액션을 설명합니다.'
  },
  {
    question:'제품과 재고의 흐름이 손익에 어떻게 반영되는가?',
    desc:'원가 계산, 재고 효과와 배부 구조를 이해하고 제조활동이 손익으로 이어지는 연결고리를 분석합니다.'
  },
  {
    question:'예산과 실적의 차이를 어떻게 관리할 것인가?',
    desc:'예산 수립부터 집행, KPI와 실적 추적까지 차이를 조기에 확인하고 관리 포인트를 구조화합니다.'
  },
  {
    question:'이 투자는 어떤 기준으로 판단해야 하는가?',
    desc:'현금흐름, NPV·IRR, 사업성 및 리스크를 함께 검토해 경영진이 판단할 수 있는 의사결정 구조를 만듭니다.'
  }
];
const baseSetExpertise43=setExpertise;
setExpertise=function(i){
  baseSetExpertise43(i);
  const rich=expertiseRich[i]||expertiseRich[0];
  const q=qs('#expertise-question'),d=qs('#expertise-desc');
  if(q)q.textContent=rich.question;
  if(d)d.textContent=rich.desc;
};

let expManualUntil43=0;
expRows.forEach((row,i)=>row.addEventListener('click',()=>{
  expManualUntil43=performance.now()+1800;
  setExpertise(i);
},{passive:true}));

function expertise43(){
  const section=qs('#expertise');
  if(!section)return;
  const p=sectionPinProgress(section);
  const steps=5;
  const pos=c43(p*.999)*steps;
  const idx=Math.min(steps-1,Math.floor(pos));
  const local=pos-idx;

  if(performance.now()>expManualUntil43)setExpertise(idx);

  const pin=qs('.expertise-pin',section);
  if(pin)pin.style.setProperty('--expertise-progress',String(p));

  qsa('.expertise-row',section).forEach((row,i)=>{
    const dist=Math.abs(i-idx);
    row.style.opacity=String(i===idx?1:Math.max(.34,.72-dist*.12));
    row.style.transform=`translate3d(${i===idx?0:8}px,0,0)`;
  });

  const vis=qs('.expertise-visual',section);
  if(vis){
    const breath=Math.sin(local*Math.PI);
    vis.style.transform=`translate3d(0,${(-6*breath).toFixed(1)}px,0) scale(${(1+.008*breath).toFixed(4)})`;
  }
  const num=qs('#expertise-num');
  if(num)num.style.transform=`translate3d(${(-16+32*local).toFixed(1)}px,${(-8*local).toFixed(1)}px,0)`;

  qsa('.rise-bars i',section).forEach((bar,i)=>{
    const q=r43(local,.05+i*.035,.42+i*.035);
    bar.style.transform=`scaleY(${(.15+.85*q).toFixed(3)})`;
  });
  const ring=qs('.ring-art',section);
  if(ring)ring.style.transform=`translate3d(${(8-16*local).toFixed(1)}px,0,0) rotate(${(16*local).toFixed(1)}deg)`;

  const content=[qs('#expertise-kicker'),qs('#expertise-title'),qs('#expertise-question'),qs('#expertise-desc'),qs('.expertise-detail')];
  content.filter(Boolean).forEach((el,j)=>{
    const q=r43(local,.01+j*.035,.25+j*.035);
    el.style.opacity=String(.72+.28*q);
    el.style.transform=`translate3d(0,${((1-q)*11).toFixed(1)}px,0)`;
  });
}

/* ---------- Writing is a normal-flow editorial section ---------- */
function writing43(){
  const section=qs('#writing');
  if(!section)return;
  qsa('.writing-intro > *,.writing-topic,.writing-browser,.post-row,.writing-empty,.writing-quote',section).forEach(el=>{
    el.style.opacity='1';
    el.style.transform='none';
  });
}

/* ---------- About is visible on entry ---------- */
function about43(){
  const section=qs('#about');
  if(!section)return;
  const pin=qs('.about-pin',section);
  if(!pin)return;
  qsa(':scope > *',pin).forEach(el=>{el.style.opacity='1';el.style.transform='none'});
}

/* ---------- Master frame ---------- */
let frame43=0;
function update43(){
  frame43=0;
  // B4.5: the B4.3 motion engine is desktop-only.
  // Mobile has its own scene architecture to avoid two animation
  // systems writing to the same layout at the same time.
  if(document.documentElement.classList.contains('v23-ux') || reduceMotionMQ.matches || innerWidth<=760)return;
  career43();
  if(!qs('.case-explorer'))cases43();
  expertise43();
  writing43();
  about43();
}
function request43(){
  if(!frame43)frame43=requestAnimationFrame(update43);
}
window.addEventListener('scroll',request43,{passive:true});
window.addEventListener('resize',request43,{passive:true});
window.addEventListener('load',request43,{once:true});
setTimeout(request43,220);
request43();



// =========================================================
// B4.4 — MOBILE SCENE ARCHITECTURE
// Mobile uses one visible scene at a time instead of squeezing
// desktop-density content inside 100svh.
// =========================================================
const b44Mobile=window.matchMedia('(max-width:760px)');
const mobileLayoutAtLoad=b44Mobile.matches;
b44Mobile.addEventListener?.('change',event=>{if(event.matches!==mobileLayoutAtLoad)location.reload()});
const mobileCaseData={"case-forecast": {"framework": ["다음 3개월의 손익은 어디에서 움직이는가?", "Revenue · Production · Inventory · Cost", "판매계획만 보지 않고 생산과 재고 변화를 연결해 매출원가와 재고효과를 추정합니다.", "예상 손익과 주요 Driver를 미리 확인해 다음 액션을 준비합니다."], "steps": [["01", "REVENUE", "판매 계획", "예상 판매량과 가격을 기준으로 매출 출발점을 만듭니다."], ["02", "PRODUCTION", "생산 계획", "판매계획과 생산량의 차이가 재고에 어떤 변화를 만드는지 연결합니다."], ["03", "INVENTORY", "재고 효과", "원재료 → 재공품 → 제품의 수불 변화가 손익에 미치는 시차를 봅니다."], ["04", "COGS", "매출원가", "재료비·가공비와 재고효과를 반영해 미래 매출원가를 추정합니다."], ["05", "PROFIT", "손익 전망", "Revenue와 COGS를 연결해 다음 3개월의 손익과 주요 변동요인을 봅니다."]]}, "case-profitability": {"framework": ["계획과 실제 사이에서 무엇이 달라졌는가?", "Volume · Price · Material · Cost", "손익 차이를 핵심 Driver로 분해해 증감 원인을 구조적으로 설명합니다.", "가장 큰 영향 요인을 찾아 다음 관리 포인트와 실행 우선순위를 정합니다."], "steps": [["01", "PLAN", "기준점", "계획 손익을 기준점으로 두고 실제와의 차이를 측정합니다."], ["02", "VOLUME", "물량 효과", "판매량 변화가 손익에 끼친 효과를 분리합니다."], ["03", "PRICE", "가격 효과", "판매가격 변화가 만든 영향을 별도로 확인합니다."], ["04", "MATERIAL / COST", "원가 효과", "재료비와 가공비 등 비용 Driver를 분해합니다."], ["05", "RESULT", "Bridge complete", "Driver별 영향을 연결해 계획 대비 최종 손익 차이와 다음 관리 포인트를 설명합니다."]]}, "case-investment": {"framework": ["이 투자는 어떤 기준으로 판단해야 하는가?", "CAPEX · Cash Flow · NPV/IRR · Risk", "투자 규모와 운영 시나리오를 현금흐름으로 연결하고 수익성과 민감도를 함께 봅니다.", "수익성 숫자 하나가 아니라 가정과 리스크까지 포함해 GO / REVIEW / STOP 기준을 만듭니다."], "steps": [["01", "CAPEX", "Initial investment", "초기 투자 규모와 추가 자금 소요를 정의합니다."], ["02", "CASH FLOW", "Operating scenario", "매출·비용·운전자본 가정을 현금흐름 시나리오로 바꿉니다."], ["03", "NPV / IRR", "Return threshold", "현재가치와 내부수익률로 기대수익이 기준을 충족하는지 봅니다."], ["04", "RISK", "Sensitivity", "핵심 가정이 바뀔 때 사업성이 얼마나 흔들리는지 확인합니다."], ["05", "DECISION", "GO / REVIEW / STOP", "수익성과 리스크를 함께 놓고 의사결정 기준을 명확히 합니다."]]}, "case-budget": {"framework": ["예산과 실적의 차이를 어떻게 관리할 것인가?", "Budget · Actual · Variance · Driver", "예산 대비 차이를 조기에 확인하고 원인을 설명 가능한 Driver로 나눕니다.", "원인별 책임과 다음 실행을 연결해 단순 실적 보고를 관리 행동으로 바꿉니다."], "steps": [["01", "TARGET", "Budget · 100", "관리 기준이 되는 예산과 목표 수준을 먼저 고정합니다."], ["02", "TRACK", "82 → 91", "중간 실적을 연속적으로 확인해 정상 범위와 추세를 봅니다."], ["03", "GAP", "104 · OVER", "실적이 기준선을 넘어서는 순간을 명확한 관리 신호로 전환합니다."], ["04", "WHY", "Variance Driver", "차이가 발생한 원인을 핵심 Driver로 나눠 설명합니다."], ["05", "ACTION", "Control next", "원인 분석을 다음 집행·운영 계획의 관리 행동으로 연결합니다."]]}};
const b44Clamp=n=>Math.max(0,Math.min(1,n));
const b44Ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

function b44PinProgress(el){
  if(!el)return 0;
  const r=el.getBoundingClientRect();
  return b44Clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight));
}

function b44Career(){
  if(!b44Mobile.matches)return;
  const runway=qs('#career .career-scroll');
  if(!runway)return;
  const p=b44PinProgress(runway);

  // Seven mobile beats:
  // Current overview -> 3 Current Focus items -> 2022 -> 2018 -> 2017
  const bounds=[0,.16,.28,.40,.53,.69,.84,1];
  let beat=0;
  for(let i=0;i<bounds.length-1;i++){
    if(p>=bounds[i] && p<bounds[i+1]){beat=i;break}
    if(p>=bounds[bounds.length-2])beat=bounds.length-2;
  }

  const current=careerRoles[0];
  const focusArticles=qsa('.selected-work article',current);
  const overviewEls=[
    qs('.company-type',current),qs('h3',current),qs('.role',current),
    qs('.tags',current),qs('.career-desc',current),qs('.career-current-flow',current)
  ].filter(Boolean);
  const selected=qs('.selected-work',current);

  careerRoles.forEach((role,i)=>{
    let show=false;
    if(beat<=3 && i===0)show=true;
    if(beat===4 && i===1)show=true;
    if(beat===5 && i===2)show=true;
    if(beat===6 && i===3)show=true;
    role.style.opacity=show?'1':'0';
    role.style.pointerEvents=show?'auto':'none';
    role.style.transform=show?'translate3d(0,0,0)':'translate3d(0,18px,0)';
  });

  const inFocus=beat>=1 && beat<=3;
  current?.classList.toggle('mobile-focus-mode',inFocus);
  overviewEls.forEach(el=>{
    el.style.opacity=inFocus?'0':'1';
    el.style.transform=inFocus?'translate3d(0,-10px,0)':'translate3d(0,0,0)';
    el.style.pointerEvents=inFocus?'none':'auto';
  });
  if(selected){
    selected.style.opacity=inFocus?'1':'0';
    selected.style.pointerEvents=inFocus?'auto':'none';
  }
  focusArticles.forEach((a,i)=>{
    const on=inFocus && i===beat-1;
    a.style.opacity=on?'1':'0';
    a.style.transform=on?'translate3d(0,0,0)':'translate3d(0,18px,0)';
    a.classList.toggle('focus-active',on);
  });

  // Highlight 4 career years; current remains active for overview+focus beats.
  const yearIndex=beat<=3?0:beat-3;
  careerYears.forEach((y,i)=>{
    y.classList.toggle('active',i===yearIndex);
    y.style.opacity=i===yearIndex?'1':'.36';
  });

  if(careerBar)careerBar.style.width=`${(p*100).toFixed(1)}%`;
  if(careerImpactMeta){
    const labels=[
      '01 / 07 · CURRENT','02 / 07 · FOCUS 01','03 / 07 · FOCUS 02','04 / 07 · FOCUS 03',
      '05 / 07 · 2022—2025','06 / 07 · 2018—2022','07 / 07 · FOUNDATION'
    ];
    careerImpactMeta.textContent=labels[beat];
  }
  if(careerImpact)careerImpact.style.setProperty('--career-scene-progress',String((p-bounds[beat])/Math.max(.001,bounds[beat+1]-bounds[beat])));
}


/* Mobile Career remains scroll-progress based in VERSION 1.
   Cases, Expertise and Writing use their dedicated final systems below. */

let b44Frame=0;
function b44Update(){
  b44Frame=0;
  if(document.documentElement.classList.contains('v23-ux') || !b44Mobile.matches || reduceMotionMQ.matches)return;
  b44Career();
}
function b44Request(){
  if(!b44Frame)b44Frame=requestAnimationFrame(b44Update);
}
window.addEventListener('scroll',b44Request,{passive:true});
window.addEventListener('resize',b44Request,{passive:true});
window.addEventListener('load',b44Request,{once:true});
setTimeout(b44Request,260);
b44Request();

/* =========================================================
   VERSION 1 — MOBILE CASES + EXPERTISE
   ========================================================= */
(()=>{
  const mobile=window.matchMedia('(max-width:760px)');
  if(!mobile.matches || document.documentElement.classList.contains('v23-ux'))return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  /* ---------------------------------------------------------
     CASES — entry-triggered, cancellable, once-complete motion.
     --------------------------------------------------------- */
  const notes={
    'case-forecast':['ANALYSIS LOGIC','판매 → 생산 → 재고 → 원가를 연결해 다음 3개월 손익을 전망합니다.','CONCEPTUAL FLOW · NO COMPANY DATA'],
    'case-profitability':['BRIDGE LOGIC','계획 대비 차이를 Volume · Price · Cost로 분해해 무엇이 손익을 움직였는지 설명합니다.','ILLUSTRATIVE INDEX'],
    'case-investment':['DECISION LOGIC','CAPEX · Cash Flow · Return · Risk를 함께 놓고 의사결정 기준을 명확하게 만듭니다.','FRAMEWORK VIEW'],
    'case-budget':['CONTROL LOGIC','기준을 넘은 GAP을 WHY로 분해하고 다음 ACTION으로 연결합니다.','ILLUSTRATIVE CONTROL FLOW']
  };
  document.querySelectorAll('.case-panel').forEach(panel=>{
    const stage=panel.querySelector('.mobile-case-stage'); if(!stage)return;
    const n=notes[panel.id];
    if(n && !stage.querySelector('.b55-case-note')){const note=document.createElement('div');note.className='b55-case-note';note.innerHTML=`<small>${n[0]}</small><p>${n[1]}</p><em>${n[2]}</em>`;stage.appendChild(note)}
  });
  const delay=ms=>new Promise(r=>setTimeout(r,ms));
  async function pause(panel,token,ms){await delay(ms);return panel.dataset.b56Visible==='1' && panel._b56Token===token}
  function resetCase(panel){
    const stage=panel.querySelector('.mobile-case-stage'); if(!stage)return;
    if(panel.id==='case-forecast'){
      const motif=stage.querySelector('.motif-forecast'); motif?.classList.remove('relay-ready','relay-complete');motif?.style.setProperty('--relay-progress','0%');
      stage.querySelectorAll('.forecast-mini-line>i,.forecast-mini-labels .motif-step').forEach(x=>x.classList.remove('passed','active'));
    } else if(panel.id==='case-profitability'){
      stage.querySelectorAll('.wf-step').forEach(x=>x.classList.remove('passed','active'));stage.querySelectorAll('.wf-link').forEach(x=>x.classList.remove('drawn'));
    } else if(panel.id==='case-investment'){
      const motif=stage.querySelector('.decision-converge');motif?.classList.remove('decision-ready','decision-made');stage.querySelectorAll('.decision-converge-node').forEach(x=>x.classList.remove('arrived','active'));
    } else if(panel.id==='case-budget'){
      const motif=stage.querySelector('.threshold-chart');motif?.classList.remove('over-limit','why-visible','action-visible');stage.querySelectorAll('.threshold-point,.threshold-action').forEach(x=>x.classList.remove('shown','active'));
    }
  }
  function finishCase(panel){
    const stage=panel.querySelector('.mobile-case-stage'); if(!stage)return;
    if(panel.id==='case-forecast'){
      const motif=stage.querySelector('.motif-forecast');motif?.classList.add('relay-ready','relay-complete');motif?.style.setProperty('--relay-progress','100%');
      stage.querySelectorAll('.forecast-mini-line>i,.forecast-mini-labels .motif-step').forEach((x,i,a)=>{x.classList.add(i===a.length-1?'active':'passed')});
      const s=stage.querySelector('.forecast-relay-caption small'),b=stage.querySelector('.forecast-relay-caption strong');if(s)s.textContent='P&L';if(b)b.textContent='3M 손익 전망';
    } else if(panel.id==='case-profitability'){
      const steps=[...stage.querySelectorAll('.wf-step')];steps.forEach((x,i)=>x.classList.add(i===steps.length-1?'active':'passed'));stage.querySelectorAll('.wf-link').forEach(x=>x.classList.add('drawn'));
    } else if(panel.id==='case-investment'){
      const motif=stage.querySelector('.decision-converge');motif?.classList.add('decision-ready','decision-made');stage.querySelectorAll('.decision-converge-node').forEach(x=>x.classList.add('arrived'));
    } else if(panel.id==='case-budget'){
      const motif=stage.querySelector('.threshold-chart');motif?.classList.add('over-limit','why-visible','action-visible');stage.querySelectorAll('.threshold-point,.threshold-action').forEach(x=>x.classList.add('shown'));stage.querySelector('.threshold-action.act')?.classList.add('active');
    }
  }
  async function playCase(panel){
    if(panel.dataset.b56Played==='1' || panel.dataset.b56Playing==='1')return;
    panel.dataset.b56Playing='1';const token=(panel._b56Token||0)+1;panel._b56Token=token;resetCase(panel);
    if(reduce.matches){finishCase(panel);panel.dataset.b56Played='1';panel.dataset.b56Playing='0';return}
    if(!(await pause(panel,token,180))){panel.dataset.b56Playing='0';return}
    const stage=panel.querySelector('.mobile-case-stage');if(!stage)return;
    if(panel.id==='case-forecast'){
      const motif=stage.querySelector('.motif-forecast'),nodes=[...stage.querySelectorAll('.forecast-mini-line>i')],labels=[...stage.querySelectorAll('.forecast-mini-labels .motif-step')],capS=stage.querySelector('.forecast-relay-caption small'),capB=stage.querySelector('.forecast-relay-caption strong');
      const caps=[['REVENUE','판매 계획'],['PRODUCTION','생산 반영'],['INVENTORY','재고 효과'],['COGS','원가 추정'],['P&L','3M 손익 전망']];motif?.classList.add('relay-ready');
      for(let i=0;i<5;i++){motif?.style.setProperty('--relay-progress',`${i*25}%`);nodes.forEach((n,j)=>{n.classList.toggle('passed',j<i);n.classList.toggle('active',j===i)});labels.forEach((n,j)=>{n.classList.toggle('passed',j<i);n.classList.toggle('active',j===i)});if(capS)capS.textContent=caps[i][0];if(capB)capB.textContent=caps[i][1];if(!(await pause(panel,token,i===4?430:330))){resetCase(panel);panel.dataset.b56Playing='0';return}}motif?.classList.add('relay-complete');
    } else if(panel.id==='case-profitability'){
      const steps=[...stage.querySelectorAll('.wf-step')],links=[...stage.querySelectorAll('.wf-link')];
      for(let i=0;i<steps.length;i++){steps.forEach((x,j)=>{x.classList.toggle('passed',j<i);x.classList.toggle('active',j===i)});if(i>0)links[i-1]?.classList.add('drawn');if(!(await pause(panel,token,i===steps.length-1?500:350))){resetCase(panel);panel.dataset.b56Playing='0';return}}
    } else if(panel.id==='case-investment'){
      const motif=stage.querySelector('.decision-converge'),nodes=[...motif.querySelectorAll('.decision-converge-node')].slice(0,4);motif?.classList.add('decision-ready');
      for(let i=0;i<nodes.length;i++){nodes.forEach((x,j)=>{x.classList.toggle('arrived',j<=i);x.classList.toggle('active',j===i)});if(!(await pause(panel,token,350))){resetCase(panel);panel.dataset.b56Playing='0';return}}nodes.forEach(x=>x.classList.remove('active'));motif?.classList.add('decision-made');
    } else if(panel.id==='case-budget'){
      const motif=stage.querySelector('.threshold-chart'),points=[...motif.querySelectorAll('.threshold-point')],why=motif.querySelector('.threshold-action.why'),act=motif.querySelector('.threshold-action.act');
      for(let i=0;i<points.length;i++){points[i].classList.add('shown','active');if(i>0)points[i-1].classList.remove('active');if(i===2)motif?.classList.add('over-limit');if(!(await pause(panel,token,i===2?520:360))){resetCase(panel);panel.dataset.b56Playing='0';return}}points.at(-1)?.classList.remove('active');motif?.classList.add('why-visible');why?.classList.add('shown','active');if(!(await pause(panel,token,430))){resetCase(panel);panel.dataset.b56Playing='0';return}why?.classList.remove('active');motif?.classList.add('action-visible');act?.classList.add('shown','active');
    }
    panel.dataset.b56Played='1';panel.dataset.b56Playing='0';
  }
  const caseObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
    const p=e.target;
    if(e.isIntersecting && e.intersectionRatio>=.34){p.dataset.b56Visible='1';playCase(p)}
    if(!e.isIntersecting || e.intersectionRatio<.25){p.dataset.b56Visible='0';p._b56Token=(p._b56Token||0)+1;if(p.dataset.b56Played!=='1'){resetCase(p);p.dataset.b56Playing='0'}}
  }),{threshold:[.2,.25,.34,.58]});
  document.querySelectorAll('.case-panel').forEach(p=>caseObserver.observe(p));

  /* ---------------------------------------------------------
     EXPERTISE — one domain = one scene, play only once.
     --------------------------------------------------------- */
  const exp=document.getElementById('expertise');
  if(exp){
    try{ expertise43=function(){}; }catch(e){}
    const titles=['PLANNING & FORECASTING','PROFITABILITY ANALYSIS','MANAGEMENT ACCOUNTING','BUDGET & PERFORMANCE','INVESTMENT & DECISION SUPPORT'];
    const questions=['앞으로 어떤 숫자가 만들어질 것인가?','계획과 실제 사이에서 무엇이 달라졌는가?','제품과 재고의 흐름이 손익에 어떻게 반영되는가?','예산과 실적의 차이를 어떻게 관리할 것인가?','이 투자는 어떤 기준으로 판단해야 하는가?'];
    const descs=['사업계획과 Rolling Forecast로 판매·생산·재고·원가를 하나의 손익 전망으로 연결합니다.','손익 차이를 Volume·Price·Cost Driver로 나눠 원인과 다음 액션을 설명합니다.','원가·재고·배부 구조가 제조활동에서 손익으로 이어지는 연결을 분석합니다.','예산·KPI·실적 차이를 조기에 확인하고 관리 포인트를 구조화합니다.','현금흐름·수익성·리스크를 함께 놓고 투자 판단 기준을 만듭니다.'];
    const items=[['Business Planning','Target Profit','3-Month Rolling Forecast','Mid / Long-term P&L'],['P&L Analysis','Variance Analysis','Item Profitability','Project Profitability'],['Costing','Inventory Effect','Cost Allocation','Manufacturing Cost'],['Budget Planning','Budget Control','KPI Management','Performance Tracking'],['Investment Analysis','NPV / IRR','Feasibility Study','Executive Reporting']];
    const motif=i=>i===0?`<div class="b55-exp-motif b55-exp-forward"><svg viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M4 73 C38 65 46 43 80 55 S118 65 145 38"/><line x1="146" x2="146" y1="5" y2="96"/><path class="future" d="M145 38 C180 30 193 48 222 28 S263 20 296 12"/></svg></div>`:i===1?`<div class="b55-exp-motif b55-exp-bridge"><i style="--h:68%"></i><i style="--h:82%"></i><i style="--h:71%"></i><i style="--h:60%"></i><i style="--h:69%"></i></div>`:i===2?`<div class="b55-exp-motif b55-exp-flow"><span>PRODUCT</span><i>→</i><span>INVENTORY</span><i>→</i><span>COST</span><i>→</i><strong>P&amp;L</strong></div>`:i===3?`<div class="b55-exp-motif b55-exp-control"><span>PLAN</span><span>TRACK</span><span>COMPARE</span><span>CONTROL</span></div>`:`<div class="b55-exp-motif b55-exp-matrix"><i style="--x:18%;--y:24%"></i><i style="--x:34%;--y:55%"></i><i style="--x:56%;--y:34%"></i><i style="--x:72%;--y:67%"></i><i style="--x:82%;--y:78%"></i></div>`;
    exp.className='b55-expertise';
    exp.innerHTML=titles.map((title,i)=>`<article class="b55-exp-scene" data-exp="${i}"><div class="b55-exp-watermark">0${i+1}</div><div class="b55-exp-top"><span>04 / EXPERTISE</span><div class="b55-exp-index">${[0,1,2,3,4].map(j=>j===i?`<b>0${j+1}</b>`:`<span>0${j+1}</span>`).join('')}</div></div><div class="b55-exp-body"><small class="b55-exp-kicker">CORE QUESTION</small><h3 class="b55-exp-title">${title}</h3><p class="b55-exp-question">${questions[i]}</p><p class="b55-exp-desc">${descs[i]}</p><div class="b55-exp-cap"><small>CAPABILITIES</small><div class="b55-exp-cap-grid">${items[i].map(x=>`<span>${x}</span>`).join('')}</div></div></div>${motif(i)}</article>`).join('');
    const expObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.5){e.target.classList.add('is-visible');e.target.dataset.b56Played='1';expObs.unobserve(e.target)}}),{threshold:[.5,.68]});
    exp.querySelectorAll('.b55-exp-scene').forEach(s=>reduce.matches?s.classList.add('is-visible'):expObs.observe(s));
  }
})();


/* =========================================================
   VERSION 1 — SELECTED CASES INTRO
   One staged entrance; no scroll-progress writer.
   ========================================================= */
(()=>{
  if(!window.matchMedia('(max-width:760px)').matches || document.documentElement.classList.contains('v23-ux'))return;
  const intro=document.querySelector('.cases-intro');
  if(!intro)return;
  const copy=intro.querySelector('.cases-intro-copy');
  const title=copy?.querySelector('h2');
  const desc=[...(copy?.querySelectorAll(':scope > p')||[])].find(
    p=>!p.classList.contains('section-label')&&!p.classList.contains('case-mobile-index-note')
  );

  copy?.classList.add('in');
  intro.classList.add('v1-cases-intro');
  if(desc)desc.classList.add('v1-cases-desc');
  if(title){
    title.innerHTML=`<span class="v1-cases-lines">${['SEE.','EXPLAIN.','DECIDE.','CONTROL.']
      .map((word,index)=>`<span class="v1-cases-word w${index+1}">${word}</span>`).join('')}</span>`;
  }

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const play=()=>{
    if(reduce.matches){intro.classList.add('is-playing');return;}
    intro.classList.remove('is-playing');
    void intro.offsetWidth;
    setTimeout(()=>intro.classList.add('is-playing'),50);
  };
  let active=false;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&entry.intersectionRatio>.42){
        if(!active){active=true;play();}
      }else if(entry.intersectionRatio<.12){
        active=false;
        intro.classList.remove('is-playing');
      }
    });
  },{threshold:[0,.12,.42,.65]});
  observer.observe(intro);

  const rect=intro.getBoundingClientRect();
  if(rect.top<innerHeight*.82&&rect.bottom>innerHeight*.18)play();
})();


/* =========================================================
   VERSION 2.2 — SELECTED CASES / CLICK-TO-EXPLORE
   Four cases share one stage. Only the selected case is shown.
   ========================================================= */
(()=>{
  const explorer=document.querySelector('.case-explorer');
  if(!explorer)return;

  const tabs=[...explorer.querySelectorAll('[data-case-target]')];
  const panels=tabs.map(tab=>document.getElementById(tab.dataset.caseTarget)).filter(Boolean);
  const stage=explorer.querySelector('.case-stage');
  const activeLabel=document.getElementById('case-active-label');
  const liveStatus=document.getElementById('case-live-status');
  const previous=explorer.querySelector('[data-case-prev]');
  const next=explorer.querySelector('[data-case-next]');
  let activeIndex=0;

  function tabLabel(index){
    const tab=tabs[index];
    const number=tab?.querySelector(':scope > span')?.textContent?.trim()||String(index+1).padStart(2,'0');
    const title=tab?.querySelector('b')?.textContent?.trim()||'';
    return {number,title,full:`${number} / ${title}`};
  }

  function selectCase(index,{focus=false,updateHash=true,announce=true,scrollToStage=false}={}){
    index=(index+tabs.length)%tabs.length;
    activeIndex=index;
    const selected=tabs[index];
    const selectedId=selected.dataset.caseTarget;

    tabs.forEach((tab,i)=>{
      const active=i===index;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    panels.forEach(panel=>{
      const active=panel.id===selectedId;
      panel.hidden=!active;
      panel.setAttribute('aria-hidden',String(!active));
      panel.classList.toggle('active',active);
      panel.classList.toggle('in-view',active);
      if(active)panel.dataset.b56Visible='1';
      else panel.dataset.b56Visible='0';
    });

    const label=tabLabel(index);
    if(activeLabel)activeLabel.textContent=label.full;
    if(liveStatus)liveStatus.textContent=`${label.number} / 04 · ${label.title}`;
    explorer.dataset.activeCase=selectedId;
    previous?.toggleAttribute('disabled',index===0);
    next?.toggleAttribute('disabled',index===tabs.length-1);

    stage?.classList.remove('case-is-changing');
    void stage?.offsetWidth;
    stage?.classList.add('case-is-changing');
    window.setTimeout(()=>stage?.classList.remove('case-is-changing'),420);

    if(updateHash && location.hash!==`#${selectedId}`){
      history.replaceState(null,'',`#${selectedId}`);
    }
    if(focus)selected.focus({preventScroll:true});
    if(announce && liveStatus)liveStatus.setAttribute('data-announced','true');
    if(scrollToStage)requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(!stage)return;
      const targetY=window.scrollY+stage.getBoundingClientRect().top-76;
      window.scrollTo({top:Math.max(0,targetY),behavior:'auto'});
    }));
    requestAnimationFrame(()=>{updateChrome();requestRailMotion?.()});
  }

  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectCase(index,{scrollToStage:false}));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
      event.preventDefault();
      let target=index;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')target=index+1;
      if(event.key==='ArrowLeft'||event.key==='ArrowUp')target=index-1;
      if(event.key==='Home')target=0;
      if(event.key==='End')target=tabs.length-1;
      selectCase(target,{focus:true,scrollToStage:false});
    });
  });
  previous?.addEventListener('click',()=>selectCase(activeIndex-1,{scrollToStage:false}));
  next?.addEventListener('click',()=>selectCase(activeIndex+1,{scrollToStage:false}));

  window.afterNumbersCaseSelect=(index,options={})=>selectCase(index,{scrollToStage:false,...options});

  function selectFromHash({scroll=false}={}){
    const index=tabs.findIndex(tab=>`#${tab.dataset.caseTarget}`===location.hash);
    if(index<0)return false;
    selectCase(index,{updateHash:false,announce:false});
    if(scroll)requestAnimationFrame(()=>explorer.scrollIntoView({block:'start'}));
    return true;
  }

  window.addEventListener('hashchange',()=>selectFromHash());
  if(!selectFromHash({scroll:true}))selectCase(0,{updateHash:false,announce:false});
})();


/* =========================================================
   VERSION 2.3 — VIEWPORT-FIRST UX
   One readable scene at a time, with explicit click, wheel,
   keyboard and swipe controls.
   ========================================================= */
(()=>{
  const root=document.documentElement;
  if(!root.classList.contains('v23-ux'))return;

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop=()=>window.innerWidth>=900;
  const wrapDetails=(content,{className,label,meta})=>{
    if(!content || content.parentElement?.matches('details'))return content?.parentElement||null;
    const details=document.createElement('details');
    details.className=className;
    const summary=document.createElement('summary');
    summary.innerHTML=`<span><b>${label}</b><small>${meta}</small></span><i aria-hidden="true"></i>`;
    content.before(details);
    details.append(summary,content);
    return details;
  };

  // Keep dense supporting material available without making the page needlessly long.
  const currentWork=document.querySelector('.career-role--current .selected-work');
  wrapDetails(currentWork,{
    className:'v23-detail v23-career-detail',
    label:'현재 역할의 핵심 업무 3가지',
    meta:'P&L ISSUE · FORECAST · BUDGET'
  });
  document.querySelectorAll('.case-deep-dive').forEach((content,index)=>{
    wrapDetails(content,{
      className:'v23-detail v23-case-detail',
      label:'분석 상세 보기',
      meta:['WHY · HOW · OUTPUT','WHY · DRIVER · ACTION','ASSUMPTION · RISK · DECISION','VARIANCE · OWNER · ACTION'][index]
    });
  });

  // Overall reading progress.
  const pageProgress=document.createElement('div');
  pageProgress.className='v23-page-progress';
  pageProgress.setAttribute('aria-hidden','true');
  pageProgress.innerHTML='<i></i>';
  document.body.append(pageProgress);
  let progressFrame=0;
  const updatePageProgress=()=>{
    progressFrame=0;
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    pageProgress.style.setProperty('--page-progress',String(Math.max(0,Math.min(1,window.scrollY/max))));
  };
  const requestPageProgress=()=>{if(!progressFrame)progressFrame=requestAnimationFrame(updatePageProgress)};
  window.addEventListener('scroll',requestPageProgress,{passive:true});
  window.addEventListener('resize',requestPageProgress,{passive:true});
  requestPageProgress();

  // Shared entrance motion; no content is hidden when reduced motion is requested.
  const revealTargets=[...document.querySelectorAll('#career,#case,#expertise,#writing,#about')];
  if(reduce.matches){revealTargets.forEach(section=>section.classList.add('v23-in-view'))}
  else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('v23-in-view');observer.unobserve(entry.target)}
    }),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    revealTargets.forEach(section=>observer.observe(section));
  }

  const makeStepper=(className,label)=>{
    const el=document.createElement('div');
    el.className=className;
    el.innerHTML=`<button type="button" data-step-prev aria-label="이전 ${label}"><span aria-hidden="true">←</span> PREV</button><p aria-live="polite"></p><button type="button" data-step-next aria-label="다음 ${label}">NEXT <span aria-hidden="true">→</span></button>`;
    return el;
  };

  // Career: one role at a time. Tabs are real buttons and the wheel advances only while the section is centred.
  const career=document.getElementById('career');
  const careerStage=career?.querySelector('.career-stage');
  if(!desktop()&&career&&careerStage){
    const years=career.querySelector('.career-years');
    const progress=career.querySelector('.career-progress');
    if(years)careerStage.before(years);
    if(years&&progress)years.after(progress);
  }
  const careerStepper=career?makeStepper('v23-career-stepper','경력'):null;
  if(careerStepper)career.querySelector('.career-sticky')?.append(careerStepper);
  let activeCareer=-1;
  const careerNames=['2025 — PRESENT','2022 — 2025','2018 — 2022','2017 — 2018'];
  const activateCareer=(index,{focus=false}={})=>{
    index=Math.max(0,Math.min(careerRoles.length-1,index));
    if(index===activeCareer && careerRoles[index]?.classList.contains('active'))return;
    activeCareer=index;
    careerRoles.forEach((role,i)=>{
      const active=i===index;
      role.classList.toggle('active',active);
      role.setAttribute('aria-hidden',String(!active));
    });
    careerYears.forEach((button,i)=>{
      const active=i===index;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
      if(active&&focus)button.focus({preventScroll:true});
    });
    if(careerBar)careerBar.style.width=`${((index+1)/careerRoles.length)*100}%`;
    const status=careerStepper?.querySelector('p');
    if(status)status.textContent=`${String(index+1).padStart(2,'0')} / 04 · ${careerNames[index]}`;
    careerStepper?.querySelector('[data-step-prev]')?.toggleAttribute('disabled',index===0);
    careerStepper?.querySelector('[data-step-next]')?.toggleAttribute('disabled',index===careerRoles.length-1);
    careerStage?.classList.remove('v23-switching');
    void careerStage?.offsetWidth;
    careerStage?.classList.add('v23-switching');
  };
  careerYears.forEach((button,index)=>{
    button.addEventListener('click',()=>activateCareer(index));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      let target=index;
      if(event.key==='ArrowRight')target=Math.min(careerRoles.length-1,index+1);
      if(event.key==='ArrowLeft')target=Math.max(0,index-1);
      if(event.key==='Home')target=0;
      if(event.key==='End')target=careerRoles.length-1;
      activateCareer(target,{focus:true});
    });
  });
  careerStepper?.querySelector('[data-step-prev]')?.addEventListener('click',()=>activateCareer(activeCareer-1));
  careerStepper?.querySelector('[data-step-next]')?.addEventListener('click',()=>activateCareer(activeCareer+1));
  activateCareer(0);

  const centred=section=>{
    const rect=section.getBoundingClientRect();
    return rect.top<window.innerHeight*.24 && rect.bottom>window.innerHeight*.76;
  };
  const wheelNavigator=(section,getIndex,count,select)=>{
    if(!section)return;
    let sum=0;
    let locked=false;
    section.addEventListener('wheel',event=>{
      if(!desktop()||reduce.matches||!centred(section)||event.ctrlKey)return;
      sum+=event.deltaY;
      if(Math.abs(sum)<58||locked)return;
      const direction=sum>0?1:-1;
      sum=0;
      const index=getIndex();
      const next=index+direction;
      if(next<0||next>=count)return;
      event.preventDefault();
      locked=true;
      select(next);
      window.setTimeout(()=>{locked=false},430);
    },{passive:false});
  };
  wheelNavigator(career,()=>activeCareer,careerRoles.length,index=>activateCareer(index));

  const addSwipe=(surface,getIndex,count,select)=>{
    if(!surface)return;
    let startX=0,startY=0;
    surface.addEventListener('touchstart',event=>{
      const touch=event.changedTouches[0];startX=touch.clientX;startY=touch.clientY;
    },{passive:true});
    surface.addEventListener('touchend',event=>{
      const touch=event.changedTouches[0];
      const dx=touch.clientX-startX,dy=touch.clientY-startY;
      if(Math.abs(dx)<54||Math.abs(dx)<Math.abs(dy)*1.25)return;
      const next=getIndex()+(dx<0?1:-1);
      if(next>=0&&next<count)select(next);
    },{passive:true});
  };
  addSwipe(careerStage,()=>activeCareer,careerRoles.length,index=>activateCareer(index));

  // Cases: retain accessible tabs and add desktop wheel + mobile swipe navigation.
  const caseExplorer=document.querySelector('.case-explorer');
  const caseTabs=[...(caseExplorer?.querySelectorAll('[data-case-target]')||[])];
  const caseStage=caseExplorer?.querySelector('.case-stage');
  const caseIndex=caseExplorer?.querySelector('.case-index');
  if(!desktop()&&caseStage&&caseIndex)caseStage.before(caseIndex);
  const currentCaseIndex=()=>Math.max(0,caseTabs.findIndex(tab=>tab.classList.contains('active')));
  const chooseCase=index=>{
    window.afterNumbersCaseSelect?.(index,{updateHash:true,announce:true});
    caseExplorer?.querySelectorAll('.v23-case-detail[open]').forEach(detail=>detail.removeAttribute('open'));
  };
  wheelNavigator(caseExplorer, currentCaseIndex, caseTabs.length, chooseCase);
  addSwipe(caseStage,currentCaseIndex,caseTabs.length,chooseCase);

  // Expertise: tabs, wheel and swipe all update the same live panel.
  const expertise=document.getElementById('expertise');
  const expStage=expertise?.querySelector('.expertise-stage');
  const expStepper=expertise?makeStepper('v23-expertise-stepper','전문 분야'):null;
  if(expStepper)expertise.querySelector('.expertise-pin')?.append(expStepper);
  let activeExpertise=0;
  const expNames=['PLANNING & FORECASTING','PROFITABILITY ANALYSIS','MANAGEMENT ACCOUNTING','BUDGET & PERFORMANCE','INVESTMENT & DECISION SUPPORT'];
  const activateExpertise=(index,{focus=false}={})=>{
    index=Math.max(0,Math.min(expRows.length-1,index));
    activeExpertise=index;
    setExpertise(index);
    if(focus)expRows[index]?.focus({preventScroll:true});
    const status=expStepper?.querySelector('p');
    if(status)status.textContent=`${String(index+1).padStart(2,'0')} / 05 · ${expNames[index]}`;
    expStepper?.querySelector('[data-step-prev]')?.toggleAttribute('disabled',index===0);
    expStepper?.querySelector('[data-step-next]')?.toggleAttribute('disabled',index===expRows.length-1);
    expStage?.classList.remove('v23-switching');
    void expStage?.offsetWidth;
    expStage?.classList.add('v23-switching');
  };
  expRows.forEach((row,index)=>row.addEventListener('click',()=>activateExpertise(index)));
  expStepper?.querySelector('[data-step-prev]')?.addEventListener('click',()=>activateExpertise(activeExpertise-1));
  expStepper?.querySelector('[data-step-next]')?.addEventListener('click',()=>activateExpertise(activeExpertise+1));
  activateExpertise(0);
  wheelNavigator(expertise,()=>activeExpertise,expRows.length,index=>activateExpertise(index));
  addSwipe(expStage,()=>activeExpertise,expRows.length,index=>activateExpertise(index));

  // Subtle pointer response in the Hero; purely decorative and disabled for touch/reduced motion.
  const hero=document.getElementById('intro');
  if(hero&&desktop()&&!reduce.matches){
    hero.addEventListener('pointermove',event=>{
      const rect=hero.getBoundingClientRect();
      hero.style.setProperty('--hero-pointer-x',String((event.clientX-rect.left)/Math.max(1,rect.width)-.5));
      hero.style.setProperty('--hero-pointer-y',String((event.clientY-rect.top)/Math.max(1,rect.height)-.5));
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{
      hero.style.setProperty('--hero-pointer-x','0');
      hero.style.setProperty('--hero-pointer-y','0');
    },{passive:true});
  }
})();
