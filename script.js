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

function initNetworkBackground() {
  const canvas = document.getElementById('network-bg');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const points = [];
  const pointCount = 36;
  let width = 0;
  let height = 0;
  const maxDistance = 170;
  const colors = {
    node: 'rgba(39, 181, 118, 0.9)',
    line: 'rgba(39, 181, 118, 0.22)',
    glow: 'rgba(39, 181, 118, 0.08)'
  };

  function createPoint() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: 1.2 + Math.random() * 1.8
    };
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    points.length = 0;
    for (let i = 0; i < pointCount; i += 1) {
      points.push(createPoint());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(10, 28, 16, 0.10)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -20 || point.x > width + 20) point.vx *= -1;
      if (point.y < -20 || point.y > height + 20) point.vy *= -1;

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.node;
      ctx.fill();
    }

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.strokeStyle = `rgba(39, 181, 118, ${0.22 * (1 - distance / maxDistance)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  window.requestAnimationFrame(draw);
}

function initTimelineBackground() {
  const canvas = document.getElementById('timeline-bg');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const points = [];
  const pointCount = 24;
  let width = 0;
  let height = 0;
  const maxDistance = 160;

  function createPoint() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 1.4 + Math.random() * 1.8
    };
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    points.length = 0;
    for (let i = 0; i < pointCount; i += 1) {
      points.push(createPoint());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(0, 0, width, height);

    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -20 || point.x > width + 20) point.vx *= -1;
      if (point.y < -20 || point.y > height + 20) point.vy *= -1;

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(17, 135, 90, 0.78)';
      ctx.fill();
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.strokeStyle = `rgba(17, 135, 90, ${0.2 * (1 - distance / maxDistance)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  window.requestAnimationFrame(draw);
}

initNetworkBackground();
initTimelineBackground();

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

const serviceButtons = document.querySelectorAll('.service-item');
const serviceTitle = document.querySelector('.services-content h3');
const serviceEyebrow = document.querySelector('.services-content .eyebrow');
const serviceParagraph = document.querySelector('.services-content .service-description');
const serviceList = document.querySelector('.services-content ul');
const serviceImage = document.querySelector('.services-image-frame img');

const serviceData = {
  performance: {
    eyebrow: 'Performance Marketing',
    title: 'Daraz Account Management',
    description: 'We don’t just manage your Daraz account — we grow it. From product uploads to ad campaigns and performance tracking, we work to increase your sales and improve store performance month over month.',
    items: [
      'Strategic ad campaigns tuned for Daraz',
      'Listing optimization with conversion-driven copy',
      'Real-time sales tracking and performance reporting'
    ],
    image: 'about.png',
    alt: 'Team working on Daraz account management'
  },
  content: {
    eyebrow: 'Content Creation',
    title: 'Creative Daraz Content',
    description: 'Create high-performing content for your Daraz store with optimized listings, product visuals, and campaign creatives that convert browsers into buyers.',
    items: [
      'Brand-aligned product imagery and videos',
      'SEO-focused listing descriptions',
      'Campaign-ready social and ad content'
    ],
    image: 'about.png',
    alt: 'Creative team developing content'
  },
  daraz: {
    eyebrow: 'Daraz Account Management',
    title: 'End-to-End Store Growth',
    description: 'Our Daraz account management service covers everything from catalog updates to sales acceleration, giving your storefront the tools and strategy needed to win daily.',
    items: [
      'Store performance optimization',
      'Daily campaign and inventory monitoring',
      'Customer service and order handling support'
    ],
    image: 'about.png',
    alt: 'Daraz storefront management in action'
  },
  web: {
    eyebrow: 'Web Development',
    title: 'Ecommerce Web Support',
    description: 'Build a cohesive online presence with web development support that aligns your Daraz efforts with your brand, conversions, and customer experience.',
    items: [
      'Responsive storefront and landing pages',
      'Conversion-focused UX design',
      'Fast-loading, mobile-first implementations'
    ],
    image: 'about.png',
    alt: 'Web development and ecommerce design'
  },
  '3pl': {
    eyebrow: '3PL Services',
    title: 'Logistics & Fulfillment',
    description: 'Streamline your supply chain with third-party logistics support so your Daraz store can scale without the headaches of warehousing, shipping, and inventory management.',
    items: [
      'Warehousing and order fulfillment',
      'Inventory reconciliation and tracking',
      'Delivery coordination and returns support'
    ],
    image: 'about.png',
    alt: 'Logistics and fulfillment operations'
  }
};

function updateServiceDisplay(key) {
  const data = serviceData[key];
  if (!data || !serviceTitle || !serviceEyebrow || !serviceParagraph || !serviceList || !serviceImage) return;

  serviceEyebrow.textContent = data.eyebrow;
  serviceTitle.textContent = data.title;
  serviceParagraph.textContent = data.description;
  serviceImage.src = data.image;
  serviceImage.alt = data.alt;

  serviceList.innerHTML = data.items.map((item) => `<li>${item}</li>`).join('');
}

serviceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    serviceButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const serviceKey = button.dataset.service;
    updateServiceDisplay(serviceKey);
  });
});

if (serviceButtons.length > 0) {
  const defaultKey = serviceButtons[0].dataset.service || 'performance';
  updateServiceDisplay(defaultKey);
}

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

