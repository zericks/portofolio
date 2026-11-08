/**
 * SPACE CANVAS BACKGROUND
 * Dynamic interactive cosmic starfield with twinkling stars, depth layers,
 * parallax mouse movement, and glowing meteor streaks.
 */

(function () {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let meteors = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let lastMeteorTime = 0;

  const CONFIG = {
    starCount: 220,
    colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#00d2ff'],
    speedFactor: 0.15,
  };

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 3 + 0.5; // depth layer (0.5 to 3.5)
      this.size = (Math.random() * 1.5 + 0.5) * (this.z / 2);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.03 + 0.005;
      this.twinkleFactor = Math.random() * Math.PI;
    }

    update() {
      this.twinkleFactor += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinkleFactor) * 0.35;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 1) this.alpha = 1;

      // Slow orbital drift
      this.y -= (0.15 * this.z) * CONFIG.speedFactor;
      if (this.y < 0) {
        this.y = height;
        this.x = Math.random() * width;
      }
    }

    draw() {
      // Mouse parallax shift
      const parallaxX = this.x + (mouse.x * this.z * 15);
      const parallaxY = this.y + (mouse.y * this.z * 15);

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.z > 2 ? 8 : 0;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.arc(parallaxX, parallaxY, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Meteor {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * width * 1.2;
      this.y = y !== undefined ? y : Math.random() * (height * 0.4);
      this.length = Math.random() * 90 + 60;
      this.speed = Math.random() * 9 + 8;
      this.angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 deg
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.opacity = 1;
      this.thickness = Math.random() * 2 + 1.2;
      this.decay = Math.random() * 0.015 + 0.01;
      this.color = Math.random() > 0.4 ? '#00d2ff' : '#ffffff';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
    }

    draw() {
      if (this.opacity <= 0) return;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      gradient.addColorStop(0, 'rgba(0, 210, 255, 0)');
      gradient.addColorStop(0.7, `rgba(112, 214, 255, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

      ctx.save();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Glowing head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.thickness * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Re-init stars on resize
    stars = [];
    const count = Math.min(CONFIG.starCount, Math.floor((width * height) / 5000));
    for (let i = 0; i < count; i++) {
      stars.push(new Star());
    }
  }

  function handleMouseMove(e) {
    mouse.targetX = (e.clientX / width) - 0.5;
    mouse.targetY = (e.clientY / height) - 0.5;
  }

  function spawnMeteor() {
    meteors.push(new Meteor());
  }

  function handlePointerClick(e) {
    // Spawn custom meteor targeting near click
    meteors.push(new Meteor(e.clientX - 100, e.clientY - 150));
  }

  function loop(timestamp) {
    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Render stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    // Auto spawn meteor every 3 - 6 seconds
    if (!lastMeteorTime) lastMeteorTime = timestamp;
    if (timestamp - lastMeteorTime > 3500 + Math.random() * 2500) {
      spawnMeteor();
      lastMeteorTime = timestamp;
    }

    // Update & draw meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      meteors[i].update();
      meteors[i].draw();
      if (meteors[i].opacity <= 0 || meteors[i].x > width + 100 || meteors[i].y > height + 100) {
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('click', handlePointerClick, { passive: true });

  resize();
  requestAnimationFrame(loop);
})();

