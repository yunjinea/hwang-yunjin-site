const fs=require("fs"),path=require("path");

const ROOT=__dirname;
const CONTENT=path.join(ROOT,"content","posts");
const OUT=path.join(ROOT,"dist");

const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]||c));

function mdInline(s){
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`([^`]+)`/g,"<code>$1</code>");
}

function figureHtml(key){
  if(key==="FORECAST_FLOW")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 01</span><strong>판매에서 손익까지</strong></figcaption>
    <div class="figure-flow">
      <div><small>01</small><b>VOLUME</b><em>판매량 · 판매단가</em></div><i>→</i>
      <div><small>02</small><b>PRODUCTION</b><em>생산량 · 가동 수준</em></div><i>→</i>
      <div><small>03</small><b>INVENTORY</b><em>원재료 · 재공품 · 제품</em></div><i>→</i>
      <div><small>04</small><b>COST</b><em>재료비 · 가공비 · 매출원가</em></div><i>→</i>
      <div class="accent"><small>05</small><b>PROFIT</b><em>예상 영업이익</em></div>
    </div>
  </figure>`;
  if(key==="INVENTORY_FLOW")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 02</span><strong>Inventory Flow</strong></figcaption>
    <div class="figure-flow">
      <div><small>01</small><b>RAW MATERIAL</b><em>원재료</em></div><i>→</i>
      <div><small>02</small><b>WIP</b><em>재공품</em></div><i>→</i>
      <div><small>03</small><b>FINISHED GOODS</b><em>제품</em></div><i>→</i>
      <div><small>04</small><b>COGS</b><em>매출원가</em></div><i>→</i>
      <div class="accent"><small>05</small><b>PROFIT</b><em>손익</em></div>
    </div>
  </figure>`;
  if(key==="FORECAST_CYCLE")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 03</span><strong>Forecast Cycle</strong></figcaption>
    <div class="figure-flow cycle">
      <div><small>01</small><b>FORECAST</b><em>현재 정보로 미래 손익 추정</em></div><i>→</i>
      <div><small>02</small><b>ACTUAL</b><em>실제 결과 확인</em></div><i>→</i>
      <div><small>03</small><b>VARIANCE</b><em>차이와 원인 분석</em></div><i>→</i>
      <div class="accent"><small>04</small><b>NEXT FORECAST</b><em>새로운 정보와 가정 반영</em></div>
    </div>
  </figure>`;

  if(key==="PRICE_TO_PROFIT")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 01</span><strong>Price to Profit</strong></figcaption>
    <div class="figure-flow">
      <div><small>01</small><b>MARKET PRICE</b><em>원재료 시장가격</em></div><i>→</i>
      <div><small>02</small><b>PURCHASE</b><em>실제 매입단가</em></div><i>→</i>
      <div><small>03</small><b>RAW MATERIAL</b><em>원재료 재고</em></div><i>→</i>
      <div><small>04</small><b>WIP / FG</b><em>재공품 · 제품</em></div><i>→</i>
      <div class="accent"><small>05</small><b>COGS / PROFIT</b><em>매출원가 · 손익</em></div>
    </div>
  </figure>`;
  if(key==="MOVING_AVERAGE")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 02</span><strong>Moving Average Effect</strong></figcaption>
    <div class="ma-grid">
      <div><small>EXISTING</small><b>100 × 1,000원</b><em>100,000원</em></div><i>+</i>
      <div><small>NEW PURCHASE</small><b>100 × 1,200원</b><em>120,000원</em></div><i>→</i>
      <div class="accent"><small>MOVING AVG.</small><b>1,100원</b><em>매입단가 +20% / 평균단가 +10%</em></div>
    </div>
  </figure>`;
  if(key==="TIME_LAG")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 03</span><strong>Time Lag</strong></figcaption>
    <div class="figure-flow">
      <div><small>T0</small><b>MARKET</b><em>시장가격 상승</em></div><i>→</i>
      <div><small>T1</small><b>PURCHASE</b><em>높은 가격으로 매입</em></div><i>→</i>
      <div><small>T2</small><b>AVERAGE</b><em>평균단가 상승</em></div><i>→</i>
      <div><small>T3~T4</small><b>PRODUCTION</b><em>생산 · 제품화</em></div><i>→</i>
      <div class="accent"><small>T5~T6</small><b>COGS</b><em>판매 · 손익 반영</em></div>
    </div>
  </figure>`;
  if(key==="INVENTORY_DECISION")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 04</span><strong>Inventory Decision</strong></figcaption>
    <div class="decision-grid">
      <div><small>LOW INVENTORY</small><b>자본 효율성</b><p>낮은 운전자본<br>빠른 원가 반영<br>낮은 보관 부담</p><em>가격 상승 · 공급 차질에 민감</em></div>
      <span>VS.</span>
      <div class="accent"><small>HIGH INVENTORY</small><b>가격 · 공급 Buffer</b><p>가격 상승 완충<br>공급 안정성 확보<br>생산계획 안정</p><em>운전자본 · 고가재고 부담</em></div>
    </div>
  </figure>`;
  if(key==="DECISION_SUPPORT")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 05</span><strong>Decision Support</strong></figcaption>
    <div class="decision-stack">
      <div class="inputs"><span>PRICE OUTLOOK</span><span>INVENTORY POSITION</span><span>PURCHASE PLAN</span></div>
      <i>↓</i>
      <div class="scenarios"><span>SCENARIO A<br><b>LOW INVENTORY</b></span><em>VS.</em><span>SCENARIO B<br><b>STRATEGIC INVENTORY</b></span></div>
      <i>↓</i>
      <div class="outcome">P&amp;L + CASH FLOW + RISK → <b>DECISION</b></div>
    </div>
  </figure>`;

  if(key==="THREE_MONTH_VISIBILITY")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 02</span><strong>3개월 Forecast의 정보와 가정</strong></figcaption>
    <div class="visibility-grid">
      <div class="v-head"><span></span><b>M+1</b><b>M+2</b><b>M+3</b></div>
      <div class="v-row"><span>VISIBILITY</span><div class="vbar high"><i></i><em>HIGH</em></div><div class="vbar mid"><i></i><em>MID</em></div><div class="vbar low"><i></i><em>LOW</em></div></div>
      <div class="v-row"><span>ASSUMPTION</span><div class="vdots"><i></i></div><div class="vdots"><i></i><i></i></div><div class="vdots"><i></i><i></i><i></i></div></div>
      <p>시간이 갈수록 확정 정보보다 <b>가정의 비중</b>이 커진다.</p>
    </div>
  </figure>`;

  if(key==="FORECAST_PROFIT_BRIDGE")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 03</span><strong>Forecast Profit Bridge</strong></figcaption>
    <div class="profit-bridge">
      <div class="base" style="--h:70%"><span>100</span><i></i><b>PREVIOUS</b></div>
      <div class="negative" style="--h:58%"><span>−8</span><i></i><b>MATERIAL</b></div>
      <div class="negative" style="--h:49%"><span>−5</span><i></i><b>PRODUCTION</b></div>
      <div class="positive" style="--h:54%"><span>+3</span><i></i><b>PRICE</b></div>
      <div class="negative" style="--h:45%"><span>−5</span><i></i><b>VOLUME</b></div>
      <div class="base" style="--h:58%"><span>85</span><i></i><b>CURRENT</b></div>
    </div>
    <p class="figure-note">영업이익 추정치는 결과 숫자보다 <b>변화 이유를 설명할 수 있어야</b> 한다.</p>
  </figure>`;

  if(key==="FORECAST_DRIVER_MAP")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 04</span><strong>Follow the Driver</strong></figcaption>
    <div class="forecast-driver-map">
      <div class="fd-top"><span>VOLUME</span><span>PRICE</span></div>
      <i>↓</i><strong>SALES</strong><i>↓</i><strong>PRODUCTION</strong><i>↓</i>
      <div class="fd-split"><span>INVENTORY</span><span>COST</span></div>
      <i>↓</i><strong class="accent">P&amp;L</strong>
    </div>
  </figure>`;

  if(key==="FORECAST_INDEX_EXAMPLE")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 05</span><strong>Indexed Example · Current = 100</strong></figcaption>
    <div class="index-table-wrap">
      <table class="index-table">
        <thead><tr><th>INDEX</th><th>CURRENT</th><th>M+1</th><th>M+2</th><th>M+3</th></tr></thead>
        <tbody>
          <tr><th>SALES</th><td>100</td><td>103</td><td>107</td><td>110</td></tr>
          <tr><th>PRODUCTION</th><td>100</td><td>108</td><td>110</td><td>108</td></tr>
          <tr><th>INVENTORY</th><td>100</td><td>105</td><td>108</td><td>106</td></tr>
          <tr><th>MATERIAL COST</th><td>100</td><td>102</td><td>104</td><td>104</td></tr>
          <tr class="profit"><th>PROFIT</th><td>100</td><td>98</td><td>101</td><td>106</td></tr>
        </tbody>
      </table>
    </div>
    <p class="figure-note">ILLUSTRATIVE INDEX · NO CONFIDENTIAL COMPANY DATA</p>
  </figure>`;

  if(key==="UNIT_COST_EFFECT")return `
  <figure class="editorial-figure dark-figure">
    <figcaption><span>FIGURE 06</span><strong>Production Effect</strong></figcaption>
    <div class="unit-cost-grid">
      <div class="unit-card">
        <small>CASE A</small><span>고정성 제조비 <b>1,000</b></span><span>생산량 <b>100</b></span>
        <strong>UNIT FIXED COST <em>10.0</em></strong>
      </div>
      <i>→</i>
      <div class="unit-card accent">
        <small>CASE B</small><span>고정성 제조비 <b>1,000</b></span><span>생산량 <b>110</b></span>
        <strong>UNIT FIXED COST <em>9.1</em></strong>
      </div>
    </div>
    <div class="effect-grid">
      <div><small>UPWARD PRESSURE</small><b>원재료 · 변동비 ↑</b><span>총비용 상승 압력</span></div>
      <em>PRODUCTION ↑</em>
      <div class="accent"><small>DOWNWARD PRESSURE</small><b>고정비 분산</b><span>단위당 원가 하락</span></div>
    </div>
  </figure>`;

  if(key==="M1_PROFIT_DRIVERS")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 07</span><strong>M+1 Profit Drivers</strong></figcaption>
    <div class="profit-driver-grid">
      <div class="plus"><b>+</b><span>매출 증가</span></div>
      <div class="plus"><b>+</b><span>생산 증가에 따른 단위 고정비 감소</span></div>
      <div class="minus"><b>−</b><span>원재료 가격 상승</span></div>
      <div class="minus"><b>−</b><span>추가 근무 · 외주비 증가</span></div>
    </div>
    <div class="driver-result"><span>NEGATIVE IMPACT &gt; POSITIVE IMPACT</span><b>PROFIT 100 → 98</b></div>
  </figure>`;

  if(key==="THREE_MONTH_VIEW")return `
  <figure class="editorial-figure">
    <figcaption><span>FIGURE 08</span><strong>Three-Month View</strong></figcaption>
    <div class="three-month-view">
      <div class="tm-row head"><span></span><b>M+1</b><b>M+2</b><b>M+3</b></div>
      <div class="tm-row"><span>SALES</span><b>103</b><b>107</b><b>110</b></div>
      <div class="tm-row"><span>PRODUCTION</span><b>108</b><b>110</b><b>108</b></div>
      <div class="tm-row"><span>INVENTORY</span><b>105</b><b>108</b><b>106</b></div>
      <div class="tm-row muted"><span>MATERIAL</span><b>상승</b><b>높은 수준</b><b>안정</b></div>
      <div class="tm-row profit"><span>PROFIT</span><b>98</b><b>101</b><b>106</b></div>
      <div class="tm-story"><span>원가 부담<br><em>단기 하락</em></span><i>→</i><span>판매 증가 + 생산효율<br><em>회복 시작</em></span><i>→</i><span>판매 · 재고 효과<br><em>이익 개선</em></span></div>
    </div>
  </figure>`;

  return "";
}

