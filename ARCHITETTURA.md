# Architettura del Progetto UniMart

## 1. Panoramica

**UniMart** è un'applicazione e-commerce full-stack composta da:
- **Frontend**: Angular 21 con Material Design
- **Backend**: Ruby on Rails in modalità API
- **Database**: PostgreSQL (produzione) / SQLite (sviluppo)

## 2. Struttura del Progetto

```
e-shop/
├── src/                    # Frontend Angular
│   ├── app/
│   │   ├── core/           # Servizi singleton, guards, interceptors
│   │   ├── features/       # Moduli funzionali (products, cart, checkout, auth, admin)
│   │   └── shared/         # Componenti riutilizzabili
│   └── environments/       # Configurazioni ambiente
├── backend/                # Backend Ruby on Rails
│   ├── app/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # ActiveRecord models
│   │   └── serializers/    # JSON serialization
│   ├── config/             # Configurazione Rails
│   └── db/                 # Migrations e seeds
└── docker-compose.yml      # Orchestrazione containers
```

## 3. Architettura Frontend (Angular)

### 3.1 Core Module
Contiene servizi singleton iniettati a livello root:

| Servizio | Responsabilità |
|----------|----------------|
| `AuthService` | Gestione autenticazione JWT, login/logout, stato utente |
| `CartService` | Gestione carrello sincronizzato con backend |
| `ProductService` | CRUD prodotti via REST API |
| `OrderService` | Creazione e recupero ordini |
| `ThemeService` | Toggle dark/light mode |

### 3.2 Feature Modules
Organizzazione per dominio funzionale con lazy loading:

