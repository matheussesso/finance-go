# Modelagem do Banco de Dados

A base de dados escolhida para desenvolvimento inicial é o **MariaDB** gerenciado pelo ORM **GORM**. O banco é relacional e mapeado em entidades (structs do Go).

## Entidade: User (Usuários)
Responsável pelo controle de acesso ao sistema.

- `id` (uint, Primary Key): ID único do usuário.
- `name` (varchar): Nome completo.
- `email` (varchar, Unique): E-mail para login.
- `password_hash` (varchar): Senha criptografada (bcrypt).
- `created_at` (datetime): Data de criação.

## Entidade: Planning (Planejamentos)
Representa um planejamento mensal de um usuário (Ex: "Férias", ou planejamento de "Agosto/2026").

- `id` (uint, Primary Key): ID único do planejamento.
- `user_id` (uint, Foreign Key): Referência ao dono do planejamento.
- `month` (int): Mês de referência (1-12).
- `year` (int): Ano de referência.
- `title` (varchar): Nome opcional do planejamento.
- `created_at` (datetime): Data de criação.

## Entidade: Block (Blocos de Finanças)
Representa um grupo principal de contas vinculadas a um Planejamento.

- `id` (uint, Primary Key): ID único do bloco.
- `planning_id` (uint, Foreign Key): Referência ao Planejamento pai.
- `title` (varchar): Título visual do bloco (ex: "Despesas Casa").
- `type` (varchar): Tipo lógico do bloco (ex: `despesa`, `receita`).
- `created_at` (datetime): Data de criação.

## Entidade: Item (Itens da Finança)
Representa uma linha individual dentro de um Bloco (ex: "Conta de Luz - 200.00").

- `id` (uint, Primary Key): ID do item.
- `block_id` (uint, Foreign Key): Referência ao Bloco (Deletar em cascata).
- `description` (varchar): Descrição textual.
- `amount` (decimal/float): Valor do item (ex: 980.00).
- `is_paid` (boolean): Flag indicando se a conta foi paga ou recebida.
- `due_date` (date): (Opcional) Data de vencimento.
- `created_at` (datetime): Data de criação.

## Relacionamentos (Hierarquia)
- **User** 1 -> N **Planning**: Um usuário possui vários planejamentos mensais.
- **Planning** 1 -> N **Block**: Um planejamento possui vários blocos de finanças (Receitas, Despesas).
- **Block** 1 -> N **Item**: Um bloco possui vários itens para soma do total do bloco.
