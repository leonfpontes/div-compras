/**
 * ResumoPage — prestação de contas completa da Vaquinha da Macumba.
 * Lê os dados de Store e o status de pagamento do PaidStore (localStorage).
 * Página somente-leitura; não requer autenticação.
 */
class ResumoPage {
  constructor() {
    this._paidStore = new PaidStore();
    this._particles = null;
    this._init();
  }

  _init() {
    this._particles = new ParticleSystem(document.getElementById('canvas-bg'));
    this._render();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  _personTotal(person) {
    return person.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  }

  /**
   * Para cada item da nota fiscal, calcula quanto já foi pago
   * somando os itens das pessoas que estão marcadas como pagas.
   * Resolve as diferenças entre labels abreviados (pessoas) e completos (compras).
   * @returns {Object} purchaseLabel → valor pago (R$)
   */
  _computePaidByItem() {
    const LABEL_MAP = {
      'Garfo de Exu':    'Garfo de Exu sem pé 10cm',
      'Punhal':          'Punhal tamanho 2',
      'Conjunto de Ração': 'Conjunto Ração Feminino',
    };
    const paid = {};
    Store.people.forEach(person => {
      if (!this._paidStore.isPaid(person.id)) return;
      person.items.forEach(item => {
        const key = LABEL_MAP[item.label] || item.label;
        paid[key] = (paid[key] || 0) + item.qty * item.unitPrice;
      });
    });
    return paid;
  }

  // ── Render ───────────────────────────────────────────────────────────────

  _render() {
    const root   = document.getElementById('resumo-root');
    const people = Store.people;

    const grandTotal   = people.reduce((s, p) => s + this._personTotal(p), 0);
    const paidTotal    = people
      .filter(p => this._paidStore.isPaid(p.id))
      .reduce((s, p) => s + this._personTotal(p), 0);
    const pendingTotal = grandTotal - paidTotal;
    const paidCount    = people.filter(p => this._paidStore.isPaid(p.id)).length;

    root.innerHTML = `
      <div class="resumo-container">

        <!-- ── Resumo financeiro ── -->
        <div class="resumo-stats" role="region" aria-label="Resumo financeiro">
          <div class="stat-card stat-card--total">
            <span class="stat-label">Total da vaquinha</span>
            <strong class="stat-value">${Formatter.BRL(grandTotal)}</strong>
          </div>
          <div class="stat-card stat-card--paid">
            <span class="stat-label">Arrecadado 🤑</span>
            <strong class="stat-value">${Formatter.BRL(paidTotal)}</strong>
          </div>
          <div class="stat-card stat-card--pending">
            <span class="stat-label">Pendente 😅</span>
            <strong class="stat-value">${Formatter.BRL(pendingTotal)}</strong>
          </div>
          <div class="stat-card stat-card--count">
            <span class="stat-label">Pagaram</span>
            <strong class="stat-value">${paidCount} <span class="stat-of">de ${people.length}</span></strong>
          </div>
        </div>

        <!-- ── Barra de progresso ── -->
        <div class="resumo-progress" role="progressbar"
             aria-valuenow="${Math.round((paidTotal / grandTotal) * 100)}"
             aria-valuemin="0" aria-valuemax="100"
             aria-label="Progresso da arrecadação">
          <div class="progress-bar" style="width: ${(paidTotal / grandTotal) * 100}%"></div>
          <span class="progress-label">${Math.round((paidTotal / grandTotal) * 100)}% arrecadado</span>
        </div>

        <!-- ── Botão atualizar ── -->
        <div class="resumo-toolbar">
          <button class="resumo-refresh-btn" id="resumo-refresh">
            ↻ Atualizar status
          </button>
          <a href="/" class="resumo-back-btn">← Voltar ao painel</a>
        </div>

        <!-- ── Lista de pessoas ── -->
        <ul class="resumo-list" id="resumo-list" role="list">
          ${people.map(p => this._renderPersonRow(p)).join('')}
        </ul>

        <!-- ── Nota fiscal completa ── -->
        ${this._renderPurchasesTable()}

      </div>
    `;

    this._bindEvents(root);
  }

  _renderPurchasesTable() {
    const purchases  = Store.purchases;
    const paidByItem = this._computePaidByItem();
    const grandTotal = purchases.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const grandPaid  = purchases.reduce((s, i) => s + Math.min(i.qty * i.unitPrice, paidByItem[i.label] || 0), 0);
    const grandPct   = grandTotal > 0 ? (grandPaid / grandTotal) * 100 : 0;

    const rows = purchases.map(item => {
      const total   = item.qty * item.unitPrice;
      const itemPaid = Math.min(total, paidByItem[item.label] || 0);
      const pct     = total > 0 ? Math.min(100, (itemPaid / total) * 100) : 0;
      const done    = pct >= 99.9;
      const qtyFmt  = Number.isInteger(item.qty)
        ? item.qty
        : item.qty.toLocaleString('pt-BR') + ' kg';

      return `<tr class="nf-row${done ? ' nf-row--done' : ''}">
        <td class="nf-item-cell">
          <span class="nf-item-name">${item.label}</span>
          <div class="nf-bar" role="progressbar"
               aria-valuenow="${Math.round(pct)}"
               aria-valuemin="0" aria-valuemax="100"
               title="${Math.round(pct)}% pago">
            <div class="nf-bar-fill" style="width:${pct}%"></div>
          </div>
        </td>
        <td class="num">${qtyFmt}</td>
        <td class="num">${Formatter.BRL(item.unitPrice)}</td>
        <td class="num">${Formatter.BRL(total)}</td>
      </tr>`;
    }).join('');

    return `
      <section class="nota-fiscal" aria-label="Nota fiscal das compras">
        <div class="nota-fiscal-header">
          <div>
            <h2 class="nota-fiscal-title">🛒 O que foi comprado</h2>
            <p class="nota-fiscal-subtitle">Lista completa — itens riscados já foram 100% pagos</p>
          </div>
          <div class="nota-fiscal-summary">
            <span class="nfs-label">Pago da nota</span>
            <strong class="nfs-value">${Formatter.BRL(grandPaid)}</strong>
            <span class="nfs-of">de ${Formatter.BRL(grandTotal)}</span>
          </div>
        </div>
        <div class="nf-grand-bar" role="progressbar"
             aria-valuenow="${Math.round(grandPct)}"
             aria-valuemin="0" aria-valuemax="100">
          <div class="nf-grand-bar-fill" style="width:${grandPct}%"></div>
          <span class="nf-grand-bar-label">${Math.round(grandPct)}% da nota pago</span>
        </div>
        <table class="item-table nota-fiscal-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="num">Qtde</th>
              <th class="num">Unit.</th>
              <th class="num">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total geral das compras</td>
              <td class="num">${Formatter.BRL(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </section>
    `;
  }

  _renderPersonRow(person) {
    const total  = this._personTotal(person);
    const paid   = this._paidStore.isPaid(person.id);
    const initials = person.name.split(' ')
      .slice(0, 2).map(w => w[0].toUpperCase()).join('');

    const itemRows = person.items
      .map(item => {
        const sub = item.qty * item.unitPrice;
        return `<tr>
          <td>${item.label}</td>
          <td class="num">${item.qty}</td>
          <td class="num">${Formatter.BRL(item.unitPrice)}</td>
          <td class="num">${Formatter.BRL(sub)}</td>
        </tr>`;
      })
      .join('');

    return `
      <li class="resumo-person ${paid ? 'resumo-person--paid' : 'resumo-person--pending'}"
          data-id="${person.id}">
        <button class="resumo-person-header" aria-expanded="false"
                aria-controls="items-${person.id}">
          <span class="rp-avatar">${initials}</span>
          <span class="rp-name">${person.name}</span>
          <span class="rp-badge ${paid ? 'rp-badge--paid' : 'rp-badge--pending'}">
            ${paid ? 'Pago ✓' : 'Pendente'}
          </span>
          <span class="rp-total">${Formatter.BRL(total)}</span>
          <span class="rp-chevron" aria-hidden="true">▾</span>
        </button>
        <div class="resumo-person-items" id="items-${person.id}" hidden>
          <table class="item-table resumo-item-table">
            <thead>
              <tr>
                <th>Item</th>
                <th class="num">Qtde</th>
                <th class="num">Unit.</th>
                <th class="num">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total da cota</td>
                <td class="num">${Formatter.BRL(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </li>
    `;
  }

  _bindEvents(root) {
    // toggle expand/collapse de itens
    root.querySelectorAll('.resumo-person-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const panel    = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
        btn.querySelector('.rp-chevron').textContent = expanded ? '▾' : '▴';
      });
    });

    // botão atualizar — re-renderiza com dados frescos do localStorage
    document.getElementById('resumo-refresh').addEventListener('click', () => {
      this._paidStore = new PaidStore();
      this._render();
    });
  }
}

// ── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => new ResumoPage());
