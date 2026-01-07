# 📚 Progetto di Sistemi Web - AA 2025/2026

## Specifiche Progetto E-Shop

---

## 1️⃣ Informazioni Generali

### Tipologia Prova
**Progetto individuale full-stack** (frontend + backend)

### Tecnologie Principali

| Ambito | Tecnologia |
|--------|-----------|
| **Frontend** | Angular, TypeScript |
| **Backend** | Ruby on Rails (modalità API) |
| **Autenticazione** | OpenID Connect / OAuth2 (preferibile)<br>oppure login con credenziali gestito dal backend |

### Descrizione Progetto

Lo studente parte da un'applicazione Angular di "shop online" sviluppata a lezione/lab e la completa trasformandola in una **web app full-stack** con:

- ✅ Backend reale in Ruby on Rails
- ✅ Carrello persistente
- ✅ Autenticazione reale (non mockata)
- ✅ Almeno una funzionalità avanzata a scelta

---

## 2️⃣ Obiettivi Formativi

Al termine del progetto lo studente dovrà dimostrare di saper:

1. **Progettare e sviluppare un backend REST** in Ruby on Rails, con modello dati coerente, validazioni e gestione degli errori

2. **Integrare un frontend Angular** con un backend reale, sostituendo mock/fake con chiamate HTTP verso API REST

3. **Implementare un flusso di autenticazione** basilare e proteggere risorse lato backend e frontend

4. **Gestire uno stato applicativo persistente** (carrello, ordini) sincronizzato tra frontend e backend

5. **Curare aspetti di qualità del codice**, organizzazione del progetto, UX di base e minima accessibilità

6. **Documentare l'applicazione** (README, descrizione API e scelte architetturali)

---

## 3️⃣ Materiale di Partenza

### Base Applicazione Angular

Si assume come base un'applicazione Angular di shop online con:

- ✓ Catalogo prodotti (lista) e pagina di dettaglio prodotto
- ✓ Carrello gestito lato frontend (mock/in-memory/localStorage)
- ✓ Pagina checkout con Reactive Forms e validazioni client
- ✓ Servizi HTTP eventualmente collegati a un backend mock o fake

### Compito dello Studente

1. **Introdurre un backend Rails** che espone le API necessarie
2. **Collegare Angular al backend reale**, eliminando progressivamente ogni mock
3. **Estendere il progetto** con almeno una funzionalità avanzata

---

## 4️⃣ Requisiti Funzionali Obbligatori

### 4.1 Gestione Prodotti

#### Backend (Rails)

**Endpoints minimi:**

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/products` | Restituisce elenco prodotti |
| `GET` | `/products/:id` | Restituisce dettaglio del prodotto |

**Requisiti `GET /products`:**
- Deve supportare **almeno una** di queste capacità:
  - ✓ Filtro per categoria/tag (es. `?tag=...`)
  - ✓ Ricerca testuale (es. `?q=...`)
  - ✓ Paginazione (es. `?page=...&per_page=...`)

#### Frontend (Angular)

- ✅ `ProductService` deve usare gli endpoint REST reali
- ✅ Componenti di lista e dettaglio **non devono** contenere dati hardcoded
- ✅ Gestione basilare dei filtri/paginazione coerente con gli endpoint implementati

---

### 4.2 Carrello Persistente (non mockato)

**🎯 Obiettivo:** Il carrello deve essere memorizzato sul backend e ricaricabile.

#### Backend (Rails)

**Modello dati minimo:**

```
Cart
├── Associato all'utente
└── Oppure legato a un token (carrello guest)

CartItem
├── Riferimento a Product
├── Quantità
└── Prezzo unitario
```

**Endpoints minimi:**

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/cart` | Restituisce lo stato del carrello corrente |
| `POST` | `/cart/items` | Aggiunge un nuovo prodotto (id + quantità) |
| `PATCH` | `/cart/items/:id` | Aggiorna la quantità |
| `DELETE` | `/cart/items/:id` | Rimuove l'articolo dal carrello |

#### Frontend (Angular)

**`CartService` deve:**

- ✅ Inizializzare lo stato leggendo `/cart`
- ✅ Aggiornare il backend a ogni modifica (aggiungi/modifica/rimuovi)
- ✅ Aggiornare l'UI in maniera coerente

**Requisiti:**

- Il carrello deve **sopravvivere al reload della pagina** (utente loggato)
- 🌟 **Plus:** Implementare carrello guest persistito

---

### 4.3 Checkout e Ordini

Si parte dalla pagina di checkout già presente (Reactive Forms).

#### Backend (Rails)

**Modelli minimi:**

```
Order
├── Dati cliente
├── Totale
├── Data creazione
└── Stato ordine

OrderItem
├── Riferimento a Product
├── Quantità
└── Prezzo al momento dell'ordine
```

**Endpoints minimi:**

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/orders` | Crea un ordine dal carrello + dati checkout<br>Svuota/invalida il carrello dopo la creazione |
| `GET` | `/orders` | Restituisce lista ordini dell'utente autenticato |
| `GET` | `/orders/:id` | Dettaglio di un singolo ordine |

#### Frontend (Angular)

**`OrderService`:**

- ✅ Deve inviare i dati di checkout a `POST /orders`

**UX richiesta:**

L'utente deve ricevere un riscontro chiaro:

- ⏳ Stato di loading durante la chiamata
- ✅ Messaggio di conferma in caso di successo
- ❌ Messaggio di errore in caso di fallimento, con eventuale possibilità di retry

**Pagina ordini:**

- Una pagina semplice con la lista degli ordini (`GET /orders`) è **obbligatoria**
- Dettaglio ordini più ricco può rientrare tra le funzionalità avanzate

---

### 4.4 Autenticazione Reale (non mockata)

**🔐 È richiesta autenticazione reale** lato backend e lato frontend.

#### Login con Credenziali gestito da Rails

**Implementazione:** Devise o soluzione custom

**Endpoints minimi:**

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/auth/login` | Riceve credenziali e restituisce token/JWT o session ID |
| `POST` | `/auth/logout` | Termina la sessione |
| `GET` | `/auth/me` | Restituisce dati utente corrente |

**Angular:**

- ✅ Pagina di login con form reale
- ✅ Memorizzazione token e attach via `HttpInterceptor`

#### Integrazione nel Flusso

**Solo utenti autenticati possono:**

- ✓ Accedere alla pagina `/checkout`
- ✓ Consultare la lista `/orders`
- ✓ Utilizzare il carrello persistente associato all'utente

**Protezione route:**

- Angular deve usare almeno una **route guard** per proteggere le rotte riservate

---

## 5️⃣ Requisiti Tecnici Backend (Rails)

### Configurazione Base

- ✅ Progetto creato come API
  ```bash
  rails new nome-progetto --api
  ```
- ✅ Database relazionale (preferibilmente **PostgreSQL/MySQL** o in alternativa SQLite3)

### Validazioni

- ✅ Validazioni di base sui modelli:
  - Campi obbligatori
  - Formato email
  - Valori numerici positivi
  - ecc.

### Gestione Errori

**Uso coerente degli status HTTP:**

| Status | Utilizzo |
|--------|----------|
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `422` | Unprocessable Entity |
| `500` | Internal Server Error |

- ✅ Risposta JSON che riporti almeno un **messaggio di errore significativo**

### Test Minimo Richiesto

- ✅ Almeno **1 test di modello** (es. validazione `Order` o `Product`)
- ✅ Almeno **1 test di request/controller** per un endpoint significativo (es. `POST /orders`)

---

## 6️⃣ Requisiti Tecnici Frontend (Angular)

### Gestione Dati

**Nessun uso di dati hardcoded per:**

- ❌ Prodotti
- ❌ Carrello
- ❌ Ordini

### Servizi Dedicati

Servizi richiesti (i nomi possono variare, ma la responsabilità deve essere chiara):

- `ProductService`
- `CartService`
- `OrderService`
- `AuthService`

### Forms e HTTP

- ✅ Uso di **Reactive Forms** per la pagina di checkout (come già visto a lezione)
- ✅ Uso di `HttpClient` e `HttpInterceptor` per:
  - Token di autenticazione
  - Gestione centralizzata di errori HTTP

---

## 7️⃣ Funzionalità Avanzate

### Requisito

- **Obbligatoria almeno 1** funzionalità avanzata tra quelle elencate
- 🌟 **Bonus:** Una seconda funzionalità avanzata sarà considerata come bonus ai fini del voto

### Esempi di Funzionalità Avanzate

#### 1. 👨‍💼 Area Admin per Prodotti

- Sezione riservata (protetta) per **creare, modificare, cancellare prodotti**
- Protezione con **ruolo admin** lato backend e guard lato Angular

#### 2. 📋 Storico Ordini Avanzato

- Pagina "I miei ordini" con **filtri per data/stato**
- **Dettaglio ordine** con tutte le informazioni (prodotti, quantità, prezzi, indirizzo)

#### 3. ❤️ Wishlist / Preferiti

- Possibilità di **aggiungere/rimuovere** prodotti da una lista di preferiti
- **Persistenza lato backend** per ogni utente

#### 4. 🎟️ Gestione Codici Sconto / Coupon

- Modello `Coupon` con regole di validità (date, numero di usi, ecc.)
- **Applicazione del coupon** nel checkout con ricalcolo del totale

#### 5. 🌍 Internazionalizzazione

- Supporto almeno per **Italiano + Inglese**
- Meccanismo per la **scelta della lingua** nell'interfaccia

#### 6. 🧪 Test E2E / Integrazione

**Test unitari:**
- 3-4 Unit test sul **backend**
- 2 Unit test su **Service Angular**
- 2 Unit test su **Component Angular**

**Test E2E:**
- 1-2 scenari end-to-end
  - Esempio: login → aggiungi al carrello → checkout → ordine

### Altre Funzionalità

Lo studente può proporre **altre funzionalità avanzate** di complessità paragonabile, previa **approvazione del docente**.

---

## 8️⃣ Consegna

### Cosa Consegnare

#### 1. 📦 Repository Git (personale)

```
repository/
├── backend/          # Progetto Rails
└── frontend/         # Progetto Angular
```

#### 2. 📄 README Principale

Deve contenere:

**Prerequisiti software:**
- Versioni Ruby, Rails, Node, Angular CLI, DB, ecc.

**Istruzioni passo-passo per:**
- ✓ Configurare il database (migrazioni, seeding iniziale prodotti)
- ✓ Avviare il backend
- ✓ Avviare il frontend in sviluppo e/o servire la build di produzione

#### 3. 📐 Documento Architettura

File `ARCHITETTURA.md` o sezione nel README che descriva:

- I principali **modelli del dominio** (`Product`, `Cart`, `Order`, `User`, ecc.)
- Il **flusso login → carrello → checkout → ordine**
- Quali **funzionalità avanzate** sono state implementate

#### 4. 🐳 Docker Compose (Opzionale ma apprezzato)

File `docker-compose.yml` per avviare velocemente l'ambiente completo

---

## 9️⃣ Prova Orale

### Struttura Discussione

La valutazione include una breve **discussione orale** del progetto:

#### Dimostrazione Pratica

- ✓ Login reale
- ✓ Visualizzazione prodotti
- ✓ Uso del carrello persistente
- ✓ Checkout con creazione ordine
- ✓ Funzionalità avanzata implementata

#### Domande su

- Scelte progettuali e tecnologiche
- Modello dati sul backend
- Integrazione Angular–Rails (servizi, interceptor, guard)
- Gestione errori e sicurezza di base

#### Il Docente può Chiedere di

- Spiegare porzioni di codice
- Apportare una piccola modifica live
  - Es. aggiungere un campo, gestire un nuovo errore

---

## 🎯 Criteri di Valutazione

### Valutazione in Trentesimi

| Ambito | Punti | Descrizione |
|--------|-------|-------------|
| **Backend Rails** | 10 | API REST, modello dati, validazioni, gestione errori, test minimi |
| **Frontend Angular** | 10 | Integrazione API, gestione carrello/ordini, checkout funzionante |
| **Funzionalità Avanzate** | 5 | 1 funzionalità avanzata completata |
| **Bonus** | +lode | Eventuale seconda funzionalità (margine per 30 e lode) |
| **Qualità Complessiva** | 2 | Struttura del codice, chiarezza, UX/a11y minima, ordine del repository, documentazione |

**Totale:** 27 punti base + 3 punti extra → 30/30 + lode

---

## 📅 Note Finali

- **Anno Accademico:** 2025/2026
- **Corso:** Sistemi Web - UNIFE
- **Tipo Progetto:** Individuale full-stack
- **Focus:** Integrazione reale frontend-backend con autenticazione e persistenza dati

---

**Buon lavoro! 🚀**

