# Documentação de Endpoints da API REST

A API serve JSON puro e responde na porta padronizada do Backend (ex: `8080`).

## Formato Padrão de Resposta

**Sucesso (200 OK, 201 Created)**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro (400, 401, 404, 500)**:
```json
{
  "success": false,
  "message": "Mensagem descritiva do erro."
}
```

---

## Endpoints de Autenticação (Públicos)
- `POST /api/auth/register`: Cria um novo `User` (Body: `name`, `email`, `password`).
- `POST /api/auth/login`: Autentica o usuário e retorna o Token JWT (Body: `email`, `password`).

---

## Endpoints Financeiros (Exigem Header: `Authorization: Bearer <TOKEN>`)

### Planejamentos (`/api/plannings`)
- `GET /api/plannings`: Lista todos os planejamentos criados pelo usuário.
- `GET /api/plannings/{id}`: Retorna um planejamento específico, trazendo aninhado os **blocos** e **itens**.
- `POST /api/plannings`: Cria um novo planejamento (Body: `month`, `year`, `title`).
- `DELETE /api/plannings/{id}`: Remove o planejamento inteiro.

### Blocos (`/api/blocks`)
- `GET /api/blocks`: Lista os blocos soltos.
- `POST /api/blocks`: Cria um novo bloco de finança (Body: `planning_id`, `title`, `type`).
- `PUT /api/blocks/{id}`: Atualiza os detalhes básicos de um bloco.
- `DELETE /api/blocks/{id}`: Remove o bloco (e apaga todos os seus itens em cascata).

### Itens (`/api/items`)
- `POST /api/items`: Adiciona um item de despesa/receita a um bloco existente (Body: `block_id`, `description`, `amount`, `due_date`, `is_paid`).
- `PUT /api/items/{id}`: Atualiza valores, descrições ou o status de "pago".
- `DELETE /api/blocks/{blockId}/items/{itemId}`: Exclui um item específico de dentro de um bloco.
