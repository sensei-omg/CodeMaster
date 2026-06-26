// ============ HEADER SCROLL ============
const header = document.getElementById('header');
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  header.classList.toggle('scrolled', scrolled > 50);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / docHeight) * 100;
  scrollProgress.style.width = progress + '%';

  scrollTopBtn.classList.toggle('visible', scrolled > 500);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ BURGER MENU ============
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  nav.classList.toggle('mobile-open');
  document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('mobile-open');
    document.body.style.overflow = '';
  });
});

// ============ ANIMATED COUNTERS ============
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 2000;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// ============ REVEAL ON SCROLL ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.classList.contains('hero-stats') || entry.target.querySelector('.stat-number')) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ============ COURSE TABS ============
const tabBtns = document.querySelectorAll('.tab-btn');
const courseCards = document.querySelectorAll('.course-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    courseCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) {
        card.style.animation = 'fadeIn 0.5s ease';
      }
    });
  });
});

// ============ REVIEWS CAROUSEL ============
const track = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('prevReview');
const nextBtn = document.getElementById('nextReview');
let reviewIndex = 0;

const getVisibleCount = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

const updateCarousel = () => {
  const cards = track.children;
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  reviewIndex = Math.min(reviewIndex, maxIndex);

  const cardWidth = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;

  prevBtn.disabled = reviewIndex === 0;
  nextBtn.disabled = reviewIndex >= maxIndex;
};

prevBtn.addEventListener('click', () => {
  if (reviewIndex > 0) { reviewIndex--; updateCarousel(); }
});
nextBtn.addEventListener('click', () => {
  const visible = getVisibleCount();
  if (reviewIndex < track.children.length - visible) { reviewIndex++; updateCarousel(); }
});

window.addEventListener('resize', updateCarousel);
updateCarousel();

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ============ CALCULATOR ============
const courseSelect = document.getElementById('course');
const calculator = document.getElementById('calculator');
const calcBase = document.getElementById('calcBase');
const calcDiscount = document.getElementById('calcDiscount');
const calcInstallment = document.getElementById('calcInstallment');
const calcTotal = document.getElementById('calcTotal');

const formatPrice = (n) => n.toLocaleString('ru-RU') + ' ₽';

courseSelect.addEventListener('change', () => {
  const option = courseSelect.options[courseSelect.selectedIndex];
  const price = parseInt(option.dataset.price) || 0;

  if (price > 0) {
    calculator.style.display = 'block';
    const discount = price * 0.2;
    const total = price - discount;
    const installment = Math.round(total / 12);

    calcBase.textContent = formatPrice(price);
    calcDiscount.textContent = '-' + formatPrice(discount);
    calcInstallment.textContent = formatPrice(installment) + '/мес';
    calcTotal.textContent = formatPrice(total);
  } else {
    calculator.style.display = 'none';
  }
});

// ============ PHONE MASK ============
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.startsWith('8')) val = '7' + val.slice(1);
  if (!val.startsWith('7')) val = '7' + val;
  val = val.slice(0, 11);

  let formatted = '+7';
  if (val.length > 1) formatted += ' (' + val.slice(1, 4);
  if (val.length >= 5) formatted += ') ' + val.slice(4, 7);
  if (val.length >= 8) formatted += '-' + val.slice(7, 9);
  if (val.length >= 10) formatted += '-' + val.slice(9, 11);

  e.target.value = formatted;
});

// ============ FORM SUBMIT ============
const form = document.getElementById('applicationForm');
const toast = document.getElementById('toast');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);

  form.reset();
  calculator.style.display = 'none';
});

// ============ FADE IN ANIMATION ============
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);