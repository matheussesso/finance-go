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

## Endpoints de Autenticação (Auth)
- `POST /api/auth/register`: Cria um novo `User` (Body: name, email, password).
- `POST /api/auth/login`: Autentica o usuário e retorna o Token JWT (Body: email, password).

## Endpoints de Finanças (Necessitam Bearer Token JWT)
**Blocos (`/api/blocks`)**
- `GET /api/blocks`: Lista todos os blocos do usuário logado e seus itens.
- `POST /api/blocks`: Cria um novo bloco (Body: title, type).
- `PUT /api/blocks/{id}`: Atualiza um bloco.
- `DELETE /api/blocks/{id}`: Remove o bloco (e todos os itens internos em cascata).

**Itens (`/api/items`)**
- `POST /api/items`: Adiciona um item a um bloco existente (Body: block_id, description, amount).
- `PUT /api/items/{id}`: Atualiza valores/status do item.
- `DELETE /api/items/{id}`: Exclui um item.
