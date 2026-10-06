// Animate only while the pointer is in the visible hero, and stop once settled.
(() => {
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const spotlight = hero.querySelector('.cursor-spotlight');
  const headline = hero.querySelector('.hero-headline');
  const seal = hero.querySelector('.seal-floating');
  let frame = null;
  let inHero = false;
  let visible = false;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  const enabled = () => pointer.matches && !reducedMotion.matches && !document.hidden;
  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    inHero = false;
    if (headline) headline.style.transform = '';
    if (spotlight) spotlight.style.transform = '';
    if (seal) {
      seal.style.removeProperty('--mx');
      seal.style.removeProperty('--my');
    }
  }
  function tick() {
    frame = null;
    if (!enabled() || !visible || !inHero) return;
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    const rect = hero.getBoundingClientRect();
    const nx = (currentX / rect.width - 0.5) * 2;
    const ny = (currentY / rect.height - 0.5) * 2;
    if (spotlight) spotlight.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
    if (headline) headline.style.transform = `perspective(1400px) rotateX(${ny * -2.5}deg) rotateY(${nx * 3}deg) translateZ(0)`;
    if (seal) {
      seal.style.setProperty('--mx', `${nx * -20}px`);
      seal.style.setProperty('--my', `${ny * -20}px`);
    }
    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      frame = requestAnimationFrame(tick);
    }
  }
  hero.addEventListener('mousemove', event => {
    if (!enabled() || !visible) return;
    inHero = true;
    const rect = hero.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    if (frame === null) frame = requestAnimationFrame(tick);
  });
  hero.addEventListener('mouseleave', stop);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
  });
  observer.observe(hero);
  document.addEventListener('visibilitychange', stop);
  // Reset pointer coordinates after scrolling; another mouse move can restart.
  window.addEventListener('scroll', stop, { passive: true });
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');
  buttons.forEach(button => {
    button.addEventListener('mousemove', event => {
      if (!enabled()) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });
    button.addEventListener('mouseleave', () => { button.style.transform = ''; });
  });
  const reset = () => {
    stop();
    buttons.forEach(button => { button.style.transform = ''; });
  };
  pointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
})();

// Back to top button
(function() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const threshold = 600;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  function check() {
    if (window.scrollY > threshold) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(check);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    document.querySelector('.logo')?.focus({ preventScroll: true });
  });

  check();
})();

// Scroll parallax for interlude background images
(function() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const parallaxLayers = document.querySelectorAll('.parallax-bg');
  if (!parallaxLayers.length) return;

  let ticking = false;

  function updateParallax() {
    if (reducedMotion.matches) {
      parallaxLayers.forEach(layer => { layer.style.transform = ''; });
      ticking = false;
      return;
    }
    const viewportH = window.innerHeight;
    parallaxLayers.forEach(layer => {
      const parent = layer.parentElement;
      const rect = parent.getBoundingClientRect();
      // Only update if section is roughly in viewport (perf)
      if (rect.bottom < -200 || rect.top > viewportH + 200) return;
      const speed = parseFloat(layer.dataset.speed || 0.35);
      // Center-based offset — when section center is at viewport center, offset = 0
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportH / 2;
      const offset = (viewportCenter - sectionCenter) * speed;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reducedMotion.addEventListener('change', onScroll);
  updateParallax();
})();
