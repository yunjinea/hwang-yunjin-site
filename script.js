
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
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
qsa('.topnav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

// Career scrollytelling — current role intentionally receives the longest dwell time.
const careerSection=qs('#career');
const careerRoles=qsa('[data-career-role]');
const careerYears=qsa('[data-career-year]');
const careerBar=qs('#career-progress-bar');
let careerIndex=-1;
function careerStepFromProgress(p){if(p<.40)return 0;if(p<.65)return 1;if(p<.85)return 2;return 3}
function updateCareer(){
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
  forecastSteps.forEach((el,j)=>el.classList.toggle('active',i===j));
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
function setExpertise(i){const d=expertiseData[i];expNum.textContent=d.num;expTitle.innerHTML=d.title;expList.innerHTML=d.items.map(x=>`<li>${x}</li>`).join('');expRows.forEach((r,j)=>r.classList.toggle('active',i===j))}
expRows.forEach((r,i)=>{r.addEventListener('mouseenter',()=>setExpertise(i));r.addEventListener('focus',()=>setExpertise(i));r.addEventListener('click',()=>setExpertise(i))});

// Contact placeholder.
const dialog=qs('#contact-dialog');
qs('#contact-button').addEventListener('click',()=>dialog.showModal());
qs('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',(e)=>{if(e.target===dialog)dialog.close()});


// B3.3.1 — Mobile scroll motion.
// Desktop keeps hover/in-view behavior. Mobile gets explicit scroll-driven states.
const mobileCaseMQ=window.matchMedia('(max-width:760px)');
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
const desktopStoryMQ=window.matchMedia('(min-width:761px)');
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

if(!reduceMotionMQ.matches){
  setInterval(()=>{
    const hr=qs('#intro')?.getBoundingClientRect();
    if(!hr || hr.bottom<0 || hr.top>innerHeight || heroMorphRunning)return;
    heroSeriesIndex=(heroSeriesIndex+1)%heroSeries.length;
    morphHeroSeries(heroSeries[heroSeriesIndex],1750);
  },2350);

  let verbIndex=2;
  setInterval(()=>{
    const hr=qs('#intro')?.getBoundingClientRect();
    if(!hr || hr.bottom<0 || hr.top>innerHeight)return;
    verbIndex=(verbIndex+1)%heroVerbs.length;
    heroVerbs.forEach((v,i)=>v.classList.toggle('active',i===verbIndex));
  },1900);
}



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
// B3.4.2 — WRITING TOPIC SELECTOR
// WORK / INVESTING / LIFE
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

const writingData={
  work:{
    title:'WORK',
    kicker:'WORK NOTES',
    description:'업무에서 배운 분석과 의사결정을 기록합니다.',
    quote:'숫자 뒤에 있는 사업을 이해합니다.<br>더 나은 결정을 만들기 위해 오늘도 데이터를 봅니다.',
    posts:[
      {category:'BUSINESS ANALYSIS',title:'손익 Forecast는 왜 실제와 달라지는가',time:'8 MIN READ',preview:'work'},
      {category:'MANAGEMENT ACCOUNTING',title:'재고 변화가 손익에 미치는 영향',time:'6 MIN READ',preview:'work'},
      {category:'BUSINESS PLANNING',title:'사업계획에서 목표손익을 만드는 과정',time:'7 MIN READ',preview:'work'}
    ]
  },
  investing:{
    title:'INVESTING',
    kicker:'INVESTMENT NOTES',
    description:'시장과 기업을 보며 생각한 투자 기준과 관점을 기록합니다.',
    quote:'가격의 움직임보다 기업의 변화와 숫자의 방향을 먼저 보려고 합니다.',
    posts:[
      {category:'COMPANY ANALYSIS',title:'기업 실적을 볼 때 먼저 확인하는 숫자',time:'7 MIN READ',preview:'invest'},
      {category:'LONG-TERM INVESTING',title:'장기 투자에서 변동성을 어떻게 바라볼 것인가',time:'6 MIN READ',preview:'invest'},
      {category:'PORTFOLIO',title:'적립식 투자에서 수익률보다 먼저 생각하는 것',time:'5 MIN READ',preview:'invest'}
    ]
  },
  life:{
    title:'LIFE',
    kicker:'PERSONAL NOTES',
    description:'일과 가족, 공부 사이의 평범한 순간과 생각을 기록합니다.',
    quote:'거창한 계획보다 꾸준히 남긴 기록이 결국 삶의 방향을 보여준다고 생각합니다.',
    posts:[
      {category:'LEARNING',title:'직장인이 다시 공부를 시작하면서',time:'5 MIN READ',preview:'life'},
      {category:'DAILY LIFE',title:'일과 가족 사이에서 나만의 시간을 만드는 방법',time:'4 MIN READ',preview:'life'},
      {category:'MONTHLY NOTE',title:'한 달을 기록하고 다시 설계하는 습관',time:'4 MIN READ',preview:'life'}
    ]
  }
};

function writingPreview(type,index){
  if(type==='work'){
    return `<span class="post-preview preview-work" aria-hidden="true">
      <i></i><i></i><i></i><i></i>
    </span>`;
  }
  if(type==='invest'){
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
    <b>${String(index+1).padStart(2,'0')}</b><small>NOTE / 52</small>
  </span>`;
}

let activeWritingTopic='work';
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
    if(active && focus)btn.focus({preventScroll:true});
  });

  writingPanel.classList.add('switching');
  if(writingDescription)writingDescription.style.opacity='.25';
  if(writingQuote)writingQuote.style.opacity='.25';

  clearTimeout(writingSwitchTimer);
  writingSwitchTimer=setTimeout(()=>{
    writingTitle.textContent=d.title;
    writingKicker.textContent=d.kicker;
    writingCount.textContent=`${String(d.posts.length).padStart(2,'0')} STORIES`;
    writingDescription.textContent=d.description;
    writingQuote.innerHTML=d.quote;

    writingPostList.innerHTML=d.posts.length ? d.posts.map((post,i)=>`
      <a class="post-row" style="--row-index:${i}" href="${post.url}">
        <span class="post-num nowrap">${String(i+1).padStart(2,'0')}</span>
        <div>
          <small>${post.category}</small>
          <h3>${post.title}</h3>
        </div>
        <span class="read-time nowrap">${post.time}</span>
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

renderWritingTopic('work');

function normalizePublishedPost(p){return{category:p.category_label||({work:'WORK',investing:'INVESTING',life:'LIFE'}[p.category]||'WRITING'),title:p.title,time:p.read_time||'',preview:p.category==='investing'?'invest':p.category==='life'?'life':'work',url:p.url,excerpt:p.excerpt||''}}
async function loadPublishedWriting(){try{const r=await fetch('/writing/index.json',{cache:'no-store'});if(!r.ok)return;const posts=await r.json();['work','investing','life'].forEach(k=>{const f=posts.filter(p=>p.category===k).map(normalizePublishedPost);writingData[k].posts=f});renderWritingTopic(activeWritingTopic)}catch(e){console.warn('Writing index fallback',e)}}
loadPublishedWriting();
