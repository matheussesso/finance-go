# Documentación de Endpoints de la API REST

La API sirve JSON puro y responde en el puerto estandarizado del Backend (ej: `8080`).

## Formato Estándar de Respuesta

**Éxito (200 OK, 201 Created)**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error (400, 401, 404, 500)**:
```json
{
  "success": false,
  "message": "Mensaje descriptivo del error."
}
```

---

## 🔑 Endpoints de Autenticación (Públicos)
- `POST /api/auth/register`: Crea un nuevo `User` (Body: `name`, `email`, `password`).
- `POST /api/auth/login`: Autentica al usuario y devuelve el Token JWT (Body: `email`, `password`).

---

## 🔐 Endpoints Financieros (Requieren Header: `Authorization: Bearer <TOKEN>`)

### Planes (`/api/plannings`)
- `GET /api/plannings`: Lista todos los planes creados por el usuario.
- `GET /api/plannings/{id}`: Devuelve un plan específico, anidando los **bloques** e **ítems**.
- `POST /api/plannings`: Crea un nuevo plan (Body: `month`, `year`, `title`).
- `DELETE /api/plannings/{id}`: Elimina el plan por completo.

### Bloques (`/api/blocks`)
- `GET /api/blocks`: Lista los bloques sueltos.
- `POST /api/blocks`: Crea un nuevo bloque financiero (Body: `planning_id`, `title`, `type`).
- `PUT /api/blocks/{id}`: Actualiza los detalles básicos de un bloque.
- `DELETE /api/blocks/{id}`: Elimina el bloque (y borra todos sus ítems en cascada).

### Ítems (`/api/items`)
- `POST /api/items`: Añade un ítem de gasto/ingreso a un bloque existente (Body: `block_id`, `description`, `amount`, `due_date`, `is_paid`).
- `PUT /api/items/{id}`: Actualiza valores, descripciones o el estado de "pagado".
- `DELETE /api/blocks/{blockId}/items/{itemId}`: Elimina un ítem específico dentro de un bloque.
