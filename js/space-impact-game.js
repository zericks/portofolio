/**
 * RETRO SPACE IMPACT GAME (ARDUINO NANO SIMULATION)
 * Inspired by Zerick's "Game Space Impact Menggunakan Arduino Nano"
 * Pixel LCD aesthetic, Asteroids, Player Ship, Laser Blasters, 8-Bit Web Audio
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playExplosion() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }
}

class SpaceImpactSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = 400;
    this.height = this.canvas.height = 200;

    this.sfx = new SoundFX();
    this.state = 'TITLE'; // TITLE, PLAYING, PAUSED, GAMEOVER
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('space_impact_hs') || '0', 10);
    this.lives = 3;

    this.player = {
      x: 30,
      y: 90,
      width: 24,
      height: 14,
      speed: 3.5,
      isShooting: false,
      lastShot: 0
    };

    this.keys = {};
    this.lasers = [];
    this.asteroids = [];
    this.particles = [];
    this.lastAsteroidSpawn = 0;
    this.animationId = null;

    this.initControls();
    this.render();
  }

  initControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (this.state === 'PLAYING') e.preventDefault();
      }
      if (e.key === ' ' || e.key === 'Enter') {
        if (this.state === 'TITLE' || this.state === 'GAMEOVER') {
          this.sfx.init();
          this.startGame();
        }
      }
      if (e.key.toLowerCase() === 'p') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Touch / UI buttons
    const bindBtn = (id, keyName) => {
      const el = document.getElementById(id);
      if (!el) return;
      const press = (ev) => {
        ev.preventDefault();
        this.sfx.init();
        this.keys[keyName] = true;
      };
      const release = (ev) => {
        ev.preventDefault();
        this.keys[keyName] = false;
      };
      el.addEventListener('mousedown', press);
      el.addEventListener('mouseup', release);
      el.addEventListener('touchstart', press, { passive: false });
      el.addEventListener('touchend', release, { passive: false });
    };

    bindBtn('game-up', 'ArrowUp');
    bindBtn('game-down', 'ArrowDown');
    bindBtn('game-left', 'ArrowLeft');
    bindBtn('game-right', 'ArrowRight');
    bindBtn('game-fire', ' ');

    const pauseBtn = document.getElementById('game-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePause();
      });
    }

    const startBtn = document.getElementById('game-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.sfx.init();
        this.startGame();
      });
    }

    const soundToggle = document.getElementById('game-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.sfx.muted = !this.sfx.muted;
        soundToggle.innerHTML = this.sfx.muted ? '<i class="fas fa-volume-mute"></i> MUTE' : '<i class="fas fa-volume-up"></i> SFX';
      });
    }
  }

  startGame() {
    this.sfx.init();
    this.state = 'PLAYING';
    this.score = 0;
    this.lives = 3;
    this.player.x = 30;
    this.player.y = this.height / 2 - 7;
    this.lasers = [];
    this.asteroids = [];
    this.particles = [];
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
    }
  }

  shoot() {
    const now = Date.now();
    if (now - this.player.lastShot > 180) {
      this.lasers.push({
        x: this.player.x + this.player.width,
        y: this.player.y + this.player.height / 2 - 1,
        width: 8,
        height: 3,
        speed: 7
      });
      this.player.lastShot = now;
      this.sfx.playLaser();
    }
  }

  spawnAsteroid() {
    const size = Math.random() * 12 + 10;
    this.asteroids.push({
      x: this.width + 20,
      y: Math.random() * (this.height - size - 20) + 10,
      size: size,
      speed: Math.random() * 2 + 1.8 + (this.score / 500),
      hp: size > 16 ? 2 : 1
    });
  }

  createExplosion(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20
      });
    }
    this.sfx.playExplosion();
  }

  update() {
    if (this.state !== 'PLAYING') return;

    // Movement
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      this.player.y -= this.player.speed;
    }
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      this.player.y += this.player.speed;
    }
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.player.x -= this.player.speed;
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.player.x += this.player.speed;
    }
    if (this.keys[' ']) {
      this.shoot();
    }

    // Bounds
    if (this.player.y < 5) this.player.y = 5;
    if (this.player.y > this.height - this.player.height - 5) this.player.y = this.height - this.player.height - 5;
    if (this.player.x < 5) this.player.x = 5;
    if (this.player.x > this.width - 60) this.player.x = this.width - 60;

    // Update lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].x += this.lasers[i].speed;
      if (this.lasers[i].x > this.width) {
        this.lasers.splice(i, 1);
      }
    }

    // Spawn asteroids
    const now = Date.now();
    if (now - this.lastAsteroidSpawn > Math.max(700, 1500 - this.score * 2)) {
      this.spawnAsteroid();
      this.lastAsteroidSpawn = now;
    }

    // Update asteroids & collision with lasers
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const ast = this.asteroids[i];
      ast.x -= ast.speed;

      // Laser collision
      for (let j = this.lasers.length - 1; j >= 0; j--) {
        const l = this.lasers[j];
        if (
          l.x < ast.x + ast.size &&
          l.x + l.width > ast.x &&
          l.y < ast.y + ast.size &&
          l.y + l.height > ast.y
        ) {
          this.lasers.splice(j, 1);
          ast.hp--;
          if (ast.hp <= 0) {
            this.createExplosion(ast.x + ast.size / 2, ast.y + ast.size / 2, 10);
            this.score += 25;
            this.asteroids.splice(i, 1);
            if (this.score > this.highScore) {
              this.highScore = this.score;
              localStorage.setItem('space_impact_hs', this.highScore.toString());
            }
            break;
          }
        }
      }

      // Player collision
      if (
        ast.x < this.player.x + this.player.width &&
        ast.x + ast.size > this.player.x &&
        ast.y < this.player.y + this.player.height &&
        ast.y + ast.size > this.player.y
      ) {
        this.createExplosion(this.player.x + 10, this.player.y + 7, 20);
        this.lives--;
        this.asteroids.splice(i, 1);

        if (this.lives <= 0) {
          this.state = 'GAMEOVER';
          this.sfx.playGameOver();
        }
        continue;
      }

      // Offscreen remove
      if (ast.x + ast.size < -10) {
        this.asteroids.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    // Clear with retro green LCD background
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle LCD pixel grid effect
    ctx.fillStyle = 'rgba(4, 120, 87, 0.2)';
    for (let y = 0; y < this.height; y += 4) {
      ctx.fillRect(0, y, this.width, 1);
    }

    const pixelColor = '#a7f3d0';

    if (this.state === 'TITLE') {
      ctx.fillStyle = pixelColor;
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SPACE IMPACT ARDUINO', this.width / 2, 60);

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('PORTED FROM ARDUINO NANO', this.width / 2, 85);
      ctx.fillText('PRESS [SPACE] OR GO BUTTON', this.width / 2, 125);
      ctx.fillText(`HI-SCORE: ${this.highScore}`, this.width / 2, 160);
      return;
    }

    if (this.state === 'GAMEOVER') {
      ctx.fillStyle = pixelColor;
      ctx.font = '18px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', this.width / 2, 70);
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`FINAL SCORE: ${this.score}`, this.width / 2, 105);
      ctx.fillText(`HI-SCORE: ${this.highScore}`, this.width / 2, 130);
      ctx.fillText('PRESS [SPACE] TO REPLAY', this.width / 2, 165);
      return;
    }

    // Draw HUD
    ctx.fillStyle = pixelColor;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE:${this.score}`, 10, 14);
    ctx.textAlign = 'center';
    ctx.fillText(`HI:${this.highScore}`, this.width / 2, 14);
    ctx.textAlign = 'right';
    let livesStr = 'LIVES:';
    for (let l = 0; l < this.lives; l++) livesStr += ' ▲';
    ctx.fillText(livesStr, this.width - 10, 14);

    // Draw Player Ship (Pixel Retro Style)
    ctx.fillStyle = pixelColor;
    const px = Math.floor(this.player.x);
    const py = Math.floor(this.player.y);
    ctx.fillRect(px, py + 4, 14, 6);
    ctx.fillRect(px + 14, py + 5, 8, 4);
    ctx.fillRect(px + 22, py + 6, 4, 2);
    ctx.fillRect(px + 4, py, 6, 4);
    ctx.fillRect(px + 4, py + 10, 6, 4);

    // Draw Lasers
    ctx.fillStyle = '#6ee7b7';
    for (let l of this.lasers) {
      ctx.fillRect(Math.floor(l.x), Math.floor(l.y), l.width, l.height);
    }

    // Draw Asteroids (Chunky Pixel Rocks)
    ctx.fillStyle = pixelColor;
    for (let ast of this.asteroids) {
      const ax = Math.floor(ast.x);
      const ay = Math.floor(ast.y);
      const s = Math.floor(ast.size);
      ctx.fillRect(ax + 2, ay, s - 4, s);
      ctx.fillRect(ax, ay + 2, s, s - 4);
      ctx.clearRect(ax + 4, ay + 4, 2, 2);
    }

    // Draw Particles
    for (let p of this.particles) {
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
    }

    // Draw Pause Message
    if (this.state === 'PAUSED') {
      ctx.fillStyle = 'rgba(6, 78, 59, 0.7)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = pixelColor;
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('- PAUSED -', this.width / 2, this.height / 2);
    }
  }

  render() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.render());
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.spaceImpactApp = new SpaceImpactSimulator('space-impact-canvas');
});
