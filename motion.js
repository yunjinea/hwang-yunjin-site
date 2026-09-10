/* AFTER THE NUMBERS — progressive motion, native scrolling and navigation.
 * Content is visible before JS runs. Only decorative drawings wait for view.
 * No wheel/touch interception, fetch router, timer-based navigation or loops.
 */
(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  let observer;
  let timelineObserver;
  let timelineActive = false;
  let frame = 0;
  const running = new Set();
  const finished = new WeakSet();
  const prepared = new Set();
  const timeline = document.querySelector('[data-timeline]');
  const targets = [...document.querySelectorAll('[data-motion]')];
  const ease = 'cubic-bezier(.22, 1, .36, 1)';

  function animate(element, keyframes, options = {}) {
    if (preference.matches) return;
    const animation = element.animate(keyframes, {
      duration: 620, easing: ease, fill: 'backwards', ...options
    });
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  }

  function parts(target) {
    return [...target.querySelectorAll('.motion-draw, .motion-bar, .motion-pop, .motion-fade')];
  }

  function resetPart(part) {
    part.style.removeProperty('opacity');
    part.style.removeProperty('stroke-dasharray');
    part.style.removeProperty('stroke-dashoffset');
  }

  function prepare(target) {
    if (target.dataset.motion !== 'diagram') return;
    parts(target).forEach(part => {
      if (part.classList.contains('motion-draw')) {
        part.style.strokeDasharray = '1';
        part.style.strokeDashoffset = '1';
      } else part.style.opacity = '0';
    });
    prepared.add(target);
  }

  function reveal(target, immediate = false) {
    if (finished.has(target)) return;
    finished.add(target);
    observer?.unobserve(target);
    target.classList.add('is-in-view');
    const kind = target.dataset.motion;
    if (kind === 'diagram') {
      parts(target).forEach(part => {
        resetPart(part);
        if (immediate || preference.matches) return;
        const delay = Number(part.dataset.delay) || 0;
        if (part.classList.contains('motion-draw')) {
          animate(part, [
            {strokeDasharray: '1', strokeDashoffset: '1'},
            {strokeDasharray: '1', strokeDashoffset: '0'}
          ], {duration: 700, delay});
        } else if (part.classList.contains('motion-bar')) {
          animate(part, [{transform:'scaleY(0)', opacity:0}, {transform:'scaleY(1)', opacity:1}], {duration:540, delay});
        } else if (part.classList.contains('motion-pop')) {
          animate(part, [{transform:'scale(.65)', opacity:0}, {transform:'scale(1)', opacity:1}], {duration:400, delay});
        } else animate(part, [{opacity:0}, {opacity:1}], {duration:440, delay});
      });
      prepared.delete(target);
    } else if (!immediate && !preference.matches) {
      if (kind === 'sequence') {
        const bars = [...target.querySelectorAll('.waterfall rect')]
          .sort((a, b) => Number(a.getAttribute('x')) - Number(b.getAttribute('x')));
        bars.forEach((bar, i) => animate(bar,
          [{transform:'scaleY(0)', opacity:0}, {transform:'scaleY(1)', opacity:1}],
          {delay:i*110, duration:500}));
        target.querySelectorAll('.decision-path>div, .budget-amount').forEach((item, i) => animate(item,
          [{opacity:.35, transform:'translateY(10px)'}, {opacity:1, transform:'translateY(0)'}],
          {delay:i*100, duration:480}));
        const flow = target.querySelector('.flow-diagram');
        if (flow) animate(flow, [{opacity:.3}, {opacity:1}], {duration:500});
      } else if (kind === 'year') {
        animate(target, [{opacity:.45}, {opacity:1}], {duration:450});
      } else {
        animate(target, [{opacity:.35, transform:'translateY(16px)'}, {opacity:1, transform:'translateY(0)'}]);
      }
    }
  }

  function updateTimeline() {
    frame = 0;
    if (!timelineActive || preference.matches) return;
    const rect = timeline.getBoundingClientRect();
    const marker = window.innerHeight * .7;
    const progress = Math.max(0, Math.min(1, (marker - rect.top) / Math.max(rect.height, 1)));
    timeline.style.setProperty('--timeline-progress', progress.toFixed(3));
    timeline.querySelectorAll('article').forEach(article => {
      article.classList.toggle('is-current', article.getBoundingClientRect().top <= marker);
    });
  }
  function scheduleTimeline() {
    if (!frame && timelineActive && !preference.matches) frame = requestAnimationFrame(updateTimeline);
  }

  function setup() {
    observer?.disconnect();
    timelineObserver?.disconnect();
    if (preference.matches) {
      running.forEach(animation => animation.cancel());
      running.clear();
      targets.forEach(target => reveal(target, true));
      prepared.forEach(target => parts(target).forEach(resetPart));
      prepared.clear();
      timelineActive = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      timeline?.style.removeProperty('--timeline-progress');
      return;
    }
    // Set up the observer successfully before preparing decorative elements.
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, {threshold:0, rootMargin:'0px 0px -10% 0px'});
    targets.forEach(target => {
      if (finished.has(target)) return;
      if (target.getBoundingClientRect().bottom <= 0) reveal(target, true);
      else { prepare(target); observer.observe(target); }
    });
    if (timeline) {
      timelineObserver = new IntersectionObserver(entries => {
        timelineActive = entries[0].isIntersecting;
        scheduleTimeline();
      });
      timelineObserver.observe(timeline);
    }
  }
  try { setup(); } catch {
    prepared.forEach(target => parts(target).forEach(resetPart));
    prepared.clear();
  }
  preference.addEventListener('change', setup);
  if (timeline) {
    window.addEventListener('scroll', scheduleTimeline, {passive:true});
    window.addEventListener('resize', scheduleTimeline, {passive:true});
  }
  // Keyboard focus must never land on an element waiting for its decoration.
  document.addEventListener('focusin', event => {
    const card = event.target.closest('.case-card');
    if (card) card.querySelectorAll('[data-motion]').forEach(target => reveal(target, true));
  });
  // Restore complete drawings after native back/forward cache navigation.
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    running.forEach(animation => animation.cancel());
    targets.forEach(target => reveal(target, true));
    scheduleTimeline();
  });
})();
