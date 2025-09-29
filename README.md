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

#### Additional Backend Details
- **Database:** MySQL with TypeORM and migrations.
- **Architecture Patterns:** `CQRS` with `Mediator pattern` for clear separation of commands and queries.
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
| Patterns | CQRS, Mediator Pattern      |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **Docker & Docker Compose**
- **MySQL** (Docker or local installation)

### Clone the Repository
