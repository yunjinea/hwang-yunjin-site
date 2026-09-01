const progressBar = document.getElementById('reading-progress');

function updateReadingProgress() {
  if (!progressBar) return;
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const progress = maximum ? Math.min(100, (window.scrollY / maximum) * 100) : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateReadingProgress, { passive: true });
window.addEventListener('resize', updateReadingProgress, { passive: true });
updateReadingProgress();
