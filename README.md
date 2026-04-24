# 🔗 URL Shortener (Spring Boot) — Dockerized, Production-ready

A URL shortener backend built with **Spring Boot 3**, **PostgreSQL**, **Redis caching**, and **JWT authentication**.
It generates **Base62** short codes, supports redirects, and exposes click analytics.

---

## ✅ Features

- **URL shortening** with Base62 encoding
- **Redirects** via `GET /r/{shortCode}`
- **Analytics** (click count) via JWT-protected endpoint
- **PostgreSQL** persistence using Spring Data JPA / Hibernate
- **Redis** caching layer (best-effort; app still works if Redis is down)
- **JWT auth** (secret + expiration via environment variables)
- **Swagger/OpenAPI** docs (toggleable for production)
- **Actuator health** endpoint for container health checks
- **Docker + docker-compose** for local/prod-like deployments

---

## 🧱 Tech stack

- **Java 17**
- **Spring Boot 3.x**
- **Spring Web**, **Spring Security**
- **Spring Data JPA (Hibernate)** + **PostgreSQL**
- **Spring Data Redis** + **Redis**
- **JJWT** for token signing/verification
- **springdoc-openapi** (Swagger UI)
- **Spring Boot Actuator**
- **Docker** / **Docker Compose**

---

## 📌 API overview (brief)

### Auth
- `POST /auth/register` — register user
- `POST /auth/login` — login, returns JWT token

### URLs (JWT protected)
- `POST /api/shorten` — create short URL
- `GET /api/analytics/{shortCode}` — click analytics

### Redirect (public)
- `GET /r/{shortCode}` — 302 redirect to the long URL  
  (Note: Swagger “Try it out” may show *Failed to fetch* due to browser redirect/CORS behavior; test redirects via normal browser address bar.)

### Health
- `GET /actuator/health` — returns UP (used by docker-compose healthcheck)

---

## ⚙️ Configuration (environment variables)

The app reads config from env vars with safe defaults.

| Variable | Default | Purpose |
|---|---:|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/urlshortener` | DB connection |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | `password` | DB password |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Redis host |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port |
| `APP_BASE_URL` | `http://localhost:8080` | Used to build returned short URLs |
| `JWT_SECRET` | `change-me-in-prod-...` | JWT signing secret (HS256) |
| `JWT_EXPIRATION_MS` | `3600000` | Token validity |
| `SWAGGER_ENABLED` | `false` | Enable/disable Swagger UI + docs |

---

## ▶️ Run locally (no Docker)

Requirements: Java 17, PostgreSQL, Redis (optional)

```bash
mvn spring-boot:run
```

Then open:
- Health: `http://localhost:8080/actuator/health`

---

## 🐳 Run with Docker Compose (recommended)

```bash
docker compose up --build
```

Open:
- Health: `http://localhost:8080/actuator/health`

Enable Swagger (optional):

```bash
SWAGGER_ENABLED=true docker compose up --build
```

Swagger UI:
- `http://localhost:8080/swagger-ui/index.html`

---

## 🧭 Architecture (text diagram)

```
Client
  ├─ AuthController  ──> UserService ──> UserRepository ──> PostgreSQL
  ├─ UrlController   ──> UrlService  ──> UrlRepository  ──> PostgreSQL
  │                                  └─ RedisTemplate (best-effort cache)
  └─ RedirectController ─────────────> UrlService (resolve + increment clicks)
```

---

## 📷 Screenshots

- Swagger UI: *(add screenshot here)*
- Docker Compose running: *(add screenshot here)*

---

## 📄 License

MIT (or choose your preferred license).

