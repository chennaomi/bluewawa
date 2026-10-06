// Pause decorative CSS animations outside the viewport and in hidden tabs.
(() => {
  const sections = [...document.querySelectorAll('.hero, .contact-section')];
  const visible = new Set();
  const update = () => sections.forEach(section => {
    section.classList.toggle('motion-paused', document.hidden || !visible.has(section));
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    update();
  });
  sections.forEach(section => observer.observe(section));
  document.addEventListener('visibilitychange', update);
})();

// The menu remains usable as native details when JavaScript is unavailable.
(() => {
  const menu = document.querySelector('.mobile-nav');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    menu.open = false;
    const url = new URL(link.href);
    if (url.pathname === location.pathname && url.hash) {
      const target = document.getElementById(url.hash.slice(1));
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', event => {
    if (event.matches) menu.open = false;
  });
})();
