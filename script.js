/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile menu ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

function closeMobile() {
  mobileMenu.classList.remove('open');
}

/* ── Scroll reveal (IntersectionObserver) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ── Animated counters ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el       = entry.target;
    const target   = +el.dataset.target;
    const suffix   = target >= 100 ? '+' : '';
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current < target) requestAnimationFrame(tick);
    };

    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number')
  .forEach(el => counterObserver.observe(el));

/* ── Category filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.video-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach((card, i) => {
      const show = filter === 'all' || card.dataset.category === filter;

      if (show) {
        card.style.display = '';
        card.style.animationDelay = (i * 0.05) + 's';
        card.style.animation = 'none';
        void card.offsetWidth; /* force reflow to restart animation */
        card.style.animation = 'fadeIn .4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ── Video modal ── */
const overlay    = document.getElementById('modalOverlay');
const iframe     = document.getElementById('modalIframe');
const modalTitle = document.getElementById('modalTitle');
const closeBtn   = document.getElementById('modalClose');

function openModal(videoId, title) {
  iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
  modalTitle.textContent = title;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';
}

cards.forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.videoid, card.dataset.title));
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Hero reveal on load ── */
document.querySelector('.hero-content').classList.add('visible');