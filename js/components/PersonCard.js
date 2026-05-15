/**
 * PersonCard — renders a single person's card in the grid.
 * Emits a click callback with the person object and click coordinates
 * so the caller can trigger visual effects at the exact position.
 *
 * @param {{ id:string, name:string, items:Array }} person
 * @param {function(person: object, x: number, y: number): void} onOpen
 * @param {PaidStore} paidStore
 */
class PersonCard {
  constructor(person, onOpen, paidStore) {
    this._person    = person;
    this._onOpen    = onOpen;
    this._paidStore = paidStore;
    this.element    = this._build();
  }

  _total() {
    return this._person.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  }

  _build() {
    const card = document.createElement('article');
    card.className = 'person-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Abrir partilha de ${this._person.name}`);

    const initials = Formatter.initials(this._person.name);
    const total    = this._total();
    const count    = this._person.items.length;

    card.innerHTML = `
      <div class="card-glow" aria-hidden="true"></div>
      <div class="card-avatar" aria-hidden="true">${initials}</div>
      <h2 class="card-name">${this._person.name}</h2>
      <div class="card-divider" aria-hidden="true"></div>
      <p class="card-items-count">${count} ${count === 1 ? 'item' : 'itens'}</p>
      <div class="card-total">${Formatter.BRL(total)}</div>
      <div class="paid-badge" aria-label="Pagamento confirmado">Pago ✓</div>
      <button class="card-btn" tabindex="-1">Abrir minha parte</button>
    `;

    // Spotlight glow follows the cursor inside the card
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.querySelector('.card-glow').style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(201,168,76,0.14) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.querySelector('.card-glow').style.background = '';
    });

    card.addEventListener('click', e => this._onOpen(this._person, e.clientX, e.clientY));

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const rect = card.getBoundingClientRect();
        this._onOpen(this._person, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });

    this._applyPaidState();
    return card;
  }

  /** Reflects current paid state on the card without rebuilding the DOM. */
  refresh() {
    this._applyPaidState();
  }

  _applyPaidState() {
    const paid = this._paidStore.isPaid(this._person.id);
    this.element.classList.toggle('card--paid', paid);
    const badge = this.element.querySelector('.paid-badge');
    if (badge) badge.style.display = paid ? 'block' : 'none';
  }
}
