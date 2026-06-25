# API REST Endpoints Documentation

The API serves pure JSON and responds on the standardized Backend port (e.g., `8080`).

## Standard Response Format

**Success (200 OK, 201 Created)**:
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
  "message": "Descriptive error message."
}
```

---

## Authentication Endpoints (Public)
- `POST /api/auth/register`: Creates a new `User` (Body: `name`, `email`, `password`).
- `POST /api/auth/login`: Authenticates the user and returns the JWT Token (Body: `email`, `password`).

---

## Financial Endpoints (Requires Header: `Authorization: Bearer <TOKEN>`)

### Plannings (`/api/plannings`)
- `GET /api/plannings`: Lists all plannings created by the user.
- `GET /api/plannings/{id}`: Returns a specific planning, nesting the **blocks** and **items**.
- `POST /api/plannings`: Creates a new planning (Body: `month`, `year`, `title`).
- `DELETE /api/plannings/{id}`: Removes the entire planning.

### Blocks (`/api/blocks`)
- `GET /api/blocks`: Lists standalone blocks.
- `POST /api/blocks`: Creates a new finance block (Body: `planning_id`, `title`, `type`).
- `PUT /api/blocks/{id}`: Updates the basic details of a block.
- `DELETE /api/blocks/{id}`: Removes the block (cascading deletion of all its items).

### Items (`/api/items`)
- `POST /api/items`: Adds an expense/revenue item to an existing block (Body: `block_id`, `description`, `amount`, `due_date`, `is_paid`).
- `PUT /api/items/{id}`: Updates values, descriptions, or the "paid" status.
- `DELETE /api/blocks/{blockId}/items/{itemId}`: Deletes a specific item inside a block.
