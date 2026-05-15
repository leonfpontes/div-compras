/**
 * Store — single source of truth for all purchase data.
 * All monetary values are stored as plain Number (BRL).
 */
const Store = Object.freeze({
  PIX_KEY: '16991091234',

  people: Object.freeze([
    {
      id: 'felipe-liceras',
      name: 'Felipe Liceras',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',        qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'camila-contrera',
      name: 'Camila Contrera',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',        qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'franciele-alves',
      name: 'Franciele Alves',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',        qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'alexandre',
      name: 'Alexandre',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'kessy',
      name: 'Kessy',
      items: [
        { label: 'Garfo de Exu',    qty: 3,  unitPrice: 3.90 },
        { label: 'Punhal',          qty: 3,  unitPrice: 4.90 },
        { label: 'Cabaça 4',        qty: 1,  unitPrice: 39.90 },
        { label: 'Esfera de Ferro', qty: 10, unitPrice: 4.00 },
      ],
    },
    {
      id: 'fran-miojo',
      name: 'Fran Miojo',
      items: [
        { label: 'Garfo de Exu',      qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',            qty: 7, unitPrice: 4.90 },
        { label: 'Cabaça 4',          qty: 1, unitPrice: 39.90 },
        { label: 'Bacia de Ágata 40', qty: 1, unitPrice: 77.90 },
        { label: 'Pemba Amarela',     qty: 3, unitPrice: 1.00 },
        { label: 'Pemba Azul Claro',  qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Azul Escuro', qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Branca',      qty: 4, unitPrice: 1.00 },
        { label: 'Pemba Lilás',       qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Marrom',      qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Preta',       qty: 2, unitPrice: 1.00 },
        { label: 'Pemba Rosa',        qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Vermelha',    qty: 3, unitPrice: 1.00 },
        { label: 'Pemba Verde',       qty: 2, unitPrice: 1.00 },
      ],
    },
    {
      id: 'ana-bia',
      name: 'Ana Bia',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',        qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'joao-paulo',
      name: 'João Paulo',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',        qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'barbara-cardozo',
      name: 'Bárbara Cardozo',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
      ],
    },
    {
      id: 'isadora',
      name: 'Isadora',
      items: [
        { label: 'Garfo de Exu',  qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',        qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',      qty: 1, unitPrice: 39.90 },
      ],
    },
    {
      id: 'leonardo',
      name: 'Leonardo',
      items: [
        { label: 'Garfo de Exu',             qty: 3, unitPrice: 3.90 },
        { label: 'Punhal',                   qty: 3, unitPrice: 4.90 },
        { label: 'Cabaça 4',                 qty: 1, unitPrice: 39.90 },
        { label: 'Bacia de Ágata 36',        qty: 1, unitPrice: 57.90 },
        { label: 'Conjunto de Ração',        qty: 1, unitPrice: 39.90 },
        { label: 'Cabaça 0',                 qty: 3, unitPrice: 4.00 },
        { label: 'Pemba Amarela',            qty: 3, unitPrice: 1.00 },
        { label: 'Pemba Azul Claro',         qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Azul Escuro',        qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Branca',             qty: 4, unitPrice: 1.00 },
        { label: 'Pemba Lilás',              qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Marrom',             qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Preta',              qty: 2, unitPrice: 1.00 },
        { label: 'Pemba Rosa',               qty: 1, unitPrice: 1.00 },
        { label: 'Pemba Vermelha',           qty: 3, unitPrice: 1.00 },
        { label: 'Pemba Verde',              qty: 2, unitPrice: 1.00 },
      ],
    },
    {
      id: 'tchuca',
      name: 'Tchuca',
      items: [
        { label: 'Gamela Oval Grande', qty: 1, unitPrice: 59.90 },
      ],
    },
  ]),

  /**
   * Nota fiscal completa — fonte: Compra_Pilão_Ouro.csv
   * qty pode ser decimal (ex: Banha de Ori = 0,175 kg)
   */
  purchases: Object.freeze([
    { label: 'Bacia de Ágata 36',         qty: 2,     unitPrice: 57.90  },
    { label: 'Conjunto Ração Feminino',    qty: 1,     unitPrice: 39.90  },
    { label: 'Gamela Oval Grande',         qty: 1,     unitPrice: 59.90  },
    { label: 'Punhal tamanho 2',           qty: 31,    unitPrice: 4.90   },
    { label: 'Esfera de Ferro',            qty: 10,    unitPrice: 4.00   },
    { label: 'Cabaça 4',                   qty: 10,    unitPrice: 39.90  },
    { label: 'Ossum',                      qty: 20,    unitPrice: 1.40   },
    { label: 'Yerossum pc 20g',            qty: 2,     unitPrice: 10.00  },
    { label: 'Efum',                       qty: 6,     unitPrice: 7.00   },
    { label: 'Pemba Amarela',              qty: 6,     unitPrice: 1.00   },
    { label: 'Pemba Azul Claro',           qty: 2,     unitPrice: 1.00   },
    { label: 'Pemba Azul Escuro',          qty: 2,     unitPrice: 1.00   },
    { label: 'Pemba Branca',               qty: 8,     unitPrice: 1.00   },
    { label: 'Pemba Lilás',                qty: 2,     unitPrice: 1.00   },
    { label: 'Pemba Marrom',               qty: 2,     unitPrice: 1.00   },
    { label: 'Pemba Preta',                qty: 4,     unitPrice: 1.00   },
    { label: 'Pemba Rosa',                 qty: 2,     unitPrice: 1.00   },
    { label: 'Pemba Vermelha',             qty: 6,     unitPrice: 1.00   },
    { label: 'Pemba Verde',                qty: 4,     unitPrice: 1.00   },
    { label: 'Bacia de Ágata 40',          qty: 1,     unitPrice: 77.90  },
    { label: 'Garfo de Exu sem pé 10cm',   qty: 44,    unitPrice: 3.90   },
    { label: 'Banha de Ori',               qty: 0.175, unitPrice: 170.00 },
    { label: 'Cabaça 0',                   qty: 3,     unitPrice: 4.00   },
  ]),
});