function mdRender(src){
  const lines=String(src||"").split(/\r?\n/);
  let out=[],list=false;
  const end=()=>{if(list){out.push("</ul>");list=false}};
  for(const line of lines){
    const fig=line.trim().match(/^\[\[FIGURE:([A-Z_]+)\]\]$/);
    if(fig){end();out.push(figureHtml(fig[1]));continue}
    if(/^### /.test(line)){end();out.push(`<h3>${mdInline(line.slice(4))}</h3>`)}
    else if(/^## /.test(line)){end();out.push(`<h2>${mdInline(line.slice(3))}</h2>`)}
    else if(/^# /.test(line)){end();out.push(`<h1>${mdInline(line.slice(2))}</h1>`)}
    else if(/^- /.test(line)){if(!list){out.push("<ul>");list=true}out.push(`<li>${mdInline(line.slice(2))}</li>`)}
    else if(/^> /.test(line)){end();out.push(`<blockquote><p>${mdInline(line.slice(2))}</p></blockquote>`)}
    else if(/^---+$/.test(line.trim())){end();out.push("<hr>")}
    else if(!line.trim()){end()}
    else{end();out.push(`<p>${mdInline(line)}</p>`)}
  }
  end();
  return out.join("\n");
}

function cp(s,d){
  if(!fs.existsSync(s))return;
  fs.mkdirSync(d,{recursive:true});
  for(const e of fs.readdirSync(s,{withFileTypes:true})){
    const a=path.join(s,e.name),b=path.join(d,e.name);
    e.isDirectory()?cp(a,b):fs.copyFileSync(a,b);
  }
}

function fm(t){
  const m=t.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if(!m)return{data:{},body:t};
  const data={};
  for(const l of m[1].split(/\r?\n/)){
    const i=l.indexOf(":"); if(i<0)continue;
    let k=l.slice(0,i).trim(),v=l.slice(i+1).trim();
    if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);
    if(v==="true")v=true;if(v==="false")v=false;data[k]=v;
  }
  return{data,body:m[2]};
}

function page(p){
  const cat={work:"WORK",investing:"INVESTING",life:"LIFE"}[p.category]||"WRITING";
  const categoryLabel=p.category_label||p.label||cat;
  const lead=p.excerpt||p.summary||"";
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)} · AFTER THE NUMBERS</title>
<meta name="description" content="${esc(lead)}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(lead)}">
<meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300;400;500;600&family=Instrument+Sans:wdth,wght@75..100,400..700&family=Newsreader:opsz,wght@6..72,300..600&display=swap" rel="stylesheet">
<style>
:root{--paper:#f4f0e7;--ink:#071120;--navy:#061a35;--blue:#1a57a8;--muted:#6c6b67;--line:rgba(7,17,32,.16);--serif:"Newsreader",serif;--sans:"Instrument Sans",sans-serif;--kr:"IBM Plex Sans KR",sans-serif}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--kr);-webkit-font-smoothing:antialiased}.reading-progress{position:fixed;z-index:20;left:0;top:0;height:2px;width:0;background:var(--blue)}a{color:inherit}.article-shell{max-width:1180px;margin:auto;padding:34px 34px 120px}.post-nav{display:flex;justify-content:space-between;align-items:center;padding:0 0 22px;border-bottom:1px solid var(--line);font-family:var(--sans);font-size:10px;font-weight:650;letter-spacing:.12em}.post-nav a{text-decoration:none}.post-nav span{color:var(--muted)}
.article-hero{display:grid;grid-template-columns:180px minmax(0,1fr);gap:70px;padding:94px 0 72px;border-bottom:1px solid var(--line)}.hero-index{display:flex;flex-direction:column;justify-content:space-between;min-height:360px}.hero-index strong{font:300 88px/.8 var(--serif);letter-spacing:-.05em;color:var(--navy)}.hero-index div{font:650 9px/1.6 var(--sans);letter-spacing:.13em;color:var(--blue)}.hero-copy h1{max-width:900px;margin:0;font-size:clamp(48px,7.2vw,90px);line-height:1.07;letter-spacing:-.065em;font-weight:500;word-break:keep-all}.kicker{display:block;margin-bottom:26px;font:700 10px var(--sans);letter-spacing:.14em;color:var(--blue)}.dek{max-width:760px;margin:40px 0 0;font-size:20px;line-height:1.9;letter-spacing:-.025em;color:#3e4144;word-break:keep-all}.meta{display:flex;gap:24px;margin-top:38px;font:500 9px var(--sans);letter-spacing:.11em;color:var(--muted)}
.article-layout{display:grid;grid-template-columns:180px minmax(0,760px);gap:70px;padding-top:62px}.article-aside{font:500 9px/1.8 var(--sans);letter-spacing:.1em;color:var(--muted)}.article-aside-inner{position:sticky;top:42px}.article-aside b{display:block;margin-bottom:20px;color:var(--navy);font-size:10px}.article-aside p{margin:0 0 26px}.article-body{font-size:17px;line-height:2.02;letter-spacing:-.018em;word-break:keep-all}.article-body>h1{display:none}.article-body>p{margin:0 0 31px}.article-body>p:first-of-type::first-letter{float:left;margin:10px 11px 0 0;font:400 74px/.72 var(--serif);color:var(--navy)}.article-body h2{margin:104px 0 32px;padding-top:22px;border-top:1px solid var(--line);font-size:31px;line-height:1.45;letter-spacing:-.045em;font-weight:550}.article-body h3{margin:60px 0 22px;font-size:21px;line-height:1.5}.article-body strong{font-weight:600}.article-body ul{margin:24px 0 34px;padding-left:21px}.article-body li{margin:8px 0}.article-body hr{border:0;border-top:1px solid var(--line);margin:72px 0}
.article-body blockquote{width:min(900px,calc(100vw - 48px));margin:84px 0 84px 50%;transform:translateX(-50%);padding:50px 4vw;border-top:1px solid var(--navy);border-bottom:1px solid var(--navy);text-align:center}.article-body blockquote p{max-width:800px;margin:auto;font-size:clamp(25px,3.1vw,40px);line-height:1.55;letter-spacing:-.04em;color:var(--navy)}
.editorial-figure{width:min(1040px,calc(100vw - 48px));margin:84px 0 92px 50%;transform:translateX(-50%);padding:30px 0 34px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.editorial-figure figcaption{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:34px;font-family:var(--sans)}.editorial-figure figcaption span{font-size:9px;font-weight:700;letter-spacing:.14em;color:var(--blue)}.editorial-figure figcaption strong{font-size:13px}.figure-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:12px}.figure-flow.cycle{grid-template-columns:1fr auto 1fr auto 1fr auto 1.15fr}.figure-flow>div{min-height:126px;padding:22px 18px;border:1px solid var(--line);display:flex;flex-direction:column;justify-content:space-between}.figure-flow>div.accent{background:var(--navy);border-color:var(--navy);color:#fff}.editorial-figure small{font:500 9px var(--sans);letter-spacing:.1em;color:var(--blue)}.editorial-figure .accent small{color:#8eb9ef}.editorial-figure b{font:700 11px var(--sans);letter-spacing:.06em}.editorial-figure em{font-style:normal;font-size:11px;line-height:1.45;color:var(--muted)}.editorial-figure .accent em{color:rgba(255,255,255,.72)}.editorial-figure i{font-style:normal;color:var(--blue);font-size:18px}.ma-grid{display:grid;grid-template-columns:1fr auto 1fr auto 1.2fr;align-items:center;gap:12px}.ma-grid>div{min-height:126px;padding:22px 18px;border:1px solid var(--line);display:flex;flex-direction:column;justify-content:space-between}.ma-grid>div.accent{background:var(--navy);border-color:var(--navy);color:#fff}.decision-grid{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px}.decision-grid>div{padding:28px;border:1px solid var(--line);min-height:230px}.decision-grid>div.accent{background:var(--navy);border-color:var(--navy);color:#fff}.decision-grid>span{font:650 11px var(--sans);color:var(--blue)}.decision-grid p{font-size:14px;line-height:1.8}.decision-grid em{display:block;margin-top:22px}.decision-stack{text-align:center}.inputs,.scenarios{display:flex;justify-content:center;gap:12px}.inputs span,.scenarios span,.outcome{padding:18px 22px;border:1px solid var(--line);font:600 10px/1.6 var(--sans);letter-spacing:.04em}.decision-stack>i{display:block;margin:14px}.scenarios em{align-self:center}.outcome{display:inline-block;background:var(--navy);color:#fff;border-color:var(--navy)}
.article-footer{display:grid;grid-template-columns:180px minmax(0,760px);gap:70px;margin-top:106px;padding-top:30px;border-top:1px solid var(--line)}.article-footer small{font:500 9px var(--sans);letter-spacing:.1em;color:var(--muted)}.back{text-decoration:none;font:700 10px var(--sans);letter-spacing:.11em}

.visibility-grid{font-family:var(--sans)}.v-head,.v-row{display:grid;grid-template-columns:120px repeat(3,1fr);gap:12px;align-items:center;margin:12px 0}.v-head b{font-size:10px}.v-row>span{font:700 8px var(--sans);letter-spacing:.08em;color:var(--muted)}.vbar{height:38px;background:rgba(7,17,32,.06);position:relative;overflow:hidden}.vbar i{display:block;height:100%;background:var(--navy)}.vbar.high i{width:88%}.vbar.mid i{width:58%}.vbar.low i{width:31%}.vbar em{position:absolute;left:8px;top:12px;color:#fff;font:700 7px var(--sans);letter-spacing:.08em}.vdots{display:flex;gap:6px}.vdots i{width:8px;height:8px;border-radius:50%;background:var(--blue)}.visibility-grid>p{margin:24px 0 0;font-size:12px;color:var(--muted)}
.profit-bridge{height:250px;display:grid;grid-template-columns:repeat(6,1fr);gap:13px;align-items:end;border-bottom:1px solid var(--line);padding:0 5px}.profit-bridge>div{height:100%;position:relative;display:flex;align-items:flex-end;justify-content:center}.profit-bridge i{display:block;width:100%;height:var(--h);background:rgba(26,87,168,.13);border-top:2px solid var(--blue)}.profit-bridge .base i{background:var(--navy);border:0}.profit-bridge .negative i{background:rgba(7,17,32,.08);border-color:var(--ink)}.profit-bridge span{position:absolute;bottom:calc(var(--h) + 9px);font:400 23px/1 var(--serif)}.profit-bridge b{position:absolute;bottom:-24px;font:700 6px/1 var(--sans);letter-spacing:.05em;text-align:center}.figure-note{margin:40px 0 0!important;font-size:11px!important;line-height:1.6!important;color:var(--muted)}
.forecast-driver-map{display:flex;flex-direction:column;align-items:center;gap:10px}.fd-top,.fd-split{display:grid;grid-template-columns:1fr 1fr;gap:70px;text-align:center}.forecast-driver-map span,.forecast-driver-map strong{font:700 9px/1 var(--sans);letter-spacing:.08em}.forecast-driver-map strong{padding:13px 25px;border:1px solid var(--line)}.forecast-driver-map strong.accent{background:var(--navy);color:#fff;border-color:var(--navy)}.forecast-driver-map>i{font-style:normal;color:var(--blue)}
.index-table-wrap{overflow-x:auto}.index-table{width:100%;min-width:590px;border-collapse:collapse;font-family:var(--sans)}.index-table th,.index-table td{padding:14px 12px;border-bottom:1px solid var(--line);text-align:right;font-size:11px}.index-table th:first-child{text-align:left}.index-table thead th{font-size:8px;letter-spacing:.08em;color:var(--muted)}.index-table tr.profit{background:var(--navy);color:#fff}
.dark-figure{background:var(--navy);color:#fff;padding:34px!important;border:0!important}.dark-figure figcaption{border-bottom:1px solid rgba(255,255,255,.16);padding-bottom:20px}.dark-figure figcaption span{color:#8eb9ef}.unit-cost-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:center;margin:8px 0 32px}.unit-card{display:grid;gap:8px;padding:24px;border:1px solid rgba(255,255,255,.2)}.unit-card.accent{border-color:#8eb9ef}.unit-card small{color:#8eb9ef!important}.unit-card span{font-size:11px;color:rgba(255,255,255,.7)}.unit-card strong{border-top:1px solid rgba(255,255,255,.18);margin-top:8px;padding-top:14px;font:700 8px var(--sans);letter-spacing:.05em}.unit-card strong em{float:right;color:#fff;font:400 26px/1 var(--serif);font-style:normal}.unit-cost-grid>i{font-style:normal;color:#8eb9ef}.effect-grid{display:grid;grid-template-columns:1fr 130px 1fr;gap:16px;align-items:stretch}.effect-grid>div{padding:22px;border:1px solid rgba(255,255,255,.18)}.effect-grid small{color:#8eb9ef!important}.effect-grid b{display:block;margin:10px 0 4px}.effect-grid span{font-size:10px;color:rgba(255,255,255,.58)}.effect-grid>em{display:flex;align-items:center;justify-content:center;text-align:center;color:#8eb9ef;font:700 8px var(--sans);letter-spacing:.08em;font-style:normal}
.profit-driver-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.profit-driver-grid>div{display:flex;align-items:center;gap:10px;padding:16px;border:1px solid var(--line);font-size:12px}.profit-driver-grid b{font-size:18px;color:var(--blue)}.profit-driver-grid .minus b{color:var(--ink)}.driver-result{display:flex;justify-content:space-between;gap:20px;margin-top:22px;padding-top:19px;border-top:1px solid var(--line);font:700 8px/1.5 var(--sans);letter-spacing:.07em}.driver-result b{color:var(--blue)}
.three-month-view{font-family:var(--sans)}.tm-row{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:8px;padding:12px 0;border-bottom:1px solid rgba(7,17,32,.08)}.tm-row span{font:700 8px var(--sans);letter-spacing:.08em;color:var(--muted)}.tm-row b{text-align:center;font-size:10px}.tm-row.profit{margin-top:8px;padding:14px 10px;background:var(--navy);color:#fff}.tm-row.profit span{color:#9bb9df}.tm-row.profit b{font-size:17px}.tm-row.muted b{font-family:var(--kr);font-weight:500;color:var(--muted)}.tm-story{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:center;text-align:center;margin-top:24px;font-size:9px;line-height:1.5;color:var(--muted)}.tm-story i{font-style:normal;color:var(--blue)}.tm-story em{font-style:normal;color:var(--ink)}
@media(max-width:800px){.article-shell{padding:26px 22px 82px}.article-hero{display:block;padding:62px 0 48px}.hero-index{min-height:auto;flex-direction:row;align-items:center;margin-bottom:42px}.hero-index strong{font-size:54px}.hero-copy h1{font-size:clamp(42px,13.2vw,61px);line-height:1.1}.dek{margin-top:28px;font-size:17px;line-height:1.85}.meta{margin-top:27px;gap:14px;flex-wrap:wrap}.article-layout{display:block;padding-top:42px}.article-aside{display:none}.article-body{font-size:16px;line-height:1.95}.article-body h2{margin-top:78px;font-size:26px}.article-body blockquote{margin-top:64px;margin-bottom:64px;padding:36px 18px}.editorial-figure{margin-top:62px;margin-bottom:70px;padding:24px 0 28px}.editorial-figure figcaption{margin-bottom:26px}.figure-flow,.figure-flow.cycle,.ma-grid,.decision-grid{display:flex;flex-direction:column;align-items:stretch;gap:8px}.figure-flow>i,.ma-grid>i,.unit-cost-grid>i,.tm-story>i{transform:rotate(90deg);align-self:center}.figure-flow>div,.ma-grid>div{min-height:96px}.decision-grid>span{align-self:center}.inputs,.scenarios{flex-direction:column}.scenarios em{align-self:center}.article-footer{display:block;margin-top:76px}.article-footer small{display:none}
.v-head,.v-row{grid-template-columns:72px repeat(3,1fr);gap:5px}.vbar i,.vdots i,.profit-bridge i,.forecast-driver-map>i{transform:none!important}.index-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}.vbar em{font-size:5px;left:4px}
.profit-bridge{height:190px;gap:4px}.profit-bridge span{font-size:17px}.profit-bridge b{font-size:5.5px;transform:rotate(-42deg);transform-origin:left top;white-space:nowrap}
.fd-top,.fd-split{gap:26px}
.dark-figure{padding:26px 18px!important}.unit-cost-grid,.effect-grid{grid-template-columns:1fr}.unit-cost-grid>i{text-align:center;transform:rotate(90deg)}.effect-grid>em{padding:6px}
.profit-driver-grid{grid-template-columns:1fr}.driver-result{display:block}.driver-result b{display:block;margin-top:6px}
.tm-story{grid-template-columns:1fr;gap:5px}.tm-story i{transform:rotate(90deg)}
}
</style>
</head>
<body>
<div class="reading-progress" id="reading-progress"></div>
<main class="article-shell">
<nav class="post-nav"><a href="/">AFTER THE NUMBERS</a><span>WRITING / ${cat}</span></nav>
<header class="article-hero">
  <aside class="hero-index"><strong>${esc(p.article_index||"01")}</strong><div>WRITING<br>${cat}</div></aside>
  <div class="hero-copy"><span class="kicker">${esc(categoryLabel)}</span><h1>${esc(p.title)}</h1><p class="dek">${esc(lead)}</p><div class="meta"><span>${esc(p.date)}</span><span>${esc(p.read_time||"")}</span><span>${cat}</span></div></div>
</header>
<section class="article-layout">
  <aside class="article-aside"><div class="article-aside-inner"><b>EDITORIAL NOTE</b><p>업무에서 경험하고 배운 내용을 공개 가능한 범위에서 정리합니다.</p><p>NO CONFIDENTIAL COMPANY DATA</p></div></aside>
  <article class="article-body">${mdRender(p.body)}</article>
</section>
<footer class="article-footer"><small>AFTER THE NUMBERS / WRITING</small><a class="back" href="/#writing">← BACK TO WRITING</a></footer>
</main>
<script>const bar=document.getElementById("reading-progress");function progress(){const d=document.documentElement,max=d.scrollHeight-innerHeight;bar.style.width=(max>0?Math.min(100,scrollY/max*100):0)+"%"}addEventListener("scroll",progress,{passive:true});progress();</script>
</body></html>`;
}

if(fs.existsSync(OUT))fs.rmSync(OUT,{recursive:true,force:true});
fs.mkdirSync(OUT,{recursive:true});
for(const f of ["index.html","styles.css","script.js"])fs.copyFileSync(path.join(ROOT,f),path.join(OUT,f));
cp(path.join(ROOT,"admin"),path.join(OUT,"admin"));
cp(path.join(ROOT,"uploads"),path.join(OUT,"uploads"));

const posts=[];
for(const file of fs.readdirSync(CONTENT).filter(x=>x.endsWith(".md"))){
  const {data,body}=fm(fs.readFileSync(path.join(CONTENT,file),"utf8"));
  if(data.draft===true)continue;
  const slug=file.replace(/\.md$/,"").replace(/^\d{4}-\d{2}-\d{2}-/,"");
  const p={...data,body,slug,url:`/writing/${slug}/`};
  posts.push(p);
  const d=path.join(OUT,"writing",slug);
  fs.mkdirSync(d,{recursive:true});
  fs.writeFileSync(path.join(d,"index.html"),page(p));
}
posts.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
fs.mkdirSync(path.join(OUT,"writing"),{recursive:true});
fs.writeFileSync(path.join(OUT,"writing","index.json"),JSON.stringify(posts.map(({body,...p})=>p),null,2));

const base="https://ubiquitous-pothos-a92d14.netlify.app";
fs.writeFileSync(path.join(OUT,"robots.txt"),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[base+"/",...posts.map(p=>base+p.url)].map(u=>`<url><loc>${u}</loc></url>`).join("")}</urlset>`);
console.log(`Built ${posts.length} posts`);
