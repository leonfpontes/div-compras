/**
 * ParticleSystem — fullscreen canvas animation of floating stars, gold embers
 * and fire sparks drifting upward.  Exposes burst(x, y) for on-demand effects.
 */
class ParticleSystem {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this._canvas     = canvas;
    this._ctx        = canvas.getContext('2d');
    this._particles  = [];
    this._frameId    = null;
    this._onResize   = () => this._resize();

    this._resize();
    window.addEventListener('resize', this._onResize);
    this._populate();
    this._loop();
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  _resize() {
    this._canvas.width  = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  _populate() {
    const density = 5000; // px² per particle
    const count   = Math.floor((this._canvas.width * this._canvas.height) / density);
    for (let i = 0; i < count; i++) {
      this._particles.push(this._spawn(true));
    }
  }

  /**
   * @param {boolean} scatter  spread randomly across the canvas on first load
   * @returns {object} particle
   */
  _spawn(scatter = false) {
    const roll = Math.random();
    const type = roll < 0.55 ? 'star' : roll < 0.80 ? 'ember' : 'spark';
    return {
      type,
      x:          scatter ? Math.random() * this._canvas.width : Math.random() * this._canvas.width,
      y:          scatter ? Math.random() * this._canvas.height : this._canvas.height + 5,
      vx:         (Math.random() - 0.5) * 0.28,
      vy:         -(Math.random() * 0.55 + 0.08),
      size:       type === 'star' ? Math.random() * 2.8 + 0.8 : Math.random() * 2.2 + 1.0,
      alpha:      scatter ? Math.random() * 0.7 : 0,
      alphaSpeed: Math.random() * 0.005 + 0.002,
      peakAlpha:  Math.random() * 0.75 + 0.30,
      rising:     true,
      color:      this._colorFor(type),
    };
  }

  _colorFor(type) {
    const palettes = {
      star:  ['#ffffff', '#fff6d0', '#fde8a0', '#e8d060'],
      ember: ['#c9a84c', '#e0c060', '#d4a030', '#f0d060'],
      spark: ['#ff9040', '#f06820', '#e05010', '#ff7030'],
    };
    const pal = palettes[type];
    return pal[Math.floor(Math.random() * pal.length)];
  }

  _drawStar(ctx, x, y, size) {
    const spikes = 4;
    const outer  = size;
    const inner  = size * 0.38;
    let   rot    = -Math.PI / 2;
    const step   = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x + Math.cos(rot) * outer, y + Math.sin(rot) * outer);
    for (let i = 0; i < spikes; i++) {
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * inner, y + Math.sin(rot) * inner);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * outer, y + Math.sin(rot) * outer);
    }
    ctx.closePath();
    ctx.fill();
  }

  _loop() {
    const ctx = this._ctx;
    const w   = this._canvas.width;
    const h   = this._canvas.height;

    ctx.clearRect(0, 0, w, h);

    for (let i = this._particles.length - 1; i >= 0; i--) {
      const p = this._particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.rising) {
        p.alpha = Math.min(p.alpha + p.alphaSpeed, p.peakAlpha);
        if (p.alpha >= p.peakAlpha) p.rising = false;
      } else {
        p.alpha -= p.alphaSpeed * 0.6;
      }

      if (p.y < -10 || p.alpha <= 0) {
        this._particles[i] = this._spawn(false);
        continue;
      }
      if (p.x < -5)    p.x = w + 5;
      if (p.x > w + 5) p.x = -5;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle   = p.color;

      if (p.type === 'star') {
        this._drawStar(ctx, p.x, p.y, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    this._frameId = requestAnimationFrame(() => this._loop());
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Emit a radial burst of gold sparks at (x, y) — called on card click.
   * @param {number} x  viewport X
   * @param {number} y  viewport Y
   * @param {number} [count=18]
   */
  burst(x, y, count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 3.5 + 1.2;
      const p     = this._spawn(false);
      p.x         = x;
      p.y         = y;
      p.vx        = Math.cos(angle) * speed;
      p.vy        = Math.sin(angle) * speed;
      p.size      = Math.random() * 3.5 + 1.5;
      p.type      = 'spark';
      p.color     = this._colorFor(Math.random() < 0.5 ? 'spark' : 'ember');
      p.alpha     = 0.9;
      p.peakAlpha = 0.9;
      p.rising    = false;
      this._particles.push(p);
    }
  }

  destroy() {
    cancelAnimationFrame(this._frameId);
    window.removeEventListener('resize', this._onResize);
  }
}
