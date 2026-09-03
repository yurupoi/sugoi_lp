/**
 * Gemini 3.8 Flash LP - Main Application Orchestration
 * HUD Telemetry counters, Scroll reveal animations, Sound controls, Quickstart copy
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSoundToggle();
  initTelemetryCounters();
  initScrollReveal();
  initQuickstartCopy();
  initMobileMenu();
});

// 1. Dynamic Navbar Glass Effect
function initNavbarScroll() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// 2. Sound Toggle UI
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!window.soundEngine) return;
    const isMuted = window.soundEngine.toggleMute();
    soundBtn.innerHTML = isMuted
      ? '<span class="icon">🔇</span><span>音声 OFF</span>'
      : '<span class="icon">🔊</span><span>音声 ON</span>';
    soundBtn.classList.toggle('active', !isMuted);
  });
}

// 3. Telemetry HUD Counters
function initTelemetryCounters() {
  const counters = [
    { id: 'hud-tps', target: 248, suffix: ' tps', decimals: 0 },
    { id: 'hud-ttft', target: 82, suffix: ' ms', decimals: 0 },
    { id: 'hud-ctx', target: 1000000, suffix: ' tokens', decimals: 0, formatLocale: true },
    { id: 'hud-benchmark', target: 92.4, suffix: '%', decimals: 1 }
  ];

  let animated = false;
  const hudElement = document.querySelector('.hero-telemetry-hud');

  const startCount = () => {
    if (animated) return;
    animated = true;

    counters.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const duration = 1600;
      const startTime = performance.now();

      const updateVal = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = item.target * ease;

        let formatted = item.decimals > 0 ? current.toFixed(item.decimals) : Math.round(current).toString();
        if (item.formatLocale) {
          formatted = Math.round(current).toLocaleString();
        }

        el.textContent = formatted + item.suffix;

        if (progress < 1) {
          requestAnimationFrame(updateVal);
        }
      };

      requestAnimationFrame(updateVal);
    });
  };

  if (hudElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCount();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(hudElement);
  } else {
    startCount();
  }
}

// 4. Scroll Reveal via IntersectionObserver
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

// 5. Quickstart Copy Code Snippet
function initQuickstartCopy() {
  const copyButtons = document.querySelectorAll('.copy-code-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetCode = document.getElementById(targetId);
      if (!targetCode) return;

      navigator.clipboard.writeText(targetCode.textContent.trim()).then(() => {
        const origText = btn.innerHTML;
        btn.innerHTML = '✔ コピー完了！';
        btn.classList.add('copied');
        if (window.soundEngine) window.soundEngine.playSuccess();

        setTimeout(() => {
          btn.innerHTML = origText;
          btn.classList.remove('copied');
        }, 2200);
      });
    });
  });

  // Quickstart Tab Switching (cURL / Python / Node)
  const qsTabs = document.querySelectorAll('.qs-tab-btn');
  qsTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      qsTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.qs-code-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      const activePanel = document.getElementById(`qs-panel-${lang}`);
      if (activePanel) activePanel.classList.add('active');

      if (window.soundEngine) window.soundEngine.playClick();
    });
  });
}

// 6. Mobile Hamburger Menu
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      menuToggle.classList.toggle('open');
      if (window.soundEngine) window.soundEngine.playClick();
    });

    // Close on navigation link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        menuToggle.classList.remove('open');
      });
    });
  }
}
