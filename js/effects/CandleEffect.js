/**
 * CandleEffect — draws animated candle flames at the bottom of the viewport.
 * The number of candles scales with viewport width.
 */
class CandleEffect {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this._canvas   = canvas;
    this._ctx      = canvas.getContext('2d');
    this._time     = 0;
    this._candles  = [];
    this._frameId  = null;
    this._onResize = () => { this._resize(); this._initCandles(); };

    this._resize();
    this._initCandles();
    window.addEventListener('resize', this._onResize);
    this._loop();
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  _resize() {
    this._canvas.width  = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  _initCandles() {
    const w     = this._canvas.width;
    const h     = this._canvas.height;
    const count = Math.max(3, Math.min(9, Math.floor(w / 150)));

    // Use golden-ratio phase spacing so no two candles flicker in sync
    this._candles = Array.from({ length: count }, (_, i) => ({
      x:       (w / (count + 1)) * (i + 1),
      baseY:   h - 6,
      phase:   (i * 2.39996) % (Math.PI * 2),   // golden angle
      candleH: 48 + Math.random() * 22,
      candleW: 9  + Math.random() * 4,
      flameH:  30 + Math.random() * 16,
    }));
  }

  _drawCandle(c, t) {
    const ctx = this._ctx;
    const { x, baseY, candleH, candleW } = c;
    const bx  = x - candleW / 2;
    const by  = baseY - candleH;

    // body — vertical gradient simulating a rounded wax cylinder
    const bodyGrad = ctx.createLinearGradient(bx, 0, bx + candleW, 0);
    bodyGrad.addColorStop(0,    '#a09070');
    bodyGrad.addColorStop(0.30, '#e8d5b0');
    bodyGrad.addColorStop(0.60, '#d4c09a');
    bodyGrad.addColorStop(1,    '#80705a');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(bx, by, candleW, candleH, 2);
    } else {
      ctx.rect(bx, by, candleW, candleH);
    }
    ctx.fill();

    // wax drip highlight at the top
    ctx.fillStyle = 'rgba(240, 225, 190, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x - candleW * 0.15, by + 1, candleW * 0.28, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // wick — slight curve from base to tip
    const wickTipX = x + Math.sin(t * 2.4 + c.phase) * 1.8;
    const wickTipY = by - 7;

    ctx.strokeStyle = '#3a2010';
    ctx.lineWidth   = 1.5;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(x, by);
    ctx.quadraticCurveTo(x, by - 3, wickTipX, wickTipY);
    ctx.stroke();

    this._drawFlame(x, wickTipX, wickTipY, t, c);
  }

  _drawFlame(baseX, wickX, wickY, t, c) {
    const ctx     = this._ctx;
    const { phase, flameH } = c;

    // compound flicker: two sine waves at irrational frequencies
    const flicker = Math.sin(t * 5.3  + phase) * 0.13
                  + Math.sin(t * 8.71 + phase * 0.7) * 0.07;
    const h    = flameH * (0.83 + flicker);
    const w    = flameH * 0.26 * (0.92 + Math.sin(t * 3.1 + phase) * 0.08);
    const sway = Math.sin(t * 1.9 + phase) * 3.5;
    const cx   = wickX + sway;
    const tip  = { x: cx, y: wickY - h };

    // ambient halo
    const haloR    = h * 0.9;
    const haloGrad = ctx.createRadialGradient(cx, wickY - h * 0.35, 0, cx, wickY - h * 0.35, haloR);
    haloGrad.addColorStop(0,   'rgba(255, 200, 80, 0.11)');
    haloGrad.addColorStop(0.5, 'rgba(255, 120, 30, 0.05)');
    haloGrad.addColorStop(1,   'rgba(200, 60,  0, 0)');

    ctx.beginPath();
    ctx.arc(cx, wickY - h * 0.35, haloR, 0, Math.PI * 2);
    ctx.fillStyle = haloGrad;
    ctx.fill();

    // outer flame body
    const outerGrad = ctx.createLinearGradient(cx, wickY, cx, tip.y);
    outerGrad.addColorStop(0,    'rgba(180, 40,  10, 0.95)');
    outerGrad.addColorStop(0.45, 'rgba(220, 90,  20, 0.85)');
    outerGrad.addColorStop(0.80, 'rgba(255, 180, 60, 0.50)');
    outerGrad.addColorStop(1,    'rgba(255, 220, 100, 0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(baseX, wickY + 2);
    ctx.bezierCurveTo(
      baseX + w,        wickY - h * 0.30,
      cx    + w * 0.55, wickY - h * 0.68,
      tip.x, tip.y
    );
    ctx.bezierCurveTo(
      cx    - w * 0.55, wickY - h * 0.68,
      baseX - w,        wickY - h * 0.30,
      baseX, wickY + 2
    );
    ctx.fillStyle = outerGrad;
    ctx.fill();
    ctx.restore();

    // inner bright core
    const iH        = h * 0.54;
    const iW        = w * 0.44;
    const innerGrad = ctx.createLinearGradient(cx, wickY, cx, wickY - iH);
    innerGrad.addColorStop(0,   'rgba(255, 255, 215, 0.90)');
    innerGrad.addColorStop(0.5, 'rgba(255, 240, 150, 0.65)');
    innerGrad.addColorStop(1,   'rgba(255, 200, 80,  0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(baseX, wickY);
    ctx.bezierCurveTo(
      baseX + iW,        wickY - iH * 0.25,
      cx    + iW * 0.40, wickY - iH * 0.66,
      cx, wickY - iH
    );
    ctx.bezierCurveTo(
      cx    - iW * 0.40, wickY - iH * 0.66,
      baseX - iW,        wickY - iH * 0.25,
      baseX, wickY
    );
    ctx.fillStyle = innerGrad;
    ctx.fill();
    ctx.restore();
  }

  _loop() {
    this._time += 0.018;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._candles.forEach(c => this._drawCandle(c, this._time));
    this._frameId = requestAnimationFrame(() => this._loop());
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  destroy() {
    cancelAnimationFrame(this._frameId);
    window.removeEventListener('resize', this._onResize);
  }
}