- **products/**: Catalogo, dettaglio prodotto, filtri
- **cart/**: Visualizzazione e gestione carrello
- **checkout/**: Form ordine con validazione
- **auth/**: Login, signup, profilo utente
- **admin/**: Dashboard, gestione prodotti e ordini
- **orders/**: Storico ordini utente

### 3.3 State Management
- **RxJS BehaviorSubject** per stato reattivo (cart, auth)
- **Async pipes** nei template per subscription automatica
- **shareReplay** per caching HTTP responses

### 3.4 Interceptors
```
HTTP Request → AuthInterceptor → HttpErrorInterceptor → Backend
```

- `AuthInterceptor`: Aggiunge JWT token a ogni richiesta
- `HttpErrorInterceptor`: Gestisce errori 401 (logout automatico)

## 4. Architettura Backend (Rails)

### 4.1 API Endpoints

#### Pubblici
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/products` | Lista prodotti (filtri: category_id, tag_ids[]) |
| GET | `/api/products/:id` | Dettaglio prodotto |
| GET | `/api/categories` | Lista categorie |
| GET | `/api/tags` | Lista tags |
| POST | `/api/signup` | Registrazione utente |
| POST | `/api/login` | Login (restituisce JWT) |

#### Autenticati (JWT required)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/cart` | Carrello utente |
| POST | `/api/cart/items` | Aggiungi al carrello |
| DELETE | `/api/cart/items/:id` | Rimuovi dal carrello |
| GET | `/api/orders` | Ordini utente |
| POST | `/api/orders` | Crea ordine |
| GET | `/api/users/me` | Profilo utente |
| PATCH | `/api/users/me` | Aggiorna profilo |

#### Admin (JWT + admin role)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/admin/orders` | Tutti gli ordini |
| PUT | `/api/admin/orders/:id` | Aggiorna stato ordine |
| POST | `/api/admin/products` | Crea prodotto |
| PUT | `/api/admin/products/:id` | Modifica prodotto |
| DELETE | `/api/admin/products/:id` | Elimina prodotto |

### 4.2 Modello Dati

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│    Order    │────<│  OrderItem  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │            ┌─────────────┐            │
       └───────────>│    Cart     │            │
                    └─────────────┘            │
                          │                    │
                    ┌─────────────┐            │
                    │  CartItem   │            │
                    └─────────────┘            │
                          │                    │
                    ┌─────────────┐            │
                    │   Product   │<───────────┘
                    └─────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
      ┌───────────┐             ┌─────────────┐
      │ Category  │             │    Tag      │
      └───────────┘             └─────────────┘
```

### 4.3 Autenticazione
- **Devise** per gestione utenti
- **JWT** (devise-jwt) per token stateless
- Token incluso in header `Authorization: Bearer <token>`

## 5. Comunicazione Frontend-Backend

### 5.1 Flusso Autenticazione
```
1. User submits login form
2. Angular POST /api/login {email, password}
3. Rails validates credentials
4. Rails returns {token, user}
5. Angular stores token in localStorage
6. AuthInterceptor adds token to subsequent requests
```

### 5.2 Flusso Carrello
```
1. User clicks "Add to Cart"
2. Angular POST /api/cart/items {product_id, quantity}
3. Rails creates/updates CartItem
4. Rails returns updated cart
5. Angular updates CartService state
6. Header badge updates via async pipe
```

### 5.3 Flusso Checkout
```
1. User fills checkout form
2. Angular validates with Reactive Forms
3. Angular POST /api/orders {customer, address, payment}
4. Rails creates Order from Cart items
5. Rails clears user's Cart
6. Angular shows confirmation, clears local cart state
```

## 6. Sicurezza

### 6.1 Frontend
- Route Guards (`authGuard`, `adminGuard`) proteggono pagine
- Token JWT in localStorage (considerare HttpOnly cookie per produzione)
- Interceptor gestisce 401 automaticamente

### 6.2 Backend
- CORS configurato per origini specifiche
- Validazioni ActiveRecord su tutti i modelli
- Autorizzazione basata su ruolo (admin boolean)
- Rate limiting consigliato per produzione

## 7. Testing

### 7.1 Frontend (Vitest)
- Unit test per Services
- Component test con TestBed

### 7.2 Backend (RSpec)
- Model specs con validazioni
- Request specs per API endpoints
- Factory Bot per test data

## 8. Deployment

### 8.1 Sviluppo Locale
```bash
# Terminal 1: Backend
cd backend && rails s -p 3001

# Terminal 2: Frontend
npm start
```

### 8.2 Docker
```bash
docker-compose up
```

### 8.3 Produzione
- Frontend: Build statico su CDN/Nginx
- Backend: Puma su Heroku/Railway/Render
- Database: PostgreSQL managed

## 9. Funzionalità Avanzate Implementate

1. **Pannello Admin**: Dashboard completa per gestione prodotti e ordini
2. **Theme Toggle**: Dark/Light mode persistente
3. **Galleria Immagini**: Visualizzazione multipla nel dettaglio prodotto
4. **Prodotti Suggeriti**: Raccomandazioni basate su categoria/tag
5. **Profilo Utente**: Gestione dati personali e soft delete account

## 5. Flusso Applicativo Completo

### 5.1 Autenticazione
1. User invia credenziali a `POST /api/login`
2. Backend valida con Devise e genera JWT
3. Frontend memorizza token in localStorage
4. AuthInterceptor aggiunge token a ogni richiesta
5. Guard protegge rotte `/checkout`, `/orders`, `/admin`

### 5.2 Carrello Persistente
1. User aggiunge prodotto → `POST /api/cart/items`
2. Backend crea/aggiorna CartItem associato a User
3. CartService aggiorna BehaviorSubject
4. Carrello persiste tra sessioni (reload pagina)
5. Carrello guest: identificato da token temporaneo

### 5.3 Checkout e Ordine
1. User clicca Checkout → Redirect a `/checkout` (guard attivo)
2. Frontend carica carrello da `GET /api/cart`
3. User compila form (Reactive Forms con validazioni)
4. Submit → `POST /api/orders` con dati checkout + items carrello
5. Backend:
   - Crea Order + OrderItems
   - Calcola totale con shipping
   - Salva BillingAddress
   - Svuota carrello
6. Frontend mostra conferma ordine
7. User vede ordine in `/orders`

### 5.4 Gestione Admin
1. Admin login → `admin: true` nel JWT payload
2. AdminGuard verifica ruolo
3. Dashboard: `GET /api/admin/orders` + statistiche
4. Cambio stato: `PUT /api/admin/orders/:id`
5. CRUD prodotti: `POST/PUT/DELETE /api/admin/products/:id`