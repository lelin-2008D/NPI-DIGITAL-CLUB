/**
 * Animations Module
 * Handcrafts custom high-performance scroll triggers, magnetic physics,
 * custom cursor lerping, loader progress, and generative canvas background.
 */

export class Animations {
  /**
   * Initialize all animations
   */
  static init() {
    this.initCursor();
    this.initPreloader();
    this.initScrollObservers();
    this.initHeroCanvas();
    this.initMagneticButtons();
  }

  /**
   * 1. Luxury Loader Progress Simulation
   */
  static initPreloader() {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loader-bar');
    const perc = document.getElementById('loader-perc');
    if (!loader || !bar || !perc) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const logo = loader.querySelector('.loader-logo-img');
    let progress = 0;
    let complete = false;
    let frameId = null;
    const startedAt = performance.now();
    const minimumVisibleMs = reducedMotion ? 120 : 520;
    const hardFallbackMs = 3500;

    const setProgress = (value) => {
      progress = Math.max(progress, Math.min(100, value));
      bar.style.width = `${progress}%`;
      perc.textContent = `${Math.floor(progress)}%`;
    };

    const finish = () => {
      if (complete) return;
      complete = true;
      cancelAnimationFrame(frameId);
      setProgress(100);
      loader.classList.add('complete');

      const revealDelay = reducedMotion ? 40 : 260;
      window.setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');
        document.body.classList.add('app-ready');
        this.triggerInitialReveals();
      }, revealDelay);
    };

    const waitForLogo = new Promise((resolve) => {
      if (!logo || logo.complete) {
        resolve();
        return;
      }
      logo.addEventListener('load', resolve, { once: true });
      logo.addEventListener('error', resolve, { once: true });
    });

    const waitForWindow = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
        return;
      }
      window.addEventListener('load', resolve, { once: true });
    });

    const tick = () => {
      if (complete) return;
      const elapsed = performance.now() - startedAt;
      const eased = 1 - Math.exp(-elapsed / 720);
      setProgress(Math.min(92, eased * 92));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    Promise.race([
      Promise.all([waitForLogo, waitForWindow]),
      new Promise((resolve) => window.setTimeout(resolve, hardFallbackMs))
    ]).then(() => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minimumVisibleMs - elapsed);
      window.setTimeout(finish, remaining);
    });
  }

  /**
   * Trigger elements visible on load
   */
  static triggerInitialReveals() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('active');
    }
    const heroLogoCol = document.querySelector('.hero-logo-col');
    if (heroLogoCol) {
      heroLogoCol.classList.add('active');
    }
  }

  /**
   * 2. Custom Cinematic Cursor with linear interpolation (lerp)
   */
  static initCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = cursor?.querySelector('.cursor-dot');
    const ring = cursor?.querySelector('.cursor-ring');
    if (!cursor || !dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Custom requestAnimationFrame loop for 60fps cursor physics
    const updateCursor = () => {
      // Lerp calculations for smooth trailing ring
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      currentX += (mouseX - currentX) * 0.9;
      currentY += (mouseY - currentY) * 0.9;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      dot.style.left = `${currentX}px`;
      dot.style.top = `${currentY}px`;

      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    // Setup Hover Listeners for all clickable elements
    const updateHoverables = () => {
      const hoverTargets = document.querySelectorAll('a, button, [onclick], .gallery-item-card, .project-img-link');
      hoverTargets.forEach((target) => {
        // Prevent duplicate bindings
        if (target.dataset.cursorBound) return;
        target.dataset.cursorBound = 'true';

        target.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });
      });
    };

    updateHoverables();
    
    // Listen for DOM changes to bind new elements
    const observer = new MutationObserver(updateHoverables);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * 3. Custom Scroll Observers & Counters Animation
   */
  static initScrollObservers() {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-blur, .reveal-mask-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // If stat section, trigger counter increments
          if (entry.target.querySelector('.stat-num')) {
            const stats = entry.target.querySelectorAll('.stat-num');
            stats.forEach(stat => Animations.animateCounter(stat));
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });

    // Separately observe parent stat section
    const statsContainer = document.getElementById('stats');
    if (statsContainer) {
      revealObserver.observe(statsContainer);
    }
  }

  /**
   * Animated Numbers Counter Logic
   * @param {Element} el - The stat counter element
   */
  static animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    let start = 0;
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + suffix;
    }, stepDuration);
  }

  /**
   * 4. Generative Canvas Interactive Background inside Hero
   */
  static initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 70;
    const connectionDist = 120;
    let mouse = { x: null, y: null };

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Create particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.dataset.theme === 'dark';
      const particleRgb = isDark ? '214, 185, 140' : '29, 78, 216';

      // Draw lines
      for (let i = 0; i < maxParticles; i++) {
        const p1 = particles[i];
        
        // Move particle
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Boundary collision
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle dot
        ctx.fillStyle = `rgba(${particleRgb}, 0.25)`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect to neighbors
        for (let j = i + 1; j < maxParticles; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.08;
            ctx.strokeStyle = `rgba(${particleRgb}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw lines from mouse pointer to particles
        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = p1.x - mouse.x;
          const dyMouse = p1.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < 180) {
            const alphaMouse = (1 - distMouse / 180) * 0.12;
            ctx.strokeStyle = `rgba(${particleRgb}, ${alphaMouse})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 5. Magnetic Hover Physics for Gold Buttons
   */
  static initMagneticButtons() {
    const updateMagnetic = () => {
      const btns = document.querySelectorAll('.btn-magnetic');
      btns.forEach((btn) => {
        if (btn.dataset.magneticBound) return;
        btn.dataset.magneticBound = 'true';

        const btnText = btn.querySelector('.btn-text') || btn;

        btn.addEventListener('mousemove', (e) => {
          const bound = btn.getBoundingClientRect();
          const x = e.clientX - bound.left - bound.width / 2;
          const y = e.clientY - bound.top - bound.height / 2;

          // Pull the text layer towards mouse cursor (limits max translate distance to 12px)
          btnText.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
          btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
          btn.style.borderColor = 'var(--border-accent)';
        });

        btn.addEventListener('mouseleave', () => {
          btnText.style.transform = 'translate(0px, 0px)';
          btn.style.transform = 'translate(0px, 0px)';
          btn.style.borderColor = '';
        });
      });
    };

    updateMagnetic();
    
    // Listen for DOM changes to bind new elements
    const observer = new MutationObserver(updateMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });
  }
}
