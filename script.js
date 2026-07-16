const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const progressBars = document.querySelectorAll('.progress-bar span');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const backToTop = document.querySelector('.back-to-top');
const contactForm = document.getElementById('contact-form');
const formStatus = document.querySelector('.form-status');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  body.classList.add('dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.theme-toggle__icon').textContent = isDark ? '🌙' : '☀';
  });

  themeToggle.querySelector('.theme-toggle__icon').textContent = body.classList.contains('dark') ? '🌙' : '☀';
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const updateActiveLink = () => {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', () => {
  updateActiveLink();
  revealOnScroll();
  animateCounters();
  animateProgress();
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

window.addEventListener('load', () => {
  updateActiveLink();
  revealOnScroll();
  animateCounters();
  animateProgress();
});

const revealOnScroll = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      item.classList.add('is-visible');
    }
  });
};

const animateCounters = () => {
  counters.forEach((counter) => {
    if (counter.dataset.animated) return;
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      const target = Number(counter.dataset.target || 0);
      const duration = 1400;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = `${value}${target === 98 ? '%' : target === 120 ? '+' : ''}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = `${target}${target === 98 ? '%' : target === 120 ? '+' : ''}`;
        }
      };

      requestAnimationFrame(step);
      counter.dataset.animated = 'true';
    }
  });
};

const animateProgress = () => {
  progressBars.forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60 && !bar.classList.contains('is-visible')) {
      bar.classList.add('is-visible');
    }
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    portfolioCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

let currentTestimonial = 0;

const showTestimonial = (index) => {
  testimonialCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
};

const nextTestimonial = () => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
};

const prevTestimonial = () => {
  currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(currentTestimonial);
};

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', prevTestimonial);
  nextBtn.addEventListener('click', nextTestimonial);
  setInterval(nextTestimonial, 6000);
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const subject = contactForm.subject.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please complete all fields before sending your message.';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formStatus.textContent = 'Please enter a valid email address.';
    return;
  }

  formStatus.textContent = 'Thank you! Your message has been received.';
  contactForm.reset();
});
