---
title: "제조업 3개월 Rolling Forecast는 어떻게 만들어지는가"
date: "2026-08-30T16:35:00+09:00"
category: "work"
label: "SEE / 01 · FORECASTING"
read_time: "9 MIN READ"
summary: "판매에서 손익까지. 앞으로 3개월의 숫자가 만들어지는 과정을 따라갑니다."
draft: false
featured_image: ""
---

<style>
.atn-magazine{
  --atn-cream:#f4f0e7;
  --atn-paper:#faf7f0;
  --atn-ink:#071120;
  --atn-navy:#10243d;
  --atn-blue:#1a57a8;
  --atn-muted:#72756f;
  --atn-line:rgba(7,17,32,.14);
  --atn-blue-soft:rgba(26,87,168,.09);
  color:var(--atn-ink);
  font-family:"IBM Plex Sans KR","Noto Sans KR",sans-serif;
  word-break:keep-all;
}
.atn-magazine *{box-sizing:border-box}
.atn-magazine .en{font-family:"Instrument Sans",Arial,sans-serif}
.atn-magazine .serif{font-family:"Newsreader",Georgia,serif}
.atn-magazine .atn-intro{
  padding:26px 0 68px;
  border-bottom:1px solid var(--atn-line);
}
.atn-magazine .atn-eyebrow{
  display:flex;gap:10px;align-items:center;
  margin-bottom:28px;
  color:var(--atn-blue);
  font:700 10px/1.2 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.14em;
}
.atn-magazine .atn-eyebrow i{width:28px;height:1px;background:var(--atn-blue);display:block}
.atn-magazine .atn-lead{
  max-width:760px;
  margin:0 0 26px;
  font-size:18px;
  line-height:1.9;
}
.atn-magazine .atn-question{
  margin:46px 0;
  padding:32px 0;
  border-top:1px solid var(--atn-line);
  border-bottom:1px solid var(--atn-line);
  font:400 38px/1.25 "Newsreader",Georgia,serif;
  letter-spacing:-.03em;
  color:var(--atn-navy);
}
.atn-magazine p{
  margin:0 0 25px;
  font-size:16px;
  line-height:1.95;
}
.atn-magazine strong{font-weight:600}
.atn-magazine .atn-highlight{
  margin:44px 0 0;
  font:400 29px/1.45 "Newsreader",Georgia,serif;
  letter-spacing:-.02em;
  color:var(--atn-navy);
}
.atn-magazine .atn-section{
  padding:92px 0;
  border-bottom:1px solid var(--atn-line);
}
.atn-magazine .atn-section-head{
  display:grid;
  grid-template-columns:170px minmax(0,1fr);
  gap:24px;
  margin-bottom:46px;
  align-items:start;
}
.atn-magazine .atn-section-head small{
  padding-top:8px;
  color:var(--atn-blue);
  font:700 9px/1.35 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.14em;
}
.atn-magazine .atn-section-head h2{
  margin:0;
  color:var(--atn-navy);
  font:400 46px/1.08 "Newsreader",Georgia,serif;
  letter-spacing:-.04em;
}
.atn-magazine .atn-figure{
  margin:48px 0;
  padding:30px;
  border:1px solid var(--atn-line);
  background:rgba(250,247,240,.58);
}
.atn-magazine .atn-cap{
  margin-bottom:22px;
  color:var(--atn-muted);
  font:700 8px/1.2 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.14em;
}
.atn-magazine .flow{
  display:grid;
  grid-template-columns:repeat(5,1fr);
}
.atn-magazine .flow .node{
  position:relative;
  min-width:0;
  padding:18px 14px;
  border-right:1px solid var(--atn-line);
}
.atn-magazine .flow .node:last-child{
  border-right:0;
  background:var(--atn-blue-soft);
}
.atn-magazine .flow .node:not(:last-child)::after{
  content:"→";
  position:absolute;
  right:-7px;top:50%;
  transform:translateY(-50%);
  z-index:2;
  color:var(--atn-blue);
  font-size:12px;
}
.atn-magazine .flow small{
  display:block;margin-bottom:15px;
  color:var(--atn-muted);
  font:600 8px/1 "Instrument Sans",Arial,sans-serif;
}
.atn-magazine .flow b{
  display:block;
  font:700 11px/1.2 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.05em;
}
.atn-magazine .flow span{
  display:block;margin-top:5px;
  color:var(--atn-muted);
  font-size:11px;
}
.atn-magazine .horizon{
  display:grid;
  grid-template-columns:110px repeat(3,1fr);
  gap:12px;
  align-items:center;
}
.atn-magazine .horizon .label{
  color:var(--atn-muted);
  font:700 8px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.08em;
}
.atn-magazine .horizon .month{
  font:700 10px/1 "Instrument Sans",Arial,sans-serif;
}
.atn-magazine .bar{
  height:38px;
  background:rgba(7,17,32,.06);
  position:relative;overflow:hidden;
}
.atn-magazine .bar i{
  display:block;height:100%;background:var(--atn-navy);
}
.atn-magazine .bar.high i{width:88%}
.atn-magazine .bar.mid i{width:58%}
.atn-magazine .bar.low i{width:31%}
.atn-magazine .bar em{
  position:absolute;left:8px;top:11px;
  color:#fff;font:700 7px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.08em;font-style:normal;
}
.atn-magazine .dots{display:flex;gap:6px}
.atn-magazine .dots i{
  width:8px;height:8px;border-radius:50%;background:var(--atn-blue)
}
.atn-magazine .two-note{
  display:grid;grid-template-columns:1fr 1fr;
  margin:42px 0;
  border-top:1px solid var(--atn-line);
  border-bottom:1px solid var(--atn-line);
}
.atn-magazine .two-note>div{padding:24px 24px 24px 0}
.atn-magazine .two-note>div+div{padding-left:24px;border-left:1px solid var(--atn-line)}
.atn-magazine .two-note small{
  color:var(--atn-blue);
  font:700 8px/1 "Instrument Sans",Arial,sans-serif;
}
.atn-magazine .two-note p{margin:10px 0 0;font-size:13px;line-height:1.7}
.atn-magazine .big-question{
  margin:40px 0 35px;
  font:400 39px/1.2 "Newsreader",Georgia,serif;
  color:var(--atn-navy);
  letter-spacing:-.025em;
}
.atn-magazine .bridge{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:12px;
  height:245px;
  align-items:end;
  border-bottom:1px solid var(--atn-line);
}
.atn-magazine .bridge>div{
  height:100%;position:relative;
  display:flex;align-items:flex-end;justify-content:center;
}
.atn-magazine .bridge i{
  display:block;width:100%;height:var(--h);
  background:rgba(26,87,168,.13);
  border-top:2px solid var(--atn-blue);
}
.atn-magazine .bridge .base i{background:var(--atn-navy);border:0}
.atn-magazine .bridge .neg i{background:rgba(7,17,32,.08);border-color:var(--atn-ink)}
.atn-magazine .bridge span{
  position:absolute;bottom:calc(var(--h) + 10px);
  font:400 23px/1 "Newsreader",Georgia,serif;
}
.atn-magazine .bridge b{
  position:absolute;bottom:-23px;
  font:700 6.5px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.05em;text-align:center;
}
.atn-magazine .driver-map{
  display:flex;flex-direction:column;align-items:center;gap:10px
}
.atn-magazine .driver-map .row{
  display:grid;grid-template-columns:1fr 1fr;gap:70px;text-align:center
}
.atn-magazine .driver-map span,
.atn-magazine .driver-map strong{
  font:700 9px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.08em;
}
.atn-magazine .driver-map strong{
  padding:12px 24px;border:1px solid var(--atn-line)
}
.atn-magazine .driver-map strong.final{background:var(--atn-navy);color:#fff}
.atn-magazine .driver-map>i{font-style:normal;color:var(--atn-blue)}
.atn-magazine .index-wrap{overflow-x:auto;margin:46px 0}
.atn-magazine table{
  width:100%;min-width:590px;border-collapse:collapse;
  border-top:2px solid var(--atn-ink);
}
.atn-magazine th,.atn-magazine td{
  padding:14px 12px;border-bottom:1px solid var(--atn-line);
  text-align:right;font-size:12px;
}
.atn-magazine th:first-child{text-align:left}
.atn-magazine thead th{
  color:var(--atn-muted);
  font:700 8px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.07em;
}
.atn-magazine tr.profit{background:var(--atn-navy);color:#fff}
.atn-magazine .table-note{
  display:block;margin-top:-36px;padding-top:9px;
  color:var(--atn-muted);
  font:600 7px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.1em;
}
.atn-magazine .month-story{
  display:grid;grid-template-columns:72px minmax(0,1fr);
  gap:24px;padding:44px 0;border-top:1px solid var(--atn-line);
}
.atn-magazine .month-no span{
  font:400 37px/1 "Newsreader",Georgia,serif;color:var(--atn-blue)
}
.atn-magazine .month-no b{
  display:block;margin-top:8px;
  font:700 8px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.09em
}
.atn-magazine .month-copy h3{
  margin:0 0 20px;
  font:400 30px/1.2 "Newsreader",Georgia,serif;
  letter-spacing:-.025em;color:var(--atn-navy)
}
.atn-magazine .month-copy p{font-size:15px}
.atn-magazine .balance{
  grid-column:2;
  display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;
  margin-top:8px
}
.atn-magazine .balance>div{padding:16px;border:1px solid var(--atn-line)}
.atn-magazine .balance .accent{border-color:rgba(26,87,168,.55)}
.atn-magazine .balance small{
  color:var(--atn-muted);font:700 7px/1 "Instrument Sans",Arial,sans-serif
}
.atn-magazine .balance b{
  display:block;margin-top:6px;
  font:400 27px/1 "Newsreader",Georgia,serif
}
.atn-magazine .balance>span{color:var(--atn-blue)}
.atn-magazine .balance em{
  grid-column:1/-1;text-align:center;color:var(--atn-blue);
  font:700 7px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.08em;font-style:normal
}
.atn-magazine .production{
  margin:30px 0 60px;padding:44px;
  background:var(--atn-navy);color:#fff
}
.atn-magazine .production .atn-cap{color:#8cb2e7}
.atn-magazine .production h3{
  margin:12px 0 28px;
  font:400 37px/1.15 "Newsreader",Georgia,serif;
  letter-spacing:-.025em
}
.atn-magazine .production p{font-size:14.5px;color:rgba(255,255,255,.78)}
.atn-magazine .unit-grid{
  display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin:30px 0
}
.atn-magazine .unit-card{
  display:grid;gap:7px;padding:21px;border:1px solid rgba(255,255,255,.2)
}
.atn-magazine .unit-card.accent{border-color:#8cb2e7}
.atn-magazine .unit-card small{
  color:#8cb2e7;font:700 7px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.1em
}
.atn-magazine .unit-card span{font-size:11px;color:rgba(255,255,255,.68)}
.atn-magazine .unit-card strong{
  margin-top:7px;padding-top:13px;border-top:1px solid rgba(255,255,255,.18);
  font:700 8px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.05em
}
.atn-magazine .unit-card strong em{
  float:right;color:#fff;font:400 25px/1 "Newsreader",Georgia,serif;font-style:normal
}
.atn-magazine .unit-grid>i{font-style:normal;color:#8cb2e7}
.atn-magazine .effect-grid{
  display:grid;grid-template-columns:1fr 125px 1fr;gap:14px;align-items:stretch;margin:31px 0
}
.atn-magazine .effect-grid>div{padding:21px;border:1px solid rgba(255,255,255,.18)}
.atn-magazine .effect-grid small{
  color:#8cb2e7;font:700 7px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.09em
}
.atn-magazine .effect-grid b{display:block;margin:9px 0 4px}
.atn-magazine .effect-grid span{font-size:10px;color:rgba(255,255,255,.58)}
.atn-magazine .effect-grid>em{
  display:flex;align-items:center;justify-content:center;
  color:#8cb2e7;font:700 8px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.08em;font-style:normal;text-align:center
}
.atn-magazine .profit-drivers{
  margin:42px 0;padding:25px;border:1px solid var(--atn-line)
}
.atn-magazine .profit-drivers>span{
  color:var(--atn-muted);font:700 8px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.1em
}
.atn-magazine .profit-drivers ul{
  list-style:none;margin:20px 0;padding:0;
  display:grid;grid-template-columns:1fr 1fr;gap:9px
}
.atn-magazine .profit-drivers li{
  padding:11px;background:rgba(250,247,240,.65);font-size:12px
}
.atn-magazine .profit-drivers li b{display:inline-block;width:18px;color:var(--atn-blue)}
.atn-magazine .profit-drivers li.minus b{color:var(--atn-ink)}
.atn-magazine .profit-result{
  display:flex;justify-content:space-between;gap:12px;
  padding-top:15px;border-top:1px solid var(--atn-line);
  font:700 8px/1.5 "Instrument Sans",Arial,sans-serif;letter-spacing:.07em
}
.atn-magazine .profit-result em{font-style:normal;color:var(--atn-blue)}
.atn-magazine .timeline{
  margin-top:40px;padding:28px;border:1px solid var(--atn-line)
}
.atn-magazine .tm-row{
  display:grid;grid-template-columns:1.35fr repeat(3,1fr);gap:8px;
  padding:11px 0;border-bottom:1px solid rgba(7,17,32,.08)
}
.atn-magazine .tm-row span{
  color:var(--atn-muted);font:700 8px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.07em
}
.atn-magazine .tm-row b{text-align:center;font:700 10px/1.2 "Instrument Sans",Arial,sans-serif}
.atn-magazine .tm-row.profit{margin-top:8px;padding:13px 10px;background:var(--atn-navy);color:#fff}
.atn-magazine .tm-row.profit span{color:#9bb9df}
.atn-magazine .tm-row.profit b{font-size:16px}
.atn-magazine .tm-story{
  display:grid;grid-template-columns:1fr auto 1fr auto 1fr;
  gap:8px;align-items:center;text-align:center;margin-top:22px;
  color:var(--atn-muted);font-size:9px;line-height:1.5
}
.atn-magazine .tm-story i{font-style:normal;color:var(--atn-blue)}
.atn-magazine .tm-story em{font-style:normal;color:var(--atn-ink)}
.atn-magazine .check-grid{
  display:grid;grid-template-columns:1fr 1fr;margin:38px 0;border-top:1px solid var(--atn-line)
}
.atn-magazine .check-grid span{
  padding:15px 12px 15px 0;border-bottom:1px solid var(--atn-line);font-size:13px
}
.atn-magazine .check-grid span:nth-child(even){padding-left:18px;border-left:1px solid var(--atn-line)}
.atn-magazine .loop{
  display:flex;gap:11px;align-items:center;justify-content:center;flex-wrap:wrap;
  margin:42px 0;padding:28px;border:1px solid var(--atn-line)
}
.atn-magazine .loop b{font:700 8px/1 "Instrument Sans",Arial,sans-serif;letter-spacing:.08em}
.atn-magazine .loop i{font-style:normal;color:var(--atn-blue)}
.atn-magazine .closing{
  padding:92px 0 40px
}
.atn-magazine .closing .atn-cap{color:var(--atn-blue)}
.atn-magazine .closing blockquote{
  margin:48px 0 22px;
  font:400 42px/1.2 "Newsreader",Georgia,serif;
  letter-spacing:-.03em;color:var(--atn-navy)
}
.atn-magazine .closing blockquote strong{font-weight:400;color:var(--atn-blue)}
.atn-magazine .closing .signoff{
  color:var(--atn-muted);
  font:700 8px/1 "Instrument Sans",Arial,sans-serif;
  letter-spacing:.14em
}
@media(max-width:760px){
  .atn-magazine .atn-intro{padding-top:10px}
  .atn-magazine .atn-question{font-size:29px}
  .atn-magazine .atn-highlight{font-size:24px}
  .atn-magazine .atn-section{padding:70px 0}
  .atn-magazine .atn-section-head{grid-template-columns:1fr;gap:10px;margin-bottom:34px}
  .atn-magazine .atn-section-head h2{font-size:36px}
  .atn-magazine .atn-figure{padding:19px;margin:38px 0}
  .atn-magazine .flow{grid-template-columns:1fr}
  .atn-magazine .flow .node{border-right:0;border-bottom:1px solid var(--atn-line);padding:12px 8px}
  .atn-magazine .flow .node:last-child{border-bottom:0}
  .atn-magazine .flow .node:not(:last-child)::after{content:"↓";right:50%;top:auto;bottom:-9px}
  .atn-magazine .flow small{display:inline-block;width:32px;margin:0}
  .atn-magazine .flow b,.atn-magazine .flow span{display:inline-block}
  .atn-magazine .flow span{margin:0 0 0 8px}
  .atn-magazine .horizon{grid-template-columns:72px repeat(3,1fr);gap:5px}
  .atn-magazine .bar em{font-size:5px;left:4px}
  .atn-magazine .two-note{grid-template-columns:1fr}
  .atn-magazine .two-note>div+div{padding-left:0;border-left:0;border-top:1px solid var(--atn-line)}
  .atn-magazine .big-question{font-size:31px}
  .atn-magazine .bridge{height:195px;gap:5px}
  .atn-magazine .bridge span{font-size:18px}
  .atn-magazine .bridge b{font-size:5px;transform:rotate(-48deg);transform-origin:left top;white-space:nowrap}
  .atn-magazine .driver-map .row{gap:26px}
  .atn-magazine .month-story{grid-template-columns:48px 1fr;gap:13px}
  .atn-magazine .month-copy h3{font-size:26px}
  .atn-magazine .month-copy p{font-size:14px}
  .atn-magazine .balance{grid-column:1/-1}
  .atn-magazine .production{margin-left:-18px;margin-right:-18px;padding:32px 18px}
  .atn-magazine .production h3{font-size:31px}
  .atn-magazine .unit-grid{grid-template-columns:1fr}
  .atn-magazine .unit-grid>i{text-align:center;transform:rotate(90deg)}
  .atn-magazine .effect-grid{grid-template-columns:1fr}
  .atn-magazine .effect-grid>em{padding:6px}
  .atn-magazine .profit-drivers ul{grid-template-columns:1fr}
  .atn-magazine .profit-result{display:block}
  .atn-magazine .profit-result em{display:block;margin-top:4px}
  .atn-magazine .tm-story{grid-template-columns:1fr;gap:5px}
  .atn-magazine .tm-story i{transform:rotate(90deg)}
  .atn-magazine .check-grid{grid-template-columns:1fr}
  .atn-magazine .check-grid span:nth-child(even){padding-left:0;border-left:0}
  .atn-magazine .closing blockquote{font-size:34px}
}
</style>

<div class="atn-magazine">

<section class="atn-intro">
  <div class="atn-eyebrow en"><span>SEE / 01</span><i></i><span>FORECASTING</span></div>

  <p class="atn-lead">다음 달 손익을 묻는 질문은 대개 월 마감이 끝나기도 전에 시작된다.</p>

  <div class="atn-question serif">“다음 달은 어느 정도 나올 것 같습니까?”</div>

  <p>매출 전망만 놓고 보면 답하기 어렵지 않아 보인다. 판매계획에 가격을 곱하면 매출이 나온다. 여기에 예상 원가율을 적용하면 대략적인 손익도 만들 수 있다.</p>

  <p>하지만 제조업의 손익은 그렇게 곧게 움직이지 않는다.</p>

  <p>특히 원재료 가격의 영향을 많이 받는 업종에서는 판매량이나 판매가격이 그대로여도 투입 원가의 변화만으로 이익이 크게 달라질 수 있다. 원재료 가격이 빠르게 움직이는 시기라면 매출보다 어떤 원가 가정을 두느냐가 손익 전망에 더 큰 영향을 주기도 한다.</p>

  <p>비용 구조에 따라서도 결과는 달라진다. 생산량이 줄면 같은 고정성 제조비를 더 적은 제품에 나누어 부담하게 되고, 제품 하나당 제조원가는 올라간다. 반대로 생산량이 늘어나면 고정비가 더 많은 제품에 배부되면서 단위당 원가가 낮아질 수 있다.</p>

  <p>판매와 생산 사이에는 재고가 있고, 생산과 손익 사이에는 원가가 있다. 이번 달 생산한 제품이 이번 달에 모두 판매되는 것도 아니다.</p>

  <div class="atn-highlight serif">그래서 Rolling Forecast를 만들 때 가장 먼저 보는 숫자가 꼭 매출일 필요는 없다.</div>
</section>

<section class="atn-section">
  <div class="atn-section-head">
    <small class="en">01 / FORECAST IS A FLOW</small>
    <h2 class="serif">매출을 예측하는 것이 아니라<br>사업의 흐름을 연결한다.</h2>
  </div>

  <p>제조업의 손익은 여러 숫자가 연결되어 움직인 결과에 가깝다.</p>

  <figure class="atn-figure">
    <figcaption class="atn-cap en">BUSINESS FLOW / P&amp;L VIEW</figcaption>
    <div class="flow">
      <div class="node"><small>01</small><b>SALES</b><span>판매계획</span></div>
      <div class="node"><small>02</small><b>PRODUCTION</b><span>생산계획</span></div>
      <div class="node"><small>03</small><b>INVENTORY</b><span>재고 변화</span></div>
      <div class="node"><small>04</small><b>COGS</b><span>매출원가</span></div>
      <div class="node"><small>05</small><b>PROFIT</b><span>예상 손익</span></div>
    </div>
  </figure>

  <p>판매가 늘면 생산도 늘어날 가능성이 높다. 하지만 반드시 같은 비율로 움직이지는 않는다. 이미 충분한 재고가 있다면 생산을 늘리지 않고 판매 증가에 대응할 수 있다. 반대로 향후 수요를 예상해 판매보다 생산을 먼저 늘릴 수도 있다.</p>

  <p>판매량을 100으로 예상했다고 해서 생산량 역시 100이라고 놓는 순간 재고라는 변수가 사라진다. 여기에 생산량에 따른 단위 제조원가 변화와 원재료 가격까지 빠지면 손익은 실제보다 지나치게 단순해진다.</p>

  <p>Rolling Forecast에서는 각각의 숫자를 따로 보기보다 그 사이의 연결을 먼저 확인하는 편이 낫다.</p>
</section>

<section class="atn-section">
  <div class="atn-section-head">
    <small class="en">02 / THREE MONTHS AHEAD</small>
    <h2 class="serif">3개월이라는 시간의 의미.</h2>
  </div>

  <p>3개월은 연간 사업계획보다 가까워 실제 대응이 가능하고, 다음 달 전망보다는 멀어서 변화의 방향까지 볼 수 있는 구간이다.</p>

  <p>다음 달은 이미 상당 부분 결정돼 있다. 판매계획과 생산계획이 구체화되어 있고 원재료 구매나 재고 수준도 어느 정도 확인할 수 있다. 두 달 뒤부터는 가정의 비중이 커지고, 세 달 뒤에는 숫자 자체보다 어떤 전제를 두었는지가 더 중요해진다.</p>

  <figure class="atn-figure">
    <figcaption class="atn-cap en">VISIBILITY / ASSUMPTION MIX</figcaption>
    <div class="horizon">
      <span></span><b class="month">M+1</b><b class="month">M+2</b><b class="month">M+3</b>
      <span class="label">VISIBILITY</span>
      <div class="bar high"><i></i><em>HIGH</em></div>
      <div class="bar mid"><i></i><em>MID</em></div>
      <div class="bar low"><i></i><em>LOW</em></div>
      <span class="label">ASSUMPTION</span>
      <div class="dots"><i></i></div>
      <div class="dots"><i></i><i></i></div>
      <div class="dots"><i></i><i></i><i></i></div>
    </div>
  </figure>

  <p>그래서 3개월 Forecast는 세 개의 미래 숫자를 한 번에 맞히는 작업이라기보다, <strong>현재 확인할 수 있는 정보와 앞으로 변할 가능성이 있는 가정을 구분하는 작업</strong>에 가깝다.</p>

  <div class="two-note">
    <div><small class="en">M+1</small><p>전망이 크게 틀렸다면 최근 실적이나 이미 확정된 계획부터 다시 본다.</p></div>
    <div><small class="en">M+3</small><p>차이가 커졌다면 계산보다 처음 두었던 가정이 바뀌었는지 먼저 확인한다.</p></div>
  </div>
</section>

<section class="atn-section">
  <div class="atn-section-head">
    <small class="en">03 / START WITH ASSUMPTIONS</small>
    <h2 class="serif">계산보다 먼저<br>적어야 하는 것.</h2>
  </div>

  <p>Forecast 파일을 열면 가장 먼저 수식을 손보게 되기 쉽다. 하지만 숫자를 업데이트하기 전에 먼저 확인할 것이 있다.</p>

  <div class="big-question serif">이번 전망에서 무엇이 달라졌는가.</div>

  <p>판매량이 바뀌었는지, 가격이 달라졌는지, 생산계획이 조정됐는지, 원재료 가격이 움직였는지. 혹은 판매와 생산의 차이로 재고가 쌓이거나 줄어드는지. 가정을 먼저 정리하면 Forecast가 바뀐 이유도 설명하기 쉬워진다.</p>

  <p>여기에는 또 하나의 이유가 있다. Forecast의 최종 결과는 대부분 <strong>영업이익이라는 하나의 숫자</strong>로 경영진에게 보고된다. 하지만 “다음 달 영업이익은 얼마입니다”라는 결과만으로는 충분하지 않다.</p>

  <p>왜 지난 전망보다 좋아졌는지, 왜 사업계획보다 낮아졌는지, 어떤 변수가 가장 큰 영향을 주었는지까지 설명되어야 한다.</p>

  <figure class="atn-figure">
    <figcaption class="atn-cap en">FORECAST PROFIT / INDEXED EXAMPLE</figcaption>
    <div class="bridge">
      <div class="base" style="--h:70%"><span>100</span><i></i><b>PREVIOUS</b></div>
      <div class="neg" style="--h:58%"><span>−8</span><i></i><b>MATERIAL</b></div>
      <div class="neg" style="--h:49%"><span>−5</span><i></i><b>PRODUCTION</b></div>
      <div style="--h:54%"><span>+3</span><i></i><b>PRICE</b></div>
      <div class="neg" style="--h:45%"><span>−5</span><i></i><b>VOLUME</b></div>
      <div class="base" style="--h:58%"><span>85</span><i></i><b>CURRENT</b></div>
    </div>
  </figure>

  <p>원재료 가격 상승이 얼마의 영향을 주었는지, 생산량 감소로 단위당 고정비가 얼마나 높아졌는지, 판매가격과 물량이 이를 얼마나 상쇄했는지를 구분할 수 있어야 한다.</p>

  <p>그래야 영업이익 전망치가 하나의 계산 결과가 아니라 <strong>설명 가능한 숫자</strong>가 된다.</p>

  <p>Forecast는 숫자를 만드는 작업이면서 동시에 그 숫자를 경영진이 이해하고 납득할 수 있도록 만드는 과정이기도 하다. 그래서 가정을 먼저 정리하는 것은 계산의 편의를 위해서가 아니라 <strong>보고의 논리를 만드는 일</strong>에 가깝다.</p>

  <figure class="atn-figure">
    <figcaption class="atn-cap en">FOLLOW THE DRIVER</figcaption>
    <div class="driver-map">
      <div class="row"><span>VOLUME</span><span>PRICE</span></div>
      <i>↓</i><strong>SALES</strong><i>↓</i><strong>PRODUCTION</strong><i>↓</i>
      <div class="row"><span>INVENTORY</span><span>COST</span></div>
      <i>↓</i><strong class="final">P&amp;L</strong>
    </div>
  </figure>
</section>

<section class="atn-section">
  <div class="atn-section-head">
    <small class="en">04 / INDEXED EXAMPLE</small>
    <h2 class="serif">같은 매출 증가라도<br>손익은 다르게 움직일 수 있다.</h2>
  </div>

  <p>조금 더 구체적인 예를 들어보자. 실제 회사 수치가 아닌 구조 설명을 위한 가상 예시이며, 현재 수준을 모두 <strong>100</strong>으로 놓았다.</p>

  <div class="index-wrap">
    <table>
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
  <span class="table-note en">ILLUSTRATIVE INDEX · NO COMPANY DATA</span>

  <p>표만 보면 조금 복잡해 보인다. 한 달씩 따라가 보자.</p>

  <div class="month-story">
    <div class="month-no"><span>01</span><b class="en">M+1</b></div>
    <div class="month-copy">
      <h3 class="serif">매출은 오르는데, 이익은 먼저 내려간다.</h3>
      <p>현재 매출을 100이라고 하면 다음 달 매출은 103으로 증가할 것으로 예상한다. 매출만 보면 손익 역시 좋아질 것처럼 보인다.</p>
      <p>그런데 생산계획은 108이다. 판매보다 생산이 많기 때문에 생산한 제품 중 일부는 재고로 남고, 재고 Index도 100에서 105로 증가한다. 동시에 원재료 가격은 102까지 올라간다고 가정한다.</p>
    </div>

    <div class="balance">
      <div><small class="en">SALES</small><b class="serif">103</b></div>
      <span>+</span>
      <div class="accent"><small class="en">PRODUCTION</small><b class="serif">108</b></div>
      <em class="en">PRODUCTION &gt; SALES → INVENTORY ↑</em>
    </div>
  </div>

  <div class="production">
    <div class="atn-cap en">PRODUCTION EFFECT</div>
    <h3 class="serif">생산이 늘면 단위당 제조원가는 낮아질 수도 있다.</h3>

    <p>공장의 감가상각비, 일부 인건비, 설비 유지비처럼 생산량이 조금 변한다고 같은 비율로 움직이지 않는 비용이 있다.</p>

    <div class="unit-grid">
      <div class="unit-card">
        <small class="en">CASE A</small>
        <span>고정성 제조비 <b>1,000</b></span>
        <span>생산량 <b>100</b></span>
        <strong class="en">UNIT FIXED COST <em>10.0</em></strong>
      </div>
      <i>→</i>
      <div class="unit-card accent">
        <small class="en">CASE B</small>
        <span>고정성 제조비 <b>1,000</b></span>
        <span>생산량 <b>110</b></span>
        <strong class="en">UNIT FIXED COST <em>9.1</em></strong>
      </div>
    </div>

    <p>생산량이 10% 늘었지만 고정성 제조비가 그대로라면 제품 하나가 부담하는 고정비는 약 9% 낮아진다. 생산 증가에는 서로 반대 방향의 효과가 동시에 존재할 수 있다는 의미다.</p>

    <div class="effect-grid">
      <div><small class="en">UPWARD PRESSURE</small><b>원재료 · 변동비 ↑</b><span>총비용 상승 압력</span></div>
      <em class="en">PRODUCTION ↑</em>
      <div><small class="en">DOWNWARD PRESSURE</small><b>고정비 분산</b><span>단위당 원가 하락</span></div>
    </div>

    <p>어느 효과가 더 큰지는 회사의 비용 구조에 따라 달라진다. 원재료 비중이 높은 제품이라면 원재료 가격 상승의 영향이 훨씬 클 수 있다. 반대로 고정성 제조비 비중이 높고 가동률 변화가 큰 공정이라면 생산량 증가에 따른 단위당 원가 감소 효과도 크게 나타날 수 있다.</p>
  </div>

  <div class="profit-drivers">
    <span class="en">M+1 / PROFIT DRIVERS</span>
    <ul>
      <li><b>+</b> 매출 증가</li>
      <li><b>+</b> 생산 증가에 따른 단위 고정비 감소</li>
      <li class="minus"><b>−</b> 원재료 가격 상승</li>
      <li class="minus"><b>−</b> 추가 근무 / 외주비 증가</li>
    </ul>
    <div class="profit-result en">NEGATIVE IMPACT &gt; POSITIVE IMPACT <em>→ PROFIT 98</em></div>
  </div>

  <p>이번 예에서는 생산량 증가에 따른 단위 원가 개선 효과보다 원재료 가격과 추가 비용의 부정적인 영향이 더 컸다고 가정한다. 그래서 매출은 103으로 증가했지만 Profit은 100에서 <strong>98</strong>로 내려간다.</p>

  <div class="month-story">
    <div class="month-no"><span>02</span><b class="en">M+2</b></div>
    <div class="month-copy">
      <h3 class="serif">생산효율과 판매 증가가 비용 부담을 조금씩 상쇄한다.</h3>
      <p>두 달 뒤에는 매출이 107까지 늘어나고 생산도 110으로 높은 수준을 유지한다. 높아진 생산량 덕분에 단위당 고정비 부담은 M+1보다 더 낮아질 수 있다.</p>
      <p>원재료 가격은 여전히 높은 수준이지만 판매 증가 효과가 손익으로 연결되기 시작한다. M+1에서는 비용 상승의 영향이 더 컸다면, M+2부터는 판매 증가와 생산량 확대에 따른 원가 개선이 이를 조금씩 상쇄하면서 Profit은 <strong>101</strong>로 회복한다.</p>
    </div>
  </div>

  <div class="month-story">
    <div class="month-no"><span>03</span><b class="en">M+3</b></div>
    <div class="month-copy">
      <h3 class="serif">판매가 생산을 앞서고, 쌓였던 재고가 줄어든다.</h3>
      <p>세 달 뒤에는 매출이 110까지 증가하는 반면 생산은 108로 조금 낮아진다. 판매가 생산을 앞서면서 그동안 쌓였던 재고가 판매되고 Inventory Index도 108에서 106으로 내려간다.</p>
      <p>원재료 가격은 높은 수준을 유지하지만 추가 상승은 없다고 가정한다. 생산량이 M+2보다 다소 줄면서 단위당 고정비에는 소폭 상승 요인이 생길 수 있지만, 판매 증가와 재고 소진의 영향이 이를 넘어서는 상황이다. 결과적으로 Profit은 <strong>106</strong>까지 개선된다.</p>
    </div>
  </div>

  <div class="timeline">
    <div class="atn-cap en">THREE-MONTH VIEW</div>
    <div class="tm-row"><span></span><b>M+1</b><b>M+2</b><b>M+3</b></div>
    <div class="tm-row"><span>SALES</span><b>103</b><b>107</b><b>110</b></div>
    <div class="tm-row"><span>PRODUCTION</span><b>108</b><b>110</b><b>108</b></div>
    <div class="tm-row"><span>INVENTORY</span><b>105</b><b>108</b><b>106</b></div>
    <div class="tm-row"><span>MATERIAL</span><b>상승</b><b>높은 수준</b><b>안정</b></div>
    <div class="tm-row profit"><span>PROFIT</span><b>98</b><b>101</b><b>106</b></div>
    <div class="tm-story">
      <span>원가 부담<br><em>단기 하락</em></span><i>→</i>
      <span>판매 증가 + 생산효율<br><em>회복 시작</em></span><i>→</i>
      <span>판매 · 재고 효과<br><em>이익 개선</em></span>
    </div>
  </div>

  <div class="atn-highlight serif">Forecast가 보여줘야 하는 것은 생산이 늘었다는 사실보다, 생산 증가가 단위 원가를 얼마나 낮췄고 다른 비용 상승을 얼마나 상쇄했는지까지 설명하는 흐름이다.</div>
</section>

<section class="atn-section">
  <div class="atn-section-head">
    <small class="en">05 / DON'T CHASE THE NUMBER</small>
    <h2 class="serif">Forecast를 맞히는 것과<br>Forecast를 사용하는 것은 다르다.</h2>
  </div>

  <p>물론 Forecast는 실제와 가까울수록 좋다. 하지만 몇 달 뒤 숫자가 실제와 정확히 일치했다고 해서 반드시 좋은 Forecast였다고 말하기는 어렵다. 우연히 맞은 숫자일 수도 있다.</p>

  <p>반대로 실제와 차이가 생겼더라도 무엇이 달라졌는지 설명할 수 있다면 Forecast는 여전히 쓸모가 있다.</p>

  <div class="check-grid">
    <span>판매계획이 달라졌는가.</span>
    <span>예상보다 생산이 많았는가.</span>
    <span>재고가 계획대로 움직이지 않았는가.</span>
    <span>원재료 가격이 예상보다 더 올랐는가.</span>
    <span>생산량 변화로 단위당 제조원가가 달라졌는가.</span>
  </div>

  <div class="loop">
    <b class="en">ACTUAL</b><i>→</i>
    <b class="en">ASSUMPTION</b><i>→</i>
    <b class="en">FORECAST</b><i>→</i>
    <b class="en">VARIANCE</b><i>→</i>
    <b class="en">UPDATE</b><i>↺</i>
  </div>

  <p>Rolling이라는 말은 단순히 매달 전망 기간을 한 달씩 앞으로 옮긴다는 뜻만은 아니다. 실적을 확인하고, 이전 가정을 검토하고, 새롭게 확인된 정보를 다음 전망에 다시 넣는 과정이 반복된다는 의미에 더 가깝다.</p>
</section>

<section class="closing">
  <div class="atn-cap en">AFTER THE NUMBERS / CLOSING</div>

  <p>미래 손익을 완벽하게 맞히는 것은 어렵다.</p>

  <p>대신 어떤 변화가 손익을 움직일지 미리 구조화하는 것은 가능하다.</p>

  <p>판매, 생산, 재고, 원재료 가격과 비용 구조가 어떻게 연결되는지 알고 있다면 Forecast 숫자가 바뀌었을 때도 그 이유를 설명할 수 있다. 그리고 그 설명이 충분해야 영업이익 전망치도 단순한 예상 숫자가 아니라 경영진이 판단에 사용할 수 있는 정보가 된다.</p>

  <blockquote class="serif">다음 숫자를 맞히는 것보다,<br><strong>그 숫자가 만들어지는 과정을 먼저 본다.</strong></blockquote>

  <div class="signoff en">SEE WHAT COMES NEXT.</div>
</section>

</div>
