# Modelagem do Banco de Dados

A base de dados escolhida para desenvolvimento inicial é o **MariaDB** gerenciado pelo ORM **GORM**. O banco é relacional e mapeado em entidades (structs do Go).

## Entidade: User (Usuários)
Responsável pelo controle de acesso ao sistema.

- `id` (uint, Primary Key): ID único do usuário.
- `name` (varchar): Nome completo.
- `email` (varchar, Unique): E-mail para login.
- `password_hash` (varchar): Senha criptografada (bcrypt).
- `created_at` (datetime): Data de criação.

## Entidade: Block (Blocos de Finanças)
Representa um grupo principal (ex: "Dívida / Credor", "Contas Mãe", "Planejamento").

- `id` (uint, Primary Key): ID único do bloco.
- `user_id` (uint, Foreign Key): Referência ao dono do bloco.
- `title` (varchar): Título visual do bloco.
- `type` (varchar): Tipo lógico do bloco (ex: `despesa`, `receita`, `planejamento`).
- `created_at` (datetime): Data de criação.

## Entidade: Item (Itens da Finança)
Representa uma linha individual dentro de um Bloco (ex: "Banco do Brasil - 900.00").

- `id` (uint, Primary Key): ID do item.
- `block_id` (uint, Foreign Key): Referência ao Bloco (Deletar em cascata).
- `description` (varchar): Descrição textual (ex: Cartão PicPay).
- `amount` (decimal/float): Valor do item (ex: 980.00).
- `is_paid` (boolean): Flag indicando se a conta foi paga ou recebida.
- `due_date` (date): (Opcional) Data de vencimento.
- `created_at` (datetime): Data de criação.

## Relacionamentos
- **User** 1 -> N **Block**: Um usuário possui vários blocos de finanças.
- **Block** 1 -> N **Item**: Um bloco possui vários itens para soma.
