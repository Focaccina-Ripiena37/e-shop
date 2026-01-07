# 🛍️ E-Shop - Progetto Sistemi Web

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Rails](https://img.shields.io/badge/Rails-7-CC0000?style=for-the-badge&logo=rubyonrails&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Applicazione e-commerce full-stack sviluppata per il corso di **Sistemi Web - UNIFE** (AA 2025/2026).

## 📋 Indice

- [Funzionalità](#-funzionalità)
- [Tecnologie](#-tecnologie)
- [Requisiti](#-requisiti)
- [Installazione](#-installazione)
- [Avvio](#-avvio)
- [Docker](#-docker)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Struttura Progetto](#-struttura-progetto)
- [Architettura](#-architettura)

## 🚀 Funzionalità

### Utente
- 🛒 **Catalogo Prodotti** - Visualizzazione con filtri per categoria, tag e ricerca
- 🔍 **Dettaglio Prodotto** - Galleria immagini e prodotti suggeriti
- 🛍️ **Carrello Persistente** - Sincronizzato con backend, disponibile dopo login
- 📦 **Checkout** - Form completo con validazione real-time
- 📜 **Storico Ordini** - Visualizzazione ordini passati con dettaglio
- 👤 **Profilo Utente** - Gestione dati personali

### Admin
- 📊 **Dashboard** - Panoramica ordini e statistiche
- 📝 **Gestione Prodotti** - CRUD completo con categorie e tag
- 📋 **Gestione Ordini** - Aggiornamento stato ordini

### UX/UI
- 🌓 **Dark/Light Mode** - Toggle tema persistente
- 📱 **Responsive Design** - Mobile-first con Material Design
- ⚡ **Performance** - Lazy loading e caching intelligente

## 🛠️ Tecnologie

| Frontend | Backend | Database |
|----------|---------|----------|
| Angular 21 | Ruby on Rails 7 | PostgreSQL |
| Angular Material | Devise + JWT | SQLite (dev) |
| RxJS | ActiveRecord | |
| TypeScript 5.9 | Puma | |

## 📋 Requisiti

- **Node.js** >= 20.x
- **Ruby** >= 3.2
- **Rails** >= 7.0
- **PostgreSQL** >= 14 (produzione)
- **Docker** (opzionale)

## 💻 Installazione

### 1. Clone del repository
```bash
git clone https://github.com/tuouser/e-shop.git
cd e-shop
```

### 2. Setup Backend
```bash
cd backend
bundle install
rails db:create db:migrate db:seed
```

### 3. Setup Frontend
```bash
cd ..
npm install
```

## 🚀 Avvio

### Sviluppo (2 terminali)

**Terminal 1 - Backend:**
```bash
cd backend
rails s -p 3001
```

**Terminal 2 - Frontend:**
```bash
npm start
```

Visita **http://localhost:4200**

### Utenti Demo
| Email | Password | Ruolo |
|-------|----------|-------|
| admin@example.com | password123 | Admin |
| user@example.com | password123 | User |

## 🐳 Docker

Avvia l'intera applicazione con Docker Compose:

```bash
docker-compose up --build
```

Servizi disponibili:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

**Nota:** Docker è utilizzato **solo per sviluppo locale**. Il deployment su Render non usa Docker ma i runtime nativi di Render.

## 🚀 Deployment

### Deploy automatico su Render

Questo progetto è configurato per il deployment automatico su [Render](https://render.com) tramite il file [`render.yaml`](render.yaml).

#### Prerequisiti
1. Account GitHub con repository del progetto
2. Account Render (gratuito)
3. Repository GitHub collegato a Render

#### Setup Deploy (Una tantum)

1. **Push del codice su GitHub:**
   ```bash
   git add .
   git commit -m "Setup Render deployment"
   git push origin main
   ```

2. **Crea Blueprint su Render:**
   - Vai su [Render Dashboard](https://dashboard.render.com)
   - Click su **New +** → **Blueprint**
   - Collega il tuo repository GitHub
   - Render leggerà automaticamente `render.yaml` e creerà:
     - Database PostgreSQL (`e-shop-db`)
     - Backend Rails API (`e-shop-api`)
     - Frontend Angular Static Site (`e-shop-frontend`)

3. **Configurazione variabili d'ambiente (Opzionale):**
   - `SECRET_KEY_BASE`: generato automaticamente da Render
   - `DATABASE_URL`: collegato automaticamente al database
   - Per variabili aggiuntive (es. chiavi API), vai su **Environment** nel dashboard

#### Deployment Automatico

Ogni push su `main` trigghera automaticamente il deploy:

1. **Backend (Rails API):**
   - Build: `bundle install` + `rails db:migrate`
   - Start: `rails server` su porta `$PORT`
   - URL esempio: `https://e-shop-api.onrender.com`

2. **Frontend (Angular Static Site):**
   - Build: `npm install` + `npm run build`
   - Serve: file statici da `dist/shop/browser`
   - URL esempio: `https://e-shop-frontend.onrender.com`

#### Nota importante
⚠️ **Il piano gratuito di Render** mette in sleep i servizi dopo 15 minuti di inattività. Il primo accesso dopo il sleep richiede ~30 secondi per il "cold start".

#### Troubleshooting

- **Build fails:** Controlla i log su Render Dashboard → Service → Deploy Logs
- **Database connection error:** Verifica che `DATABASE_URL` sia correttamente collegato
- **CORS errors:** Aggiorna `config/initializers/cors.rb` nel backend con l'URL del frontend Render

#### URL Produzione

Dopo il deploy, le tue URL saranno:
- **Frontend:** `https://e-shop-frontend.onrender.com`
- **Backend API:** `https://e-shop-api.onrender.com/api`

Aggiorna `src/environments/environment.production.ts` con l'URL del backend:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://e-shop-api.onrender.com/api'
};
```

## 📚 API Documentation

La documentazione delle API è disponibile in formato OpenAPI:

- **Swagger UI**: http://localhost:3001/api-docs (se configurato)
- **File OpenAPI**: `backend/swagger/v1/swagger.yaml`

### Endpoints Principali

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Lista prodotti | No |
| GET | `/api/products/:id` | Dettaglio prodotto | No |
| POST | `/api/login` | Login utente | No |
| POST | `/api/signup` | Registrazione | No |
| GET | `/api/cart` | Carrello utente | JWT |
| POST | `/api/orders` | Crea ordine | JWT |
| GET | `/api/admin/orders` | Lista ordini (admin) | JWT+Admin |

## 🧪 Testing

### Frontend
```bash
npm test
```

### Backend
```bash
cd backend
bundle exec rspec
```

## 📁 Struttura Progetto

```
e-shop/
├── src/                          # Frontend Angular
│   ├── app/
│   │   ├── core/                 # Services, guards, interceptors
│   │   │   ├── guards/
│   │   │   ├── interceptor/
│   │   │   ├── models/
│   │   │   └── services/
│   │   ├── features/             # Feature modules
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── profile/
│   │   └── shared/               # Shared components
│   └── environments/             # Environment configs
├── backend/                      # Backend Rails
│   ├── app/
│   │   ├── controllers/api/
│   │   ├── models/
│   │   └── serializers/
│   ├── config/
│   └── db/
├── docker-compose.yml
├── render.yaml                   # Render Blueprint config
├── ARCHITETTURA.md              # Documentazione architettura
└── README.md
```

## 🏗️ Architettura

Per una descrizione dettagliata dell'architettura, consulta [ARCHITETTURA.md](ARCHITETTURA.md).

## 📝 Note per l'Esame

Questo progetto implementa i requisiti delle [specifiche d'esame](Specifiche_Esame_Progetto.md):

- ✅ Backend REST in Ruby on Rails
- ✅ Frontend Angular integrato con API reali
- ✅ Autenticazione JWT (non mockata)
- ✅ Carrello persistente sincronizzato
- ✅ Funzionalità avanzate: Admin panel, Dark mode, Galleria immagini
- ✅ Deployment su Render con Blueprint automatico

## 📄 Licenza

Progetto sviluppato per scopi didattici - Corso di Sistemi Web, UNIFE.

---

**Autore:** Lorenzo Massafra  
**Corso:** Sistemi Web - AA 2025/2026  
**Università:** Università degli Studi di Ferrara