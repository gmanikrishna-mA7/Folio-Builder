# 🚀 Folio: High-Fidelity Portfolio Builder

**Folio** is a full-stack, enterprise-grade developer portfolio platform. It enables software engineers to design, customize, and publish high-fidelity portfolios dynamically. Additionally, developers can export their portfolio into a standalone, offline-capable single-file HTML page containing base64-encoded media assets, certificate lightboxes, and a responsive timeline.

---

## ✨ Features

- **Interactive Chat-Based Builder**: A step-by-step developer wizard designed to collect profile metadata, technical skills, projects, certifications, and achievements.
- **Offline HTML Exporter**: Instantly downloads a single-file HTML portfolio containing all uploaded assets (avatar, resume, certificates) embedded as base64 data URIs. Works 100% offline.
- **Certificate & Work Proof Lightbox**: Clean modal views to display certificate images directly in the browser, with automatic PDF download fallbacks.
- **Dockerized Architecture**: Simplified multi-stage Docker builds for backend and frontend services, packaged together with PostgreSQL.
- **Job Description Risk Analyzer**: Integrated helper page to analyze job descriptions and extract security prediction metrics.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries/Frameworks |
|---|---|---|
| **Frontend** | React 19 / JavaScript | Vite 8, React Router DOM 7, Tailwind CSS 3 |
| **Backend** | Java 17 | Spring Boot 3.3, Spring Security, Spring Data JPA, JWT |
| **Database** | PostgreSQL 15 | Hibernate ORM |
| **DevOps** | Docker | Docker Compose, Nginx (frontend SPA hosting) |

---

## 📂 Project Structure

```
Folio/
├── portfolio-backend/      # Spring Boot application source code
│   ├── src/
│   └── pom.xml
├── portfolio-frontend/     # React + Vite application source code
│   ├── src/
│   ├── index.html
│   └── package.json
├── Dockerfile              # Multi-stage Docker build for Backend
├── docker-compose.yml      # Orchestrates Postgres, Backend, & Frontend
└── README.md
```

---

## 🚀 Local Quickstart

### Option A: Using Docker Compose (Recommended)
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed, then run:

```bash
docker-compose up --build
```
- **Frontend URL**: `http://localhost:3000`
- **Backend URL**: `http://localhost:8080`
- **Database Port**: `localhost:8000`

### Option B: Native Setup

#### 1. Database
Set up a PostgreSQL server running locally at port `8000` (or update database properties in `portfolio-backend/src/main/resources/application.properties`). Create a database named `portfolio_db`.

#### 2. Backend
```bash
cd portfolio-backend
mvn spring-boot:run
```

#### 3. Frontend
Create a `.env` file inside the `portfolio-frontend` directory with:
```env
VITE_API_URL=http://localhost:8080
```
Then run:
```bash
cd portfolio-frontend
npm install
npm run dev
```

---

## ☁️ Production Deployment (Render.com)

This application is ready for deployment on **Render.com** using the following services:

1. **Database**: Create a **PostgreSQL** instance on Render.
2. **Backend (Web Service)**: Link your repo, choose **Docker** runtime, and add environment variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<internal-db-host>:5432/<db-name>`
   - `SPRING_DATASOURCE_USERNAME`: `<db-user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db-password>`
   - `APP_JWT_SECRET`: `<random-secret-key>`
   - `APP_FRONTEND_URL`: `https://your-frontend-site.onrender.com`
3. **Frontend (Static Site)**:
   - **Root Directory**: `portfolio-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: `VITE_API_URL` pointing to your backend service URL.
   - **Redirects/Rewrites**: Set a Rewrite rule from `/*` to `/index.html` to support SPA routing.

---

## 📄 License
This project is licensed under the ISC License.