// Scroll reveal
const revealEls = Array.from(document.querySelectorAll('.reveal'));
if (revealEls.length) {
  const groups = new Map();
  revealEls.forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(siblings => {
    siblings.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 90, 360) + 'ms';
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
}

// Hero image carousel
const hero = document.querySelector('#hero');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const titleEl = hero.querySelector('.hero-title');
  const subEl = hero.querySelector('.hero-sub-text');
  const counterEl = hero.querySelector('.hero-counter-current');
  const totalEl = hero.querySelector('.hero-counter-total');
  const infoEl = hero.querySelector('.hero-info');
  let index = slides.findIndex(s => s.classList.contains('active'));
  if (index < 0) index = 0;
  let timer;

  const pad = n => String(n + 1).padStart(2, '0');
  if (totalEl) totalEl.textContent = pad(slides.length - 1);

  function show(i) {
    slides[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    if (slide.dataset.bg) {
      slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
      delete slide.dataset.bg;
    }
    slide.classList.add('active');
    if (titleEl) titleEl.textContent = slide.dataset.title || '';
    if (subEl) subEl.textContent = slide.dataset.sub || '';
    if (counterEl) counterEl.textContent = pad(index);
    if (infoEl && slide.dataset.color) infoEl.style.backgroundColor = slide.dataset.color;

    // Warm the cache for the next slide so its crossfade never shows blank
    const nextSlide = slides[(index + 1) % slides.length];
    if (nextSlide.dataset.bg) {
      new Image().src = nextSlide.dataset.bg;
    }
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 5000);
  }

  hero.querySelector('.hero-prev')?.addEventListener('click', () => { show(index - 1); restartAutoplay(); });
  hero.querySelector('.hero-next')?.addEventListener('click', () => { show(index + 1); restartAutoplay(); });

  restartAutoplay();
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mainNav.classList.remove('open'))
  );
}

// Full-screen work viewer
const viewer = document.querySelector('#work-modal');
if (viewer) {
  const works = Array.from(document.querySelectorAll('[data-work]'));
  const viewerImg = viewer.querySelector('.viewer-image');
  const viewerTitle = viewer.querySelector('.work-title');
  const viewerSub = viewer.querySelector('.work-sub');
  const viewerInquire = viewer.querySelector('.work-inquire');
  const viewerCounter = viewer.querySelector('.viewer-counter');
  let current = 0;

  function render(i) {
    current = (i + works.length) % works.length;
    const card = works[current];
    const srcImg = card.querySelector('.placeholder-art img');

    viewerImg.classList.remove('shown');
    const swap = () => {
      if (srcImg) {
        viewerImg.src = srcImg.currentSrc || srcImg.src;
        viewerImg.alt = srcImg.alt;
      }
      viewerTitle.textContent = card.dataset.title || '';
      viewerSub.textContent = card.dataset.sub || '';
      if (viewerInquire) viewerInquire.href = 'contact.html?work=' + encodeURIComponent(card.dataset.title || '');
      if (viewerCounter) viewerCounter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(works.length).padStart(2, '0');
      requestAnimationFrame(() => viewerImg.classList.add('shown'));
    };
    swap();
  }

  function openViewer(i) {
    render(i);
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    viewer.classList.remove('open');
    document.body.style.overflow = '';
  }

  works.forEach((card, i) => card.addEventListener('click', () => openViewer(i)));

  viewer.querySelector('.viewer-close')?.addEventListener('click', closeViewer);
  viewer.querySelector('.viewer-prev')?.addEventListener('click', () => render(current - 1));
  viewer.querySelector('.viewer-next')?.addEventListener('click', () => render(current + 1));
  viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });
}

// Shop filters
const filterButtons = document.querySelectorAll('.shop-toolbar button');
if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

// Newsletter + contact form: no backend yet, show a friendly confirmation
document.querySelectorAll('form[data-local-only]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const success = form.parentElement.querySelector('.form-success');
    form.reset();
    if (success) success.classList.add('show');
  });
});

// Pre-fill contact form subject from ?work= query param
const params = new URLSearchParams(window.location.search);
const workParam = params.get('work');
if (workParam) {
  const subjectField = document.querySelector('#subject');
  if (subjectField) subjectField.value = 'Inquiry: ' + workParam;
}
