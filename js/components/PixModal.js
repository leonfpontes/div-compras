/**
 * PixModal — full-screen modal showing a person's itemised bill and PIX key.
 * Appends itself to <body> on construction and manages open/close state.
 *
 * @param {string}    pixKey     raw digit string, e.g. "16991091234"
 * @param {PaidStore} paidStore
 * @param {function(person: object): void} onPaidToggle  called after paid state changes
 */
class PixModal {
  constructor(pixKey, paidStore, onPaidToggle) {
    this._pixKey       = pixKey;
    this._paidStore    = paidStore;
    this._onPaidToggle = onPaidToggle;
    this._person       = null;
    this._element      = this._buildShell();
    document.body.appendChild(this._element);
    this._bindEvents();
  }

  // ─── Private: DOM construction ────────────────────────────────────────────

  _buildShell() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modal-person-name');

    overlay.innerHTML = `
      <div class="modal-panel">
        <button class="modal-close" aria-label="Fechar">&times;</button>
        <h2 class="modal-title" id="modal-person-name"></h2>
        <div class="modal-header-divider" aria-hidden="true"></div>
        <div class="modal-items-container"></div>
        <div class="modal-total-row">
          <span>Total a pagar</span>
          <strong class="modal-total-value"></strong>
        </div>
        <div class="pix-section">
          <p class="pix-label">Chave PIX &mdash; Telefone</p>
          <p class="pix-instruction">
            Abra o app do seu banco, acesse o PIX e cole a chave abaixo.
          </p>
          <div class="pix-key-row">
            <code class="pix-key-value"></code>
            <button class="pix-copy-btn">Copiar</button>
          </div>
          <p class="pix-feedback" aria-live="polite"></p>
        </div>
        <div class="modal-actions">
          <button class="share-btn" aria-label="Copiar link de compartilhamento">
            <span class="share-btn-icon" aria-hidden="true">🔗</span> Compartilhar link
          </button>
          <button class="mark-paid-btn"></button>
        </div>
        <p class="actions-feedback" aria-live="polite"></p>
      </div>
    `;

    return overlay;
  }

  // ─── Private: event wiring ────────────────────────────────────────────────

  _bindEvents() {
    this._element.querySelector('.modal-close')
      .addEventListener('click', () => this.close());

    this._element.addEventListener('click', e => {
      if (e.target === this._element) this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this._element.classList.contains('is-open')) {
        this.close();
      }
    });

    this._element.querySelector('.pix-copy-btn')
      .addEventListener('click', () => this._copyPix());

    this._element.querySelector('.share-btn')
      .addEventListener('click', () => this._shareLink());

    this._element.querySelector('.mark-paid-btn')
      .addEventListener('click', () => this._togglePaid());
  }

  // ─── Private: clipboard copy with graceful fallback ───────────────────────

  _copyPix() {
    const btn      = this._element.querySelector('.pix-copy-btn');
    const feedback = this._element.querySelector('.pix-feedback');

    const onSuccess = () => {
      btn.textContent = 'Copiado ✓';
      btn.classList.add('copied');
      feedback.textContent = 'Chave copiada! Cole no campo PIX do seu banco.';
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
        feedback.textContent = '';
      }, 3500);
    };

    const onFallback = () => {
      // execCommand fallback for file:// and older browsers
      const ta = document.createElement('textarea');
      ta.value = this._pixKey;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        onSuccess();
      } catch {
        feedback.textContent = `Copie manualmente: ${this._pixKey}`;
      } finally {
        document.body.removeChild(ta);
      }
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(this._pixKey).then(onSuccess).catch(onFallback);
    } else {
      onFallback();
    }
  }

  // ─── Private: share link ─────────────────────────────────────────────────

  _shareLink() {
    if (!this._person) return;

    const url      = `${location.origin}${location.pathname}?p=${this._person.id}`;
    const btn      = this._element.querySelector('.share-btn');
    const feedback = this._element.querySelector('.actions-feedback');

    const onSuccess = () => {
      btn.classList.add('copied');
      btn.innerHTML = '<span aria-hidden="true">✓</span> Link copiado!';
      feedback.textContent = 'Cole no WhatsApp e envie para ' + this._person.name + '.';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<span class="share-btn-icon" aria-hidden="true">🔗</span> Compartilhar link';
        feedback.textContent = '';
      }, 3500);
    };

    const onFallback = () => {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); onSuccess(); }
      catch { feedback.textContent = url; }
      finally { document.body.removeChild(ta); }
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(onSuccess).catch(onFallback);
    } else {
      onFallback();
    }
  }

  // ─── Private: toggle paid ────────────────────────────────────────────────

  _togglePaid() {
    if (!this._person) return;

    const id       = this._person.id;
    const feedback = this._element.querySelector('.actions-feedback');

    if (this._paidStore.isPaid(id)) {
      this._paidStore.markUnpaid(id);
      feedback.textContent = 'Marcação removida.';
    } else {
      this._paidStore.markPaid(id);
      feedback.textContent = this._person.name + ' marcado(a) como pago ✓';
    }

    this._refreshPaidUI();
    this._onPaidToggle(this._person);

    setTimeout(() => { feedback.textContent = ''; }, 3500);
  }

  _refreshPaidUI() {
    if (!this._person) return;
    const paid = this._paidStore.isPaid(this._person.id);
    const btn  = this._element.querySelector('.mark-paid-btn');
    btn.textContent = paid ? 'Desfazer pagamento' : 'Marcar como pago ✓';
    btn.classList.toggle('is-paid', paid);
    this._element.querySelector('.modal-panel').classList.toggle('panel--paid', paid);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /** @param {{ id:string, name:string, items:Array }} person */
  open(person) {
    this._person = person;
    const total  = person.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

    this._element.querySelector('.modal-title').textContent       = person.name;
    this._element.querySelector('.modal-total-value').textContent = Formatter.BRL(total);
    this._element.querySelector('.pix-key-value').textContent     = Formatter.phone(this._pixKey);
    this._element.querySelector('.pix-feedback').textContent      = '';
    this._element.querySelector('.actions-feedback').textContent  = '';

    const container = this._element.querySelector('.modal-items-container');
    container.innerHTML = '';
    container.appendChild(new ItemList(person.items).element);

    this._refreshPaidUI();

    this._element.classList.add('is-open');
    document.body.classList.add('modal-open');
    this._element.querySelector('.modal-close').focus();
  }

  close() {
    this._element.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }
}
