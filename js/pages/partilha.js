/**
 * PartilhaPage — renders a single person's bill page.
 * Reads ?p= from the URL; shows only that person's data.
 * No other participant's information is accessible from this page.
 */
class PartilhaPage {
  constructor() {
    this._particles = null;
    this._init();
  }

  _init() {
    // Vercel rewrite keeps the original pathname (/p/:id) visible to the browser,
    // so location.search is empty. Fall back to extracting the id from the path.
    const params   = new URLSearchParams(location.search);
    const id       = params.get('p') || location.pathname.replace(/^\/p\//, '') || null;
    const person   = id ? Store.people.find(p => p.id === id) : null;

    if (!person) {
      this._renderNotFound();
      return;
    }

    document.title = `${person.name} — Partilha Sagrada`;
    this._setupEffects();
    this._render(person);
  }

  // ─── Effects ──────────────────────────────────────────────────────────────

  _setupEffects() {
    this._particles = new ParticleSystem(document.getElementById('canvas-bg'));
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  _render(person) {
    const total = person.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

    const root = document.getElementById('partilha-root');
    root.innerHTML = `
      <header class="site-header">
        <span class="header-symbol" aria-hidden="true">✦</span>
        <p class="partilha-greeting">Sua parte na partilha</p>
        <h1 class="partilha-name">${person.name}</h1>
        <div class="header-divider" aria-hidden="true"></div>
      </header>

      <main class="partilha-main">
        <section class="partilha-card" aria-label="Detalhes da partilha">

          <h2 class="partilha-section-title">Itens</h2>
          <div id="partilha-items"></div>

          <div class="partilha-total-row">
            <span>Total a pagar</span>
            <strong class="partilha-total-value">${Formatter.BRL(total)}</strong>
          </div>

          <div class="pix-section">
            <p class="pix-label">Chave PIX &mdash; Telefone</p>
            <p class="pix-instruction">
              Abra o app do seu banco, acesse o PIX e cole a chave abaixo.
            </p>
            <div class="pix-key-row">
              <code class="pix-key-value" id="pix-key-display"></code>
              <button class="pix-copy-btn" id="pix-copy-btn">Copiar</button>
            </div>
            <p class="pix-feedback" aria-live="polite" id="pix-feedback"></p>
          </div>

        </section>
      </main>
    `;

    // inject ItemList
    document.getElementById('partilha-items')
      .appendChild(new ItemList(person.items).element);

    // display PIX key
    document.getElementById('pix-key-display').textContent =
      Formatter.phone(Store.PIX_KEY);

    // wire copy button
    document.getElementById('pix-copy-btn')
      .addEventListener('click', () => this._copyPix());
  }

  _renderNotFound() {
    const root = document.getElementById('partilha-root');
    root.innerHTML = `
      <div class="partilha-not-found">
        <span class="header-symbol" aria-hidden="true">✦</span>
        <h1>Partilha não encontrada</h1>
        <p>O link pode estar incorreto. Solicite um novo link ao responsável.</p>
      </div>
    `;
  }

  // ─── PIX copy ─────────────────────────────────────────────────────────────

  _copyPix() {
    const btn      = document.getElementById('pix-copy-btn');
    const feedback = document.getElementById('pix-feedback');

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
      const ta = document.createElement('textarea');
      ta.value = Store.PIX_KEY;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); onSuccess(); }
      catch { feedback.textContent = `Copie manualmente: ${Formatter.phone(Store.PIX_KEY)}`; }
      finally { document.body.removeChild(ta); }
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(Store.PIX_KEY).then(onSuccess).catch(onFallback);
    } else {
      onFallback();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new PartilhaPage());
