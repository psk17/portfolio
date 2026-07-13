document.addEventListener('DOMContentLoaded', () => {
  
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

      // Connections
      for (let i = 0; i < pNodes.length; i++) {
        const n1 = pNodes[i];
        for (let j = 0; j < pNodes.length; j++) {
          const n2 = pNodes[j];
          if (n2.layer === n1.layer + 1) {
            const connectionMid = (n1.x + n2.x) / 2;
            const distToPulse = Math.abs(connectionMid - pPulseX);
            
            if (distToPulse < 40) {
              pCtx.strokeStyle = `rgba(46, 125, 50, ${0.4 + (40 - distToPulse)/40 * 0.6})`;
              pCtx.lineWidth = 1.5;
            } else {
              pCtx.strokeStyle = 'rgba(58, 54, 50, 0.15)';
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
        let nodeColor = '#A09D95'; // Soft grey inert node
        let glowRadius = 0;

        if (distToPulse < 30) {
          nodeColor = '#2E7D32'; // Vibrant green pulse activated
          nodeRadius = 8;
          glowRadius = (30 - distToPulse) * 0.4;
        } else if (pMouseActive && Math.abs(node.y - pMouseY) < 40 && Math.abs(node.x - pMouseX) < 40) {
          nodeColor = '#556652'; // Muted moss green hover
          nodeRadius = 7.5;
        }

        if (glowRadius > 0) {
          pCtx.fillStyle = 'rgba(46, 125, 50, 0.2)';
          pCtx.beginPath();
          pCtx.arc(node.x, node.y, nodeRadius + glowRadius, 0, Math.PI * 2);
          pCtx.fill();
        }

        pCtx.fillStyle = nodeColor;
        pCtx.strokeStyle = '#F4F1EA'; // Border matching light background
        pCtx.lineWidth = 1.2;
        pCtx.beginPath();
        pCtx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.stroke();
      });

      // Overlay text diagnostics in the corner
      pCtx.fillStyle = 'rgba(46, 45, 42, 0.55)'; // Dark slate with transparency for light background readability
      pCtx.font = '9px monospace';
      pCtx.fillText(`Epochs: 148/200`, 15, 20);
      pCtx.fillText(`Loss: 0.041`, 15, 33);
      
      const predictionVal = pMouseActive ? (0.95 + Math.sin(Date.now() * 0.005) * 0.04).toFixed(4) : "0.9841";
      pCtx.fillStyle = '#2E7D32'; // Vibrant green
      pCtx.fillText(`Prediction Confidence: ${predictionVal}`, 15, 46);

      requestAnimationFrame(drawProjectNN);
    }

    window.addEventListener('resize', resizeProjectCanvas);
    resizeProjectCanvas();
    requestAnimationFrame(drawProjectNN);
  }
});

