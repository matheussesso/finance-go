# Modelado del Esquema de Base de Datos

La base de datos elegida para el desarrollo inicial es **MariaDB** gestionada por el ORM **GORM**. La base de datos es relacional y mapeada en entidades (structs de Go).

## Entidad: User (Usuarios)
Responsable del control de acceso al sistema.

- `id` (uint, Primary Key): ID único del usuario.
- `name` (varchar): Nombre completo.
- `email` (varchar, Unique): Correo electrónico para el inicio de sesión.
- `password_hash` (varchar): Contraseña encriptada (bcrypt).
- `created_at` (datetime): Fecha de creación.

## Entidad: Planning (Planes)
Representa un plan mensual de un usuario (Ej: "Vacaciones", o plan de "Agosto/2026").

- `id` (uint, Primary Key): ID único del plan.
- `user_id` (uint, Foreign Key): Referencia al propietario del plan.
- `month` (int): Mes de referencia (1-12).
- `year` (int): Año de referencia.
- `title` (varchar): Nombre opcional del plan.
- `created_at` (datetime): Fecha de creación.

## Entidad: Block (Bloques Financieros)
Representa un grupo principal de cuentas vinculadas a un Plan.

- `id` (uint, Primary Key): ID único del bloque.
- `planning_id` (uint, Foreign Key): Referencia al Plan padre.
- `title` (varchar): Título visual del bloque (ej: "Gastos de Casa").
- `type` (varchar): Tipo lógico del bloque (ej: `expense` [gasto], `revenue` [ingreso]).
- `created_at` (datetime): Fecha de creación.

## Entidad: Item (Ítems Financieros)
Representa una fila individual dentro de un Bloque (ej: "Factura de Luz - 200.00").

- `id` (uint, Primary Key): ID del ítem.
- `block_id` (uint, Foreign Key): Referencia al Bloque (Borrado en cascada).
- `description` (varchar): Descripción textual.
- `amount` (decimal/float): Valor del ítem (ej: 980.00).
- `is_paid` (boolean): Flag que indica si la factura fue pagada o recibida.
- `due_date` (date): (Opcional) Fecha de vencimiento.
- `created_at` (datetime): Fecha de creación.

## Relaciones (Jerarquía)
- **User** 1 -> N **Planning**: Un usuario tiene múltiples planes mensuales.
- **Planning** 1 -> N **Block**: Un plan tiene múltiples bloques financieros (Ingresos, Gastos).
- **Block** 1 -> N **Item**: Un bloque tiene múltiples ítems para sumar el total del bloque.
