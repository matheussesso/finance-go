<h1 align="center">FinanceGo 🚀</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

> Un sistema moderno, rápido y escalable para el control de Finanzas Personales, ideado para gestionar **Planes Mensuales** y **Bloques Financieros**. 
> El diferencial de este proyecto es su fuerte arquitectura basada en **Clean Architecture (Go)** aliada a una interfaz SPA de alto nivel construida con **React** y **TailwindCSS**.

<p align="center">
  <b>🌍 Idiomas:</b> 
  <a href="../pt/README.md">Português</a> | 
  <a href="../../README.md">English</a> | 
  <a href="README.md">Español</a>
</p>

---

## 🎨 Screenshots
*(Reemplaza estas imágenes por el enlace de las imágenes después de subir el repositorio en GitHub)*

> `[ Inserta un screenshot del Dashboard aquí ]`
>
> `[ Inserta un screenshot del flujo de Modal / Calendario aquí ]`

---

## 🏗 Estructura del Proyecto

El stack está dividido rigurosamente entre Frontend y Backend, orquestado a través de Docker.

- `/src/backend`: API RESTful construida en **Go (Golang)**. Sigue el patrón MVC extendido (Clean Architecture, Repositorios, Servicios y Handlers).
- `/src/frontend`: Interfaz reactiva en **React** + **Vite**. Componentizada con UI limpia, Dark/Light mode nativo (Tailwind) y enrutamiento en el cliente.
- `/docs`: Documentación avanzada (Esquemas de Base de Datos, Endpoints, Guías de transición PHP -> Go).
- `docker-compose.yml`: Infraestructura All-in-One (MariaDB, API y Frontend NGINX).

---

## 🚀 Cómo Ejecutar y Probar la Aplicación

Para correr la aplicación simulando un entorno real de producción (Multi-stage builds), hemos unificado **todo el Stack** en Docker. Sigue los pasos a continuación:

### Paso Único: Levantar Toda la Arquitectura
En la raíz del proyecto, asegúrate de tener Docker instalado y ejecutándose. Ejecuta el comando mágico de Docker Compose:

```bash
docker compose up -d --build
```
> Docker descargará MariaDB, compilará el binario minúsculo y ultrarrápido de Go para el backend, y construirá React para ser servido a través de NGINX. ¡Todo a la vez!

### Acceder en el Navegador
¡Listo! Con un solo comando, todo está en línea. Abre la URL del Frontend en tu navegador:
👉 **[http://localhost:5173](http://localhost:5173)**

*(Nota: Internamente, el backend de la API se está ejecutando expuesto en el puerto `8080` y la base de datos MariaDB en el puerto `3306`.)*

---

## ✨ Características Principales

1. **Gestión de Múltiples Planes:** Crea y navega por diferentes planes basados en Mes/Año.
2. **Dashboard Unificado e Interactivo:** El calendario y la lista de bloques (Ingresos/Gastos) conviven en la misma pantalla, mostrando el balance global automáticamente.
3. **Sistema de Modales Elegantes:** Creación rápida de Bloques Financieros (ej: *Cuentas Fijas, Ocio, Salario*) e Ítems dentro de los bloques.
4. **Seguridad por JWT:** Autenticación robusta para proteger tus datos a través de headers `Bearer`.
5. **Soporte Dark Mode:** El diseño responde perfectamente entre los modos Claro y Oscuro.
6. **Soporte Multilingüe (i18n):** Total compatibilidad con Inglés, Español y Portugués, fácilmente intercambiable a través de la interfaz.

---

## 📖 Documentación Adicional (Dev)

Si eres desarrollador y deseas entender mejor la arquitectura o la base de datos, explora los archivos de la carpeta `/docs`:
- [Guía Rápida: Go para Devs PHP (Laravel/Codeigniter)](go_for_php_developers.md)
- [Arquitectura del Sistema y Docker](architecture.md)
- [Documentación de Endpoints de la API](api_endpoints.md)
- [Diagrama y Esquema de la Base de Datos](database_schema.md)
- [Guía del Frontend](frontend_guide.md)

---

## 🤝 Cómo Contribuir

1. Haz un **Fork** del repositorio.
2. Crea una rama para tu característica: `git checkout -b mi-caracteristica`.
3. Confirma tus cambios: `git commit -m 'feat: Añadir nueva característica X'`.
4. Empuja a la rama: `git push origin mi-caracteristica`.
5. Abre un **Pull Request**.

---

## 📝 Licencia
Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
