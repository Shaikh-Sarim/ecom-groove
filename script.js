const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

const counters = document.querySelectorAll('.counter');

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';

  const tick = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    const formatted = value.toLocaleString();
    element.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// FAQ Functionality
const faqHeaders = document.querySelectorAll('.faq-header');

faqHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const faqItem = header.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item.active').forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove('active');
      }
    });

    // Toggle current item
    faqItem.classList.toggle('active');
  });
});

