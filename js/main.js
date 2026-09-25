// Hero image carousel
const hero = document.querySelector('#hero');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const titleEl = hero.querySelector('.hero-title');
  const subEl = hero.querySelector('.hero-sub-text');
  const counterEl = hero.querySelector('.hero-counter-current');
  const totalEl = hero.querySelector('.hero-counter-total');
  let index = slides.findIndex(s => s.classList.contains('active'));
  if (index < 0) index = 0;
  let timer;

  const pad = n => String(n + 1).padStart(2, '0');
  if (totalEl) totalEl.textContent = pad(slides.length - 1);

  function show(i) {
    slides[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    slide.classList.add('active');
    if (titleEl) titleEl.textContent = slide.dataset.title || '';
    if (subEl) subEl.textContent = slide.dataset.sub || '';
    if (counterEl) counterEl.textContent = pad(index);
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

// Work lightbox
const modal = document.querySelector('#work-modal');
if (modal) {
  const modalArt = modal.querySelector('.placeholder-art');
  const modalImg = modal.querySelector('.placeholder-art img');
  const modalTitle = modal.querySelector('.work-title');
  const modalSub = modal.querySelector('.work-sub');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalInquire = modal.querySelector('.work-inquire');

  document.querySelectorAll('[data-work]').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title;
      const sub = card.dataset.sub;
      const desc = card.dataset.desc || '';
      const hue = card.querySelector('.placeholder-art')?.dataset.hue;
      const srcImg = card.querySelector('.placeholder-art img');

      modalArt.className = 'placeholder-art' + (hue ? ' hue-' + hue : '');
      if (modalImg) {
        if (srcImg) {
          modalImg.src = srcImg.src;
          modalImg.alt = srcImg.alt;
          modalImg.style.display = '';
        } else {
          modalImg.style.display = 'none';
        }
      }
      modalTitle.textContent = title;
      modalSub.textContent = sub;
      modalDesc.textContent = desc;
      if (modalInquire) modalInquire.href = 'contact.html?work=' + encodeURIComponent(title);

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
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
