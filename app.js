document.addEventListener('DOMContentLoaded', () => {
  
  /* --- Lenis Smooth Scroll --- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);

  /* --- Helper: Split Text into Lines --- */
  const splitLines = (element) => {
    const text = element.innerText;
    const words = text.split(/\s+/);
    element.innerHTML = words.map(word => `<span class="split-word" style="display: inline-block;">${word}</span>`).join(' ');
    
    const wordSpans = element.querySelectorAll('.split-word');
    const lines = [];
    let currentLine = [];
    let lastTop = null;
    
    wordSpans.forEach(span => {
      const top = span.offsetTop;
      if (lastTop !== null && top !== lastTop) {
        lines.push(currentLine);
        currentLine = [];
      }
      currentLine.push(span.innerText);
      lastTop = top;
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    element.innerHTML = lines.map(line => 
      `<div class="split-line-overflow" style="overflow: hidden; display: block; margin: 0; padding: 0;">` +
        `<span class="split-line-inner" style="display: inline-block; transform: translateY(105%); opacity: 0; transition: none;">${line.join(' ')}</span>` +
      `</div>`
    ).join('');
  };

  /* --- Scroll-Driven Reveals --- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    /* --- Fallback Intersection Observer for Reduced Motion --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    /* --- GSAP Scroll-Driven Reveals --- */
    document.body.classList.add('gsap-enabled');

    // 1. Hero Reveal (Instant Load)
    gsap.fromTo('#hero .hero-content', {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.fromTo('#hero .hero-visual', {
      opacity: 0,
      scale: 0.95,
      y: 20
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2
    });

    // 2. About Paragraphs (Line-by-line stagger)
    const quote = document.querySelector('#about .philosophy-quote');
    const aboutParagraphs = document.querySelectorAll('#about .philosophy-text p');
    const aboutTitle = document.querySelector('#about .philosophy-text h2');

    // Animate About Title
    if (aboutTitle) {
      gsap.fromTo(aboutTitle, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: aboutTitle,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    if (quote) {
      splitLines(quote);
      gsap.fromTo(quote.querySelectorAll('.split-line-inner'), {
        y: '105%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    aboutParagraphs.forEach(p => {
      splitLines(p);
      gsap.fromTo(p.querySelectorAll('.split-line-inner'), {
        y: '105%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 3. Projects Header & Cards
    const projectsHeader = document.querySelector('.projects-header');
    if (projectsHeader) {
      gsap.fromTo(projectsHeader, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: projectsHeader,
          start: 'top 85%'
        }
      });
    }

    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((item) => {
      const media = item.querySelector('.project-media');
      const info = item.querySelector('.project-info');
      
      gsap.fromTo([media, info], {
        opacity: 0,
        y: 40,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 4. Skills Section
    const gardenIntro = document.querySelector('.garden-intro');
    if (gardenIntro) {
      gsap.fromTo(gardenIntro, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gardenIntro,
          start: 'top 85%'
        }
      });
    }

    const pebbles = document.querySelectorAll('.skills-garden .pebble');
    if (pebbles.length > 0) {
      gsap.fromTo(pebbles, {
        opacity: 0,
        y: 30,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: {
          each: 0.05,
          grid: 'auto',
          from: 'start'
        },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skills-garden',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // 5. Education Timeline
    const eduIntro = document.querySelectorAll('#skills + section .garden-intro')[0] || document.querySelector('.edu-timeline').previousElementSibling;
    if (eduIntro) {
      gsap.fromTo(eduIntro, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: eduIntro,
          start: 'top 85%'
        }
      });
    }

    const eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach((item) => {
      const node = item.querySelector('.edu-node');
      const date = item.querySelector('.edu-date');
      const school = item.querySelector('.edu-school');
      const degree = item.querySelector('.edu-degree');
      
      gsap.fromTo(node, { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        }
      });
      
      gsap.fromTo([date, school, degree], { opacity: 0, x: -20 }, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        }
      });
    });

    // 6. Contact Section
    const contactLayout = document.querySelector('.contact-layout');
    if (contactLayout) {
      const details = contactLayout.querySelector('.contact-details');
      const form = contactLayout.querySelector('form');
      
      gsap.fromTo(details, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: contactLayout,
          start: 'top 85%'
        }
      });

      gsap.fromTo(form, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: contactLayout,
          start: 'top 85%'
        }
      });
    }
  }

  /* --- Custom Cursor Logic --- */
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  
  if (cursor && cursorDot) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    let isMoving = false;
    let hideTimeout;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the dot
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      
      // Make cursor visible if it was hidden
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
      
      isMoving = true;
      clearTimeout(hideTimeout);
      
      // Hide cursor after 3 seconds of inactivity to keep screen clean
      hideTimeout = setTimeout(() => {
        isMoving = false;
        cursor.style.opacity = '0.3';
      }, 3000);
    });

    // Hide when mouse leaves the document window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });

    // Smooth scroll trailer effect
    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      // Soft trailing physics
      cursorX += dx * 0.12;
      cursorY += dy * 0.12;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      // If moving fast, slightly warp the shape for organic juice/fluidity
      if (isMoving) {
        const speed = Math.min(Math.sqrt(dx*dx + dy*dy), 100);
        const scaleX = 1 + speed * 0.003;
        const scaleY = 1 - speed * 0.003;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      } else {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      
      requestAnimationFrame(animateCursor);
    };
    
    animateCursor();

    // Hover effects on interactive elements
    const hoverables = document.querySelectorAll('a, button, .pebble, input, textarea, .btn-primary, .btn-text');
    
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.style.width = '55px';
        cursor.style.height = '55px';
        cursor.style.backgroundColor = 'rgba(171, 106, 79, 0.12)'; // Rust clay translucent fill
        cursor.style.border = '1px solid var(--accent-rust)';
        cursorDot.style.backgroundColor = 'var(--accent-rust)';
      });
      
      item.addEventListener('mouseleave', () => {
        cursor.style.width = 'var(--cursor-size)';
        cursor.style.height = 'var(--cursor-size)';
        cursor.style.backgroundColor = 'var(--cursor-color)';
        cursor.style.border = 'none';
        cursorDot.style.backgroundColor = 'var(--accent-moss)';
      });
    });
  }

  /* --- Interactive Pebble Shape Deformation --- */
  const pebbles = document.querySelectorAll('.pebble');
  pebbles.forEach(pebble => {
    pebble.addEventListener('mouseenter', () => {
      // Generate a new random organic shape on hover
      const r1 = Math.floor(Math.random() * 20) + 40;
      const r2 = 100 - r1;
      const r3 = Math.floor(Math.random() * 20) + 40;
      const r4 = 100 - r3;
      const r5 = Math.floor(Math.random() * 20) + 40;
      const r6 = 100 - r5;
      const r7 = Math.floor(Math.random() * 20) + 40;
      const r8 = 100 - r7;
      
      pebble.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%`;
    });
  });

  /* --- Form Interactive Floating Labels --- */
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
  inputs.forEach(input => {
    // Check on page load / fill
    if (input.value.trim() !== "") {
      input.classList.add('has-value');
    }
    
    input.addEventListener('blur', () => {
      if (input.value.trim() !== "") {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = document.getElementById('btn-submit');

  if (contactForm && formStatus && submitButton) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      formStatus.textContent = 'Sending message...';

      const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message.');
        }

        formStatus.textContent = 'Message sent successfully. Thank you!';
        contactForm.reset();
        inputs.forEach(input => input.classList.remove('has-value'));
      } catch (error) {
        console.error('Contact form error:', error);
        formStatus.textContent = 'Unable to send message. Please try again later.';
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  /* --- Magnetic Hover States --- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const magnetics = document.querySelectorAll('.btn-primary, .btn-text, .social-links a, .project-media');
    
    magnetics.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const distX = e.clientX - x;
        const distY = e.clientY - y;
        
        const strength = el.classList.contains('project-media') ? 0.1 : 0.35;
        
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
      
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1.1, 0.4)',
          overwrite: 'auto'
        });
      });
    });
  }
});

