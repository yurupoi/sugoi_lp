/**
 * Gemini 3.8 Flash LP - Interactive Neural Synapse & Particle Canvas
 * High-performance 60fps dynamic particle network with mouse interaction and energy surges.
 */

class NeuralParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 110;
    this.maxDistance = 140;
    this.mouse = { x: null, y: null, radius: 180 };
    this.surges = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY + window.scrollY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    );
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Adjust particle count based on screen size
    if (this.width < 768) {
      this.particleCount = 55;
      this.maxDistance = 100;
    } else {
      this.particleCount = 120;
      this.maxDistance = 140;
    }
  }

  createParticles() {
    this.particles = [];
    const colors = [
      'rgba(147, 51, 234, ',   // Deep Purple
      'rgba(59, 130, 246, ',   // Gemini Electric Blue
      'rgba(6, 182, 212, ',    // Cyber Cyan
      'rgba(245, 158, 11, '    // Flash Gold / Amber
    ];

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        baseRadius: Math.random() * 2 + 1.2,
        radius: Math.random() * 2 + 1.2,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }
  }

  triggerSurge(x, y) {
    this.surges.push({
      x: x || this.width / 2,
      y: y || (window.scrollY + window.innerHeight * 0.4),
      radius: 5,
      maxRadius: Math.max(this.width, 600),
      speed: 18,
      alpha: 0.8
    });
  }

  updateAndDraw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw energy shockwaves
    for (let s = this.surges.length - 1; s >= 0; s--) {
      const surge = this.surges[s];
      surge.radius += surge.speed;
      surge.alpha = Math.max(0, 0.8 * (1 - surge.radius / surge.maxRadius));

      if (surge.alpha <= 0) {
        this.surges.splice(s, 1);
        continue;
      }

      const grad = this.ctx.createRadialGradient(
        surge.x, surge.y, Math.max(0, surge.radius - 40),
        surge.x, surge.y, surge.radius
      );
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(0.8, `rgba(147, 51, 234, ${surge.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(59, 130, 246, ${surge.alpha * 0.8})`);

      this.ctx.beginPath();
      this.ctx.arc(surge.x, surge.y, surge.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
    }

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Pulse radius
      p.pulseAngle += p.pulseSpeed;
      p.radius = p.baseRadius + Math.sin(p.pulseAngle) * 0.8;

      // Bounce off borders
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse attraction / deflection
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      // Draw particle dot with subtle glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = `${p.colorPrefix}0.9)`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset shadow for lines
    }

    // Connect particles within proximity
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const lineAlpha = (1 - dist / this.maxDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.updateAndDraw();
    requestAnimationFrame(() => this.animate());
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.particleNetwork = new NeuralParticleNetwork('neuralCanvas');
  window.triggerEnergySurge = (x, y) => {
    if (window.particleNetwork) {
      window.particleNetwork.triggerSurge(x, y);
    }
  };
});
