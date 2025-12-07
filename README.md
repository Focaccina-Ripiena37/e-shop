# 🛍️ Angular Shop

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Benvenuto nel progetto **Angular Shop**! Un'applicazione e-commerce moderna sviluppata con Angular v21 e Material Design.

## 🚀 Funzionalità

- **🛒 Catalogo Prodotti**: Visualizzazione prodotti con filtri e ordinamento.
- **🔍 Dettaglio Prodotto**: Pagina dedicata per ogni prodotto con specifiche e prezzi.
- **📦 Checkout Smart**: Modulo d'ordine reattivo con validazione istantanea.
- **🛡️ Sicurezza**: Route guard per proteggere il checkout (mock auth).
- **📡 Mock API**: Backend simulato locale per prodotti e ordini.

## 🛠️ Installazione & Avvio

Segui questi passaggi per avviare il progetto in locale.

### Prerequisiti
Assicurati di avere **Node.js** installato.

### 1. Avvia il Backend Mock
Apri un terminale e vai nella cartella `shop-mock-api`:

```bash
cd shop-mock-api
npm install
npm run dev
```
> Il server risponderà su `http://localhost:3000`

### 2. Avvia il Frontend
Apri un **secondo terminale** nella cartella principale:

```bash
npm install
npm start
```

Visita **http://localhost:4200** e goditi lo shopping! 🎉

## 🏗️ Build per Produzione

Per compilare il progetto per la produzione (senza SSR/Prerendering):

```bash
npm run build
```
I file saranno generati in `dist/shop/browser`.

---
*Progetto sviluppato per il corso di Sistemi Web - UNIFE*
