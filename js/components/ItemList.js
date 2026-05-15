/**
 * ItemList — renders a styled table of purchased items with a total footer.
 * Used inside PixModal.
 */
class ItemList {
  /**
   * @param {Array<{label:string, qty:number, unitPrice:number}>} items
   */
  constructor(items) {
    this._items = items;
    this.element = this._build();
  }

  _total() {
    return this._items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  }

  _build() {
    const table = document.createElement('table');
    table.className = 'item-table';

    const rows = this._items
      .map(item => {
        const lineTotal = item.qty * item.unitPrice;
        return `<tr>
          <td>${item.label}</td>
          <td>${item.qty}</td>
          <td>${Formatter.BRL(item.unitPrice)}</td>
          <td>${Formatter.BRL(lineTotal)}</td>
        </tr>`;
      })
      .join('');

    table.innerHTML = `
      <thead>
        <tr>
          <th>Item</th>
          <th>Qtde</th>
          <th>Unit.</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total da sua cota</td>
          <td>${Formatter.BRL(this._total())}</td>
        </tr>
      </tfoot>
    `;

    return table;
  }
}
