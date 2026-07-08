// Handle contact form success/error messages
(function() {
  const params = new URLSearchParams(window.location.search);
  const contactStatus = params.get('contact');
  
  if (contactStatus) {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `contact-message contact-${contactStatus}`;
      messageDiv.style.cssText = `
        margin-bottom: 2rem;
        padding: 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        animation: slideDown 0.3s ease-out;
      `;
      
      if (contactStatus === 'success') {
        messageDiv.textContent = '✓ Thank you! Your message has been sent successfully. We\'ll get back to you soon!';
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.borderLeft = '4px solid #28a745';
      } else if (contactStatus === 'error') {
        messageDiv.textContent = '✗ Oops! There was an error sending your message. Please try again or contact us directly.';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.borderLeft = '4px solid #dc3545';
      }
      
      // Insert at the top of contact section
      const contactShell = contactSection.querySelector('.contact-shell');
      if (contactShell) {
        contactShell.parentNode.insertBefore(messageDiv, contactShell);
      } else {
        contactSection.insertBefore(messageDiv, contactSection.firstChild);
      }
      
      // Clean URL params after showing message
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Auto-remove message after 5 seconds
      setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
      }, 5000);
    }
  }
  
  // Add CSS animation
  if (!document.querySelector('style[data-contact-animation]')) {
    const style = document.createElement('style');
    style.setAttribute('data-contact-animation', 'true');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
})();

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

