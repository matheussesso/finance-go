# Database Schema Modeling

The chosen database for initial development is **MariaDB** managed by the **GORM** ORM. The database is relational and mapped into entities (Go structs).

## Entity: User
Responsible for access control to the system.

- `id` (uint, Primary Key): Unique user ID.
- `name` (varchar): Full name.
- `email` (varchar, Unique): Email for login.
- `password_hash` (varchar): Encrypted password (bcrypt).
- `created_at` (datetime): Creation date.

## Entity: Planning
Represents a monthly plan for a user (e.g., "Vacation", or "August/2026" plan).

- `id` (uint, Primary Key): Unique planning ID.
- `user_id` (uint, Foreign Key): Reference to the planning owner.
- `month` (int): Reference month (1-12).
- `year` (int): Reference year.
- `title` (varchar): Optional planning name.
- `created_at` (datetime): Creation date.

## Entity: Block (Finance Blocks)
Represents a main group of accounts linked to a Planning.

- `id` (uint, Primary Key): Unique block ID.
- `planning_id` (uint, Foreign Key): Reference to the parent Planning.
- `title` (varchar): Visual title of the block (e.g., "Home Expenses").
- `type` (varchar): Logical type of the block (e.g., `expense`, `revenue`).
- `created_at` (datetime): Creation date.

## Entity: Item (Finance Items)
Represents an individual row inside a Block (e.g., "Electricity Bill - 200.00").

- `id` (uint, Primary Key): Item ID.
- `block_id` (uint, Foreign Key): Reference to the Block (Cascade delete).
- `description` (varchar): Textual description.
- `amount` (decimal/float): Item value (e.g., 980.00).
- `is_paid` (boolean): Flag indicating if the bill was paid or received.
- `due_date` (date): (Optional) Due date.
- `created_at` (datetime): Creation date.

## Relationships (Hierarchy)
- **User** 1 -> N **Planning**: A user has multiple monthly plannings.
- **Planning** 1 -> N **Block**: A planning has multiple finance blocks (Revenues, Expenses).
- **Block** 1 -> N **Item**: A block has multiple items to sum the total of the block.
