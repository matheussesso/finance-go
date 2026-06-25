<h1 align="center">FinanceGo</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

> A modern, fast, and scalable system for Personal Finance control, designed to manage **Monthly Plannings** and **Financial Blocks**. 
> The differential of this project is its strong architecture based on **Clean Architecture (Go)** combined with a high-level SPA interface built with **React** and **TailwindCSS**.

<p align="center">
  <b> Languages:</b> 
  <a href="docs/pt/README.md">Português</a> | 
  <a href="README.md">English</a> | 
  <a href="docs/es/README.md">Español</a>
</p>

---

## Screenshots
*(Replace these images with the link to the images after uploading the repository to GitHub)*

> `[ Insert a screenshot of the Dashboard here ]`
>
> `[ Insert a screenshot of the Modal / Calendar flow here ]`

---

## Project Structure

The stack is strictly divided between Frontend and Backend, orchestrated via Docker.

- `/src/backend`: RESTful API built in **Go (Golang)**. It follows the extended MVC pattern (Clean Architecture, Repositories, Services, and Handlers).
- `/src/frontend`: Reactive interface in **React** + **Vite**. Componentized with clean UI, native Dark/Light mode (Tailwind), and client-side routing.
- `/docs`: Advanced documentation (Database Schemas, Endpoints, PHP -> Go transition guides).
- `docker-compose.yml`: All-in-One Infrastructure (MariaDB, API, and Frontend NGINX).

---

## How to Run and Test the Application

To run the application simulating a real production environment (Multi-stage builds), we unified **the entire Stack** in Docker. Follow the steps below:

### Single Step: Bring up the Entire Architecture
In the root of the project, make sure you have Docker installed and running. Execute the magic Docker Compose command:

```bash
docker compose up -d --build
```
> Docker will download MariaDB, compile the tiny and ultra-fast Go binary for the backend, and build React to be served via NGINX. All at once!

### Access in the Browser
Done! With just one command, everything is up. Open the Frontend URL in your browser:
 **[http://localhost:5173](http://localhost:5173)**

*(Note: Internally, the API backend is running exposed on port `8080` and the MariaDB database on port `3306`.)*

---

## Main Features

1. **Multiple Plannings Management:** Create and navigate through different plannings based on Month/Year.
2. **Unified and Interactive Dashboard:** The calendar and the list of blocks (Revenues/Expenses) coexist on the same screen, displaying the global balance automatically.
3. **Elegant Modal System:** Quick creation of Financial Blocks (e.g., *Fixed Bills, Leisure, Salary*) and Items within blocks.
4. **Security via JWT:** Robust authentication to protect your data via `Bearer` headers.
5. **Dark Mode Supported:** The design responds perfectly between Light and Dark modes.
6. **Multi-language (i18n):** Full support for English, Spanish, and Portuguese, easily switchable via the UI.

---

## Additional Documentation (Dev)

If you are a developer and want to better understand the architecture or the database, explore the files in the `/docs` folder:
- [Quick Guide: Go for PHP Devs (Laravel/Codeigniter)](docs/en/go_for_php_developers.md)
- [System Architecture and Docker](docs/en/architecture.md)
- [API Endpoints Documentation](docs/en/api_endpoints.md)
- [Database Schema and Diagram](docs/en/database_schema.md)
- [Frontend Guide](docs/en/frontend_guide.md)

---

## How to Contribute

1. **Fork** the repository.
2. Create a branch for your feature: `git checkout -b my-feature`.
3. Commit your changes: `git commit -m 'feat: Add new feature X'`.
4. Push to the branch: `git push origin my-feature`.
5. Open a **Pull Request**.

---

## License
This project is distributed under the MIT license. See the `LICENSE` file for more details.
