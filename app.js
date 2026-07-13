document.addEventListener('DOMContentLoaded', () => {
  
  // --- Live Clock Widget ---
  const clockEl = document.getElementById('nav-clock');
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utc + (5.5 * 3600000));
      const hours = String(istTime.getHours()).padStart(2, '0');
      const minutes = String(istTime.getMinutes()).padStart(2, '0');
      clockEl.innerText = `${hours}:${minutes} IST`;
    }
    setInterval(updateClock, 1000);
    updateClock();
  }

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (themeToggle && themeIcon) {
    const isLight = document.documentElement.classList.contains('light-theme');
    themeIcon.innerText = isLight ? '🌙' : '🔆';
    
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-theme');
      const nowLight = document.documentElement.classList.contains('light-theme');
      localStorage.setItem('theme', nowLight ? 'light' : 'dark');
      themeIcon.innerText = nowLight ? '🌙' : '🔆';
    });
  }

  /* --- Lenis Smooth Scroll --- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    lerp: 0.1, // Heavier, more cinematic feel
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
        scrollTrigger: {
          trigger: projectsHeader,
          start: 'top 85%'
        }
      });
    }

    const projectItems = document.querySelectorAll('.project-item, .project-pinned-wrapper');
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
        scrollTrigger: {
          trigger: gardenIntro,
          start: 'top 85%'
        }
      });
    }

    const pebbles = document.querySelectorAll('.skills-marquee-container .pebble');
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
        scrollTrigger: {
          trigger: '.skills-marquee-container',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // 5. Pathways Section
    const pathwaysIntro = document.querySelector('#pathways .garden-intro');
    if (pathwaysIntro) {
      gsap.fromTo(pathwaysIntro, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
        scrollTrigger: {
          trigger: pathwaysIntro,
          start: 'top 85%'
        }
      });
    }

    const pathwaysCols = document.querySelectorAll('#pathways .pathways-col');
    if (pathwaysCols.length > 0) {
      gsap.fromTo(pathwaysCols, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
        scrollTrigger: {
          trigger: '#pathways .pathways-grid',
          start: 'top 85%'
        }
      });
    }

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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
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
        onStart: function() { gsap.set(this.targets(), { willChange: "transform,opacity" }); },
        onComplete: function() { gsap.set(this.targets(), { clearProps: "willChange" }); },
        scrollTrigger: {
          trigger: contactLayout,
          start: 'top 85%'
        }
      });
    }

    // 7. Transition Marquees (Scroll-linked horizontal translation)
    const marqueeAboutProjects = document.querySelector('#marquee-about-projects');
    if (marqueeAboutProjects) {
      gsap.to(marqueeAboutProjects, {
        x: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: marqueeAboutProjects,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    const marqueeProjectsSkills = document.querySelector('#marquee-projects-skills');
    if (marqueeProjectsSkills) {
      gsap.to(marqueeProjectsSkills, {
        x: '10%',
        ease: 'none',
        scrollTrigger: {
          trigger: marqueeProjectsSkills,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // 8. Pinned Scroll Storytelling (Top 2 Projects)
    if (window.matchMedia('(min-width: 993px)').matches) {
      const pinnedWrappers = document.querySelectorAll('.project-pinned-wrapper');
      pinnedWrappers.forEach(wrapper => {
        const left = wrapper.querySelector('.project-pinned-left');
        const right = wrapper.querySelector('.project-pinned-right');
        const blocks = right.querySelectorAll('.story-block');
        
        // Pin the left media element as right text scrolls
        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top 15%',
          end: 'bottom bottom',
          pin: left,
          pinSpacing: false,
          invalidateOnRefresh: true
        });
        
        // Highlight active story blocks on scroll
        blocks.forEach((block, idx) => {
          if (idx === 0) return; // Skip intro block
          
          gsap.fromTo(block, { opacity: 0.3 }, {
            opacity: 1,
            scrollTrigger: {
              trigger: block,
              start: 'top 65%',
              end: 'bottom 35%',
              toggleActions: 'play reverse play reverse',
              invalidateOnRefresh: true
            }
          });
        });
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
        cursor.style.backgroundColor = 'rgba(181, 98, 59, 0.12)'; // Terracotta clay translucent fill
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

  /* --- Concept A: Terminal Emulator (Project 1) --- */
  const terminalProjectCard = document.getElementById('terminalProjectCard');
  const projectTerminalBody = document.getElementById('projectTerminalBody');

  if (terminalProjectCard && projectTerminalBody) {
    const projectLogs = [
      { text: 'python query_rag.py --query "security threat"', type: 'prompt' },
      { text: '[QUERY] "security threat"', type: 'info' },
      { text: '[DATABASE] Searching vector index mappings...', type: 'info' },
      { text: '[MATRIX] Similarity: Cosine(Q, D12) = 0.9678', type: 'highlight' },
      { text: '[SUCCESS] Retreived context: "Port scan detected on subnet 10.0..."', type: 'success' },
      { text: 'python run_model_inference.py --batch_size 16', type: 'prompt' },
      { text: '[INFO] Launching Isolation Forest outlier algorithm...', type: 'info' },
      { text: '[WARNING] Outlier score exceeded threshold limit (0.75)', type: 'highlight' },
      { text: '[ALERT] Threat anomaly flagged! IP: 185.220.101.4', type: 'highlight' },
      { text: '[SUCCESS] Logs synchronized with FastAPI threat reporter.', type: 'success' },
    ];

    let pLogIndex = 0;
    let pStreamSpeed = 1500;
    let pLogTimer = null;

    function addProjectLogLine() {
      if (projectTerminalBody.children.length > 5) {
        projectTerminalBody.removeChild(projectTerminalBody.firstChild);
      }

      const log = projectLogs[pLogIndex];
      const div = document.createElement('div');
      div.className = `terminal-line ${log.type === 'prompt' ? 'terminal-prompt' : ''} ${log.type === 'highlight' ? 'highlight' : ''} ${log.type === 'success' ? 'success' : ''}`;
      div.innerText = log.text;
      
      projectTerminalBody.appendChild(div);
      projectTerminalBody.scrollTop = projectTerminalBody.scrollHeight;
      
      pLogIndex = (pLogIndex + 1) % projectLogs.length;
      pLogTimer = setTimeout(addProjectLogLine, pStreamSpeed);
    }

    terminalProjectCard.addEventListener('mouseenter', () => {
      pStreamSpeed = 350;
      clearTimeout(pLogTimer);
      addProjectLogLine();
    });

    terminalProjectCard.addEventListener('mouseleave', () => {
      pStreamSpeed = 1500;
    });

    addProjectLogLine();
  }

  /* --- Concept B: Neural Network Visualizer (Project 2) --- */
  const nnProjectCard = document.getElementById('nnProjectCard');
  const projectNnCanvas = document.getElementById('projectNnCanvas');

  if (nnProjectCard && projectNnCanvas) {
    const pCtx = projectNnCanvas.getContext('2d');
    let pMouseX = null;
    let pMouseY = null;
    let pMouseActive = false;
    let pPulseX = -50;
    let pNodes = [];

    function resizeProjectCanvas() {
      projectNnCanvas.width = nnProjectCard.clientWidth;
      projectNnCanvas.height = nnProjectCard.clientHeight;
      setupProjectNN();
    }

    nnProjectCard.addEventListener('mousemove', (e) => {
      const rect = nnProjectCard.getBoundingClientRect();
      pMouseX = e.clientX - rect.left;
      pMouseY = e.clientY - rect.top;
      pMouseActive = true;
    });

    nnProjectCard.addEventListener('mouseleave', () => {
      pMouseActive = false;
    });

    const pLayers = [3, 4, 4, 2];

    function setupProjectNN() {
      pNodes = [];
      const layerSpacing = projectNnCanvas.width / (pLayers.length + 0.5);
      
      pLayers.forEach((count, lIdx) => {
        const x = layerSpacing * (lIdx + 0.7);
        const ySpacing = projectNnCanvas.height / (count + 1);
        
        for (let nIdx = 0; nIdx < count; nIdx++) {
          pNodes.push({
            x: x,
            y: ySpacing * (nIdx + 1),
            layer: lIdx
          });
        }
      });
    }

    function drawProjectNN() {
      pCtx.clearRect(0, 0, projectNnCanvas.width, projectNnCanvas.height);
      
      if (pNodes.length === 0) setupProjectNN();

      if (pMouseActive) {
        pPulseX += 3.5;
        if (pPulseX > projectNnCanvas.width + 100) pPulseX = -50;
      } else {
        pPulseX += 1.0;
        if (pPulseX > projectNnCanvas.width + 100) pPulseX = -50;
      }

      const isLight = document.documentElement.classList.contains('light-theme');

      // Connections
      for (let i = 0; i < pNodes.length; i++) {
        const n1 = pNodes[i];
        for (let j = 0; j < pNodes.length; j++) {
          const n2 = pNodes[j];
          if (n2.layer === n1.layer + 1) {
            const connectionMid = (n1.x + n2.x) / 2;
            const distToPulse = Math.abs(connectionMid - pPulseX);
            
            if (distToPulse < 40) {
              pCtx.strokeStyle = `rgba(217, 107, 67, ${0.4 + (40 - distToPulse)/40 * 0.6})`;
              pCtx.lineWidth = 1.5;
            } else {
              pCtx.strokeStyle = isLight ? 'rgba(27, 25, 23, 0.12)' : 'rgba(39, 41, 44, 0.4)';
              pCtx.lineWidth = 0.7;
            }
            
            pCtx.beginPath();
            pCtx.moveTo(n1.x, n1.y);
            pCtx.lineTo(n2.x, n2.y);
            pCtx.stroke();
          }
        }
      }

      // Nodes
      pNodes.forEach(node => {
        const distToPulse = Math.abs(node.x - pPulseX);
        let nodeRadius = 6;
        let nodeColor = isLight ? '#DDD5BE' : '#27292C'; // Light sand vs dark iron gray inert node
        let glowRadius = 0;

        if (distToPulse < 30) {
          nodeColor = '#D96B43'; // Burnt copper pulse activated
          nodeRadius = 8;
          glowRadius = (30 - distToPulse) * 0.4;
        } else if (pMouseActive && Math.abs(node.y - pMouseY) < 40 && Math.abs(node.x - pMouseX) < 40) {
          nodeColor = '#4A5849'; // Lichen green hover
          nodeRadius = 7.5;
        }

        if (glowRadius > 0) {
          pCtx.fillStyle = 'rgba(217, 107, 67, 0.18)';
          pCtx.beginPath();
          pCtx.arc(node.x, node.y, nodeRadius + glowRadius, 0, Math.PI * 2);
          pCtx.fill();
        }

        pCtx.fillStyle = nodeColor;
        pCtx.strokeStyle = isLight ? '#EBE5D8' : '#161719'; // Border matching canvas background
        pCtx.lineWidth = 1.2;
        pCtx.beginPath();
        pCtx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.stroke();
      });

      // Overlay text diagnostics in the corner
      pCtx.fillStyle = isLight ? 'rgba(27, 25, 23, 0.55)' : 'rgba(229, 230, 228, 0.45)'; // Cool text readability
      pCtx.font = '9px monospace';
      pCtx.fillText(`Epochs: 148/200`, 15, 20);
      pCtx.fillText(`Loss: 0.041`, 15, 33);
      
      const predictionVal = pMouseActive ? (0.95 + Math.sin(Date.now() * 0.005) * 0.04).toFixed(4) : "0.9841";
      pCtx.fillStyle = '#D96B43'; // Burnt copper metrics
      pCtx.fillText(`Prediction Confidence: ${predictionVal}`, 15, 46);

      requestAnimationFrame(drawProjectNN);
    }

    window.addEventListener('resize', resizeProjectCanvas);
    resizeProjectCanvas();
    requestAnimationFrame(drawProjectNN);
  }

  // =========================================================================
  // --- Project 3: Campus Connect (Doubt Resolver) ---
  // =========================================================================
  window.resolveDoubt = function(item) {
    item.classList.toggle('resolved');
    const btn = item.querySelector('.feed-action-btn');
    if (item.classList.contains('resolved')) {
      btn.innerText = "Resolved";
    } else {
      const cat = item.querySelector('.feed-category').innerText;
      btn.innerText = cat === "LOST & FOUND" ? "Claim" : "Resolve";
    }
  };

  // =========================================================================
  // --- Project 4: Customer Churn Canvas ---
  // =========================================================================
  const churnPanel = document.getElementById('churnPanel');
  const churnCanvas = document.getElementById('churnCanvas');
  if (churnPanel && churnCanvas) {
    const cc = churnCanvas.getContext('2d');
    let ccWidth, ccHeight;
    let ccMouseX = null, ccMouseY = null, ccMouseActive = false;
    let customers = [];

    function initChurn() {
      ccWidth = churnCanvas.width = churnPanel.clientWidth;
      ccHeight = churnCanvas.height = churnPanel.clientHeight;
      customers = [];
      for (let i = 0; i < 40; i++) {
        const isChurn = Math.random() > 0.45;
        customers.push({
          x: Math.random() * (ccWidth - 60) + 30,
          y: Math.random() * (ccHeight - 60) + 30,
          isChurn: isChurn,
          origX: 0, origY: 0
        });
        customers[i].origX = customers[i].x;
        customers[i].origY = customers[i].y;
      }
    }

    churnPanel.addEventListener('mousemove', (e) => {
      const rect = churnCanvas.getBoundingClientRect();
      ccMouseX = e.clientX - rect.left;
      ccMouseY = e.clientY - rect.top;
      ccMouseActive = true;
    });

    churnPanel.addEventListener('mouseleave', () => {
      ccMouseActive = false;
    });

    function drawChurn() {
      cc.clearRect(0, 0, ccWidth, ccHeight);
      const isL = document.documentElement.classList.contains('light-theme');

      // Draw decision boundary line
      cc.strokeStyle = isL ? 'rgba(27, 25, 23, 0.08)' : 'rgba(217, 107, 67, 0.15)';
      cc.setLineDash([4, 4]);
      cc.lineWidth = 1.5;
      cc.beginPath();
      cc.moveTo(0, ccHeight * 0.7);
      cc.bezierCurveTo(ccWidth * 0.4, ccHeight * 0.5, ccWidth * 0.6, ccHeight * 0.3, ccWidth, ccHeight * 0.25);
      cc.stroke();
      cc.setLineDash([]);

      // Draw client nodes
      customers.forEach(c => {
        let x = c.origX;
        let y = c.origY;

        if (ccMouseActive) {
          const dx = ccMouseX - x;
          const dy = ccMouseY - y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 70) {
            const force = (70 - dist) * 0.2;
            x -= (dx / dist) * force;
            y -= (dy / dist) * force;
          }
        }

        cc.fillStyle = c.isChurn ? 'var(--accent-rust)' : 'var(--accent-moss)';
        cc.beginPath();
        cc.arc(x, y, 4.5, 0, Math.PI * 2);
        cc.fill();
      });

      // Local cursor prediction readout
      if (ccMouseActive) {
        cc.strokeStyle = isL ? 'rgba(27, 25, 23, 0.12)' : 'rgba(229, 230, 228, 0.15)';
        cc.lineWidth = 1;
        cc.beginPath();
        cc.arc(ccMouseX, ccMouseY, 70, 0, Math.PI * 2);
        cc.stroke();

        const risk = Math.min(99.9, Math.max(0.1, (ccMouseY / ccHeight) * 100)).toFixed(1);
        cc.fillStyle = isL ? 'rgba(235, 229, 216, 0.96)' : 'rgba(22, 23, 25, 0.95)';
        cc.fillRect(ccMouseX + 15, ccMouseY - 35, 130, 45);
        cc.strokeStyle = 'var(--border-color)';
        cc.strokeRect(ccMouseX + 15, ccMouseY - 35, 130, 45);

        cc.fillStyle = 'var(--text-color)';
        cc.font = '9px monospace';
        cc.fillText(`Model: XGBoost`, ccMouseX + 22, ccMouseY - 22);
        cc.fillStyle = risk > 50 ? 'var(--accent-rust)' : 'var(--accent-moss)';
        cc.fillText(`Local Churn: ${risk}%`, ccMouseX + 22, ccMouseY - 10);
      }

      requestAnimationFrame(drawChurn);
    }

    initChurn();
    requestAnimationFrame(drawChurn);
    window.addEventListener('resize', initChurn);
  }

  // =========================================================================
  // --- Project 5: Threat Hash Table ---
  // =========================================================================
  const hashGrid = document.getElementById('hashGrid');
  const hashConsole = document.getElementById('hashConsole');
  if (hashGrid && hashConsole) {
    const signatures = [
      "0xFC82", "Clean", "Clean", "0x3A21", 
      "Clean", "0x8E12", "Clean", "Clean", 
      "0x9A4E", "Clean", "0xBD22", "Clean",
      "Clean", "0x14E9", "Clean", "Clean"
    ];

    function initHashGrid() {
      hashGrid.innerHTML = '';
      for (let i = 0; i < 16; i++) {
        const sig = signatures[i];
        const isThreat = sig !== "Clean";
        const div = document.createElement('div');
        div.className = `hash-cell ${isThreat ? 'collision' : ''}`;
        div.innerHTML = `
          <span class="hash-index">[${i}]</span>
          <span class="hash-value">${sig}</span>
        `;
        div.addEventListener('mouseenter', () => {
          if (isThreat) {
            hashConsole.innerHTML = `Calculated Hash: <span style="color: var(--accent-rust)">hash("${sig}") % 16 = ${i}</span>. Collision matched. <span style="color: #f44336; font-weight: bold;">[ALERT]</span>`;
            div.style.transform = 'scale(1.06)';
          } else {
            hashConsole.innerHTML = `Calculated Hash: <span style="color: var(--accent-moss)">hash("log_entry") % 16 = ${i}</span>. Slot is clear. [OK]`;
            div.style.transform = 'scale(1.06)';
          }
          div.classList.add('active');
        });
        div.addEventListener('mouseleave', () => {
          hashConsole.innerHTML = "Console Idle. Hover over index slots to trace calculations...";
          div.classList.remove('active');
          div.style.transform = 'none';
        });
        hashGrid.appendChild(div);
      }
    }
    initHashGrid();
  }

  // =========================================================================
  // --- Project 6: ChemXplore (Molecule Canvas + Gauges) ---
  // =========================================================================
  const chemPanel = document.getElementById('chemPanel');
  const chemCanvas = document.getElementById('chemCanvas');
  if (chemPanel && chemCanvas) {
    const ch = chemCanvas.getContext('2d');
    let chWidth, chHeight;
    let chemMouseX = null, chemMouseY = null, chemMouseActive = false;
    let atoms = [];

    const barAbs = document.getElementById('barAbs');
    const barTox = document.getElementById('barTox');
    const barClear = document.getElementById('barClear');
    const barBbb = document.getElementById('barBbb');
    const valAbs = document.getElementById('valAbs');
    const valTox = document.getElementById('valTox');
    const valClear = document.getElementById('valClear');
    const valBbb = document.getElementById('valBbb');

    function initChem() {
      chWidth = chemCanvas.width = chemPanel.clientWidth * 0.6;
      chHeight = chemCanvas.height = chemPanel.clientHeight;
      
      const cx = chWidth / 2;
      const cy = chHeight / 2;
      const r = 45;
      
      atoms = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        atoms.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          label: "C",
          abs: 60 + i * 5,
          tox: 5 + i * 8,
          clear: 80 - i * 10,
          bbb: i % 2 === 0 ? "High" : "Low"
        });
      }
      atoms.push({ x: cx + Math.cos(0) * (r + 30), y: cy + Math.sin(0) * (r + 30), label: "O", abs: 88, tox: 4, clear: 92, bbb: "High" });
      atoms.push({ x: cx + Math.cos(Math.PI) * (r + 30), y: cy + Math.sin(Math.PI) * (r + 30), label: "NH2", abs: 94, tox: 14, clear: 45, bbb: "Low" });
    }

    chemCanvas.addEventListener('mousemove', (e) => {
      const rect = chemCanvas.getBoundingClientRect();
      chemMouseX = e.clientX - rect.left;
      chemMouseY = e.clientY - rect.top;
      chemMouseActive = true;
      scanAtom();
    });

    chemCanvas.addEventListener('mouseleave', () => {
      chemMouseActive = false;
      resetGauges();
    });

    function scanAtom() {
      if (!chemMouseActive) return;
      let nearest = null;
      let minD = 35;
      atoms.forEach(a => {
        const dx = chemMouseX - a.x;
        const dy = chemMouseY - a.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < minD) {
          minD = d;
          nearest = a;
        }
      });

      if (nearest) {
        if (barAbs) { barAbs.style.width = `${nearest.abs}%`; valAbs.innerText = `${nearest.abs}%`; }
        if (barTox) { barTox.style.width = `${nearest.tox}%`; valTox.innerText = `${nearest.tox}%`; }
        if (barClear) { barClear.style.width = `${nearest.clear}%`; valClear.innerText = `${nearest.clear}%`; }
        if (barBbb) { barBbb.style.width = nearest.bbb === "High" ? "85%" : "25%"; valBbb.innerText = nearest.bbb; }
      }
    }

    function resetGauges() {
      if (barAbs) { barAbs.style.width = '0%'; valAbs.innerText = '--'; }
      if (barTox) { barTox.style.width = '0%'; valTox.innerText = '--'; }
      if (barClear) { barClear.style.width = '0%'; valClear.innerText = '--'; }
      if (barBbb) { barBbb.style.width = '0%'; valBbb.innerText = '--'; }
    }

    function drawChem() {
      ch.clearRect(0, 0, chWidth, chHeight);
      const isL = document.documentElement.classList.contains('light-theme');

      ch.strokeStyle = isL ? 'rgba(27, 25, 23, 0.12)' : 'rgba(229, 230, 228, 0.15)';
      ch.lineWidth = 2.5;
      
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        ch.beginPath();
        ch.moveTo(atoms[i].x, atoms[i].y);
        ch.lineTo(atoms[next].x, atoms[next].y);
        ch.stroke();

        if (i % 2 === 0) {
          const innerR = 36;
          const cx = chWidth / 2;
          const cy = chHeight / 2;
          const a1 = (i * Math.PI) / 3;
          const a2 = (next * Math.PI) / 3;
          ch.lineWidth = 1;
          ch.beginPath();
          ch.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR);
          ch.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR);
          ch.stroke();
          ch.lineWidth = 2.5;
        }
      }

      ch.beginPath(); ch.moveTo(atoms[0].x, atoms[0].y); ch.lineTo(atoms[6].x, atoms[6].y); ch.stroke();
      ch.beginPath(); ch.moveTo(atoms[3].x, atoms[3].y); ch.lineTo(atoms[7].x, atoms[7].y); ch.stroke();

      atoms.forEach(a => {
        const isHover = chemMouseActive && Math.sqrt((chemMouseX - a.x)**2 + (chemMouseY - a.y)**2) < 20;
        
        ch.fillStyle = isHover ? 'var(--accent-rust)' : (isL ? '#DDD5BE' : '#161719');
        ch.beginPath();
        ch.arc(a.x, a.y, 11, 0, Math.PI * 2);
        ch.fill();
        ch.strokeStyle = isHover ? 'var(--text-color)' : 'var(--border-color)';
        ch.lineWidth = 1;
        ch.stroke();

        ch.fillStyle = isHover ? '#1B1917' : 'var(--text-color)';
        ch.font = '10px sans-serif';
        ch.textAlign = 'center';
        ch.textBaseline = 'middle';
        ch.fillText(a.label, a.x, a.y);
      });

      requestAnimationFrame(drawChem);
    }

    initChem();
    requestAnimationFrame(drawChem);
    window.addEventListener('resize', initChem);
  }
});

