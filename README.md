# Partilha Sagrada — Pilão de Ouro

Página estática para compartilhamento dos valores a pagar referentes às compras do Terreiro. Cada participante recebe um link direto para os detalhes do seu pedido e o PIX para pagamento.

## Funcionalidades

- **Grade de participantes** com valor individual
- **Modal detalhado** com lista de itens, subtotais e total
- **Chave PIX** com botão de cópia (com fallback para navegadores sem Clipboard API)
- **Link de compartilhamento** — copia a URL `?p={id}` para enviar via WhatsApp
- **Marcar como pago** — persiste no `localStorage` do dispositivo do administrador
- Efeitos visuais temáticos em canvas: estrelas, embers, fagulhas e chamas de vela animadas

## Estrutura

```
div-compras/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── data/
    │   └── store.js           # dados: participantes, itens, preços, chave PIX
    ├── utils/
    │   ├── formatter.js       # formatBRL(), phone(), initials()
    │   └── paidStore.js       # persistência de pagamentos via localStorage
    ├── components/
    │   ├── PersonCard.js      # card clicável da grade
    │   ├── ItemList.js        # tabela de itens do modal
    │   └── PixModal.js        # modal: itens, PIX, compartilhar, marcar pago
    ├── effects/
    │   ├── ParticleSystem.js  # canvas: estrelas e fagulhas flutuantes
    │   └── CandleEffect.js    # canvas: chamas de vela animadas
    └── app.js                 # inicialização e deep link (?p=)
```

## Deploy

O site é 100% estático — sem build, sem dependências de servidor.

**Vercel (recomendado):** conecte o repositório no [dashboard da Vercel](https://vercel.com/new). Nenhuma configuração adicional é necessária.

**Local:** abra `index.html` diretamente no navegador.

## Deep Links

Cada participante tem uma URL única:

```
https://seusite.vercel.app/?p=fran-miojo
https://seusite.vercel.app/?p=leonardo
https://seusite.vercel.app/?p=kessy
```

O modal da pessoa abre automaticamente ao acessar o link.

## Marcar como pago

O estado "pago" é salvo no `localStorage` do dispositivo. Funciona apenas no dispositivo onde o administrador acessa — sem backend.
