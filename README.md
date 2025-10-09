# 🛒 Amazon Clone

**Amazon Clone** is a modern, full-stack e-commerce platform powered by a **NestJS microservices backend** and a **ReactJS (Vite) frontend**.  
It is designed with scalability, modularity, and maintainability in mind, featuring user authentication, product management, order processing, and payment integrations.

---

## 📖 Overview

### Backend (NestJS Microservices)
The backend is implemented with **NestJS**, following a **microservices architecture** to ensure modular separation of concerns and scalability.  
It handles authentication, profiles, product inventory, orders, and payments.

#### Core Services
- **🛡️ Identity Service**
    - JWT authentication with access/refresh tokens.
    - `Redis-based` token blacklisting for logout and session invalidation.
    - Passport strategies (JWT, extendable for OAuth).
    - **Email confirmation flow** upon registration using Handlebars templates.
    - **Resend verification email** with Redis-based rate limiting and token expiration control.

- **👤 Profile Service**
    - CRUD operations for user profiles.
    - Avatar upload and management using Cloudinary.
    - Secure access integrated with the Identity Service.

- **🛍️ Product Service**
    - Full product CRUD operations.
    - Search and filter capabilities.
    - Inventory tracking and stock management.

- **💳 Order Service**
    - Order creation, update, and cancellation.
    - Payment integrations: `Stripe` and Cash on Delivery (COD).
    - Stripe webhook handling for real-time payment status updates.
    - **Redlock integration** for distributed locking — ensures concurrency safety during critical operations (e.g., discount ticket usage, stock reservation).

#### Additional Backend Details
- **Database:** MySQL with TypeORM and migrations.
- **Architecture Patterns:** `CQRS` with `Mediator pattern` for clear separation of commands and queries.
- **Concurrency Control:** `Redis Redlock` for atomic operations across distributed services.
- **Rate Limiting:** Implemented via Redis with configurable TTLs for send-confirmation-email feature (`SHORT_RATE_LIMIT_TTL`, `LONG_RATE_LIMIT_TTL`, `VERIFY_EMAIL_TOKEN_DURATION`).
- **Validation:** `class-validator` & `class-transformer`.
- **API Gateway:** `TCP-based` communication between services.
- **Documentation:** Swagger + Postman collections.
- **Development:** `Docker-based` containerization for local and production-ready deployments.

---

### Frontend (React + Vite)
The frontend is built with **ReactJS** using **Vite** for fast builds and modern tooling. It provides a responsive UI for product browsing, checkout, and profile management.

#### Features
- Product browsing with detail pages.
- Cart management with intuitive checkout flow.
- User profile page with Cloudinary avatar upload.
- Email verification and resend confirmation flow.
- Consistent UI elements with **Lucide React icons**.

---

## 🛠️ Tech Stack

| Layer    | Technology / Tool           |
|----------|-----------------------------|
| Backend  | NestJS v10 (Microservices)  |
| Database | TypeORM, MySQL (migration)  |
| Auth     | JWT, Passport, Redis        |
| Payment  | Stripe, COD                 |
| Frontend | ReactJS, Vite, Lucide Icons |
| DevOps   | Docker                      |
| Docs     | Swagger, Postman            |
| Patterns | CQRS, Mediator, Redlock     |

---

## 🚀 Getting Started (Detailed)

### 1. Prerequisites
Before running the project, make sure you have installed:

- **Node.js** v18+
- **Docker & Docker Compose**

- **MySQL** (Docker or local installation, Docker recommended)
- **Redis** (Docker or local installation)

---

### 2. Clone the Repository
```bash
  git clone https://github.com/TrQAnhh/Amazon.git
```
---

### 3. Setup Environment Variables

Each service (backend and frontend) requires an environment file which called `.env.example` and has been prepared for you to fill your security data.

**Backend:**
```bash
  cp backend/.env.example backend/.env
```
**Frontend:**
```bash
  cp frontend/.env.example frontend/.env
```

---
### 4. Start Services using Docker Compose
Now with enough data in the `.env` file, you can now run the applicationw with Docker (make sure that you already installed it).
```bash
  docker-compose up --build
```
This will start all services:

| Service          | Port  | Notes                                |
|-----------------|-------|--------------------------------------|
| MySQL           | 3307  | Uses Docker volume `db_data`         |
| Redis           | 6379  | Requires password from `.env`        |
| API Gateway     | 3000  | Entry point for frontend             |
| Identity Service| 4001  | Handles authentication               |
| Profile Service | 4003  | Handles user profiles                |
| Product Service | 4002  | Handles products                     |
| Order Service   | 4004  | Handles orders and checkout          |
| Frontend        | 5173  | ReactJS frontend                     |

**Note:** Migrations are automatically executed when services start (identity, profile, product, order). Make sure MySQL is running before starting services.

---
### 5. Notes
- Ensure `.env` files contain valid credentials before running services.
- Redis password must match `REDIS_ACCESS_KEY`.
- Email functionality (registration and verification) requires correct SMTP credentials.
- Stripe requires valid test API keys to process payments in development.

---
### 6. Stripe Webhook (for local development)

To test Stripe payments locally, you need to forward Stripe events to your local API Gateway:

1. Install the Stripe CLI if you haven't:
```bash
  npm install -g stripe
```
2. Login with your Stripe account:
```bash
  stripe login
```
3. Start listening to Stripe events and forward them to your local webhook endpoint:
```bash
  stripe listen --forward-to localhost:3000/stripe/webhook
```
This will forward all test events from Stripe to your local backend.
Make sure the API Gateway is running on port 3000 and the webhook endpoint is configured correctly.
