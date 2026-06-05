document.addEventListener('DOMContentLoaded', () => {
  
  /* --- Intersection Observer for Scroll Reveals --- */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Offset the trigger point slightly upwards
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

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
});
