/**
 * App — root orchestrator.
 * Instantiates all effects, the modal, and renders every PersonCard.
 */
class App {
  constructor() {
    this._particles = null;
    this._candles   = null;
    this._modal     = null;
    this._paidStore = new PaidStore();
    this._cards     = new Map(); // id → PersonCard
    this._init();
  }

  _init() {
    this._setupEffects();
    this._modal = new PixModal(Store.PIX_KEY, this._paidStore, person => {
      const card = this._cards.get(person.id);
      if (card) card.refresh();
    });
    this._renderCards();
    this._handleDeepLink();
  }

  _setupEffects() {
    this._particles = new ParticleSystem(document.getElementById('canvas-bg'));
    this._candles   = new CandleEffect(document.getElementById('canvas-candles'));
  }

  _renderCards() {
    const grid = document.getElementById('cards-grid');

    Store.people.forEach((person, index) => {
      const card = new PersonCard(person, (p, x, y) => {
        this._triggerBurst(x, y);
        this._modal.open(p);
      }, this._paidStore);

      // staggered entrance animation
      card.element.style.animationDelay = `${index * 0.07}s`;
      grid.appendChild(card.element);
      this._cards.set(person.id, card);
    });
  }

  /** Opens the modal for a person matching the ?p= query param, if present. */
  _handleDeepLink() {
    const id     = new URLSearchParams(location.search).get('p');
    const person = id && Store.people.find(p => p.id === id);
    if (person) {
      // slight delay so canvas effects are initialised first
      setTimeout(() => this._modal.open(person), 120);
    }
  }

  /**
   * Spawn DOM-based golden spark burst at the click position.
   * Each spark is a tiny div driven by a CSS custom-property animation.
   * @param {number} x  viewport X
   * @param {number} y  viewport Y
   */
  _triggerBurst(x, y) {
    const count  = 16;
    const colors = ['#c9a84c', '#e0c060', '#f07030', '#ff9040', '#ffffff', '#d4a030'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const dist  = 38 + Math.random() * 42;
      const dx    = Math.cos(angle) * dist;
      const dy    = Math.sin(angle) * dist;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = 4 + Math.random() * 4;

      const spark = document.createElement('div');
      spark.className = 'burst-spark';
      spark.style.cssText = [
        `left:${x}px`,
        `top:${y}px`,
        `width:${size}px`,
        `height:${size}px`,
        `background:${color}`,
        `box-shadow:0 0 ${size * 2}px ${color}`,
        `--dx:${dx}px`,
        `--dy:${dy}px`,
      ].join(';');

      document.body.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new App());
