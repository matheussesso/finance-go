# Frontend Structure Guide (React + Tailwind)

The reactive interface was developed using **Vite** for fast bundling and **React** for logical components, running stably on NGINX via Docker.

## Layout and UX
We adopted a modern **Unified Dashboard** approach.
- **Calendar and List Together:** The user no longer needs to transition between views. The calendar acts as a Sidebar/Widget (on the right column), and the `Blocks` list on the main area (left), cleanly taking advantage of Tailwind CSS columns.
- **Micro-interactions:** The entire UI has transitions using `transition-colors`, `hover:bg`, and quick effects (e.g., opacity on the "New Item" button inside the calendar).

## Data Entry Modals
We replaced static forms on the main screen with **Modals**:
- `Portal` architecture in React or conditional state, ensuring that the *Create Block* or *Add Item* actions overlap the screen with a blurred background (`backdrop-blur`).
- Focused components were implemented: `BlockFormModal` and `ItemFormModal`.

## Documentation
- **JSDoc Standards:** All `.js` and `.jsx` files must include comprehensive **JSDoc comments** in English. These comments explain what each component or file does, its parameters, and return types.

## Logical Componentization
To keep the design scalable, the project uses:
- `/src/components`: Focused and independent reusable components like `Modal`, `BlockFormModal`, `ItemFormModal`, `CalendarView`.
- `/src/pages`: Main aggregator views (e.g., `Login.jsx`, `Dashboard.jsx`).
- `/src/services`: `axios` functions with centralized interceptors (injecting the Bearer JWT token and handling API requests).

## Styling (TailwindCSS)
All styling uses utility classes within the JSX itself. The design focus:
- Semantic and clean use of Tailwind (`rounded-md`, `border-gray-200`, `shadow-sm`).
- **Dark Mode**: Every component in the platform supports the `dark:` prefix.
- Dynamic colors injected directly into the class based on logic (e.g., `bg-emerald-100` vs `bg-rose-100`).
- **Styling:** We use TailwindCSS. The design must be modern and premium, supporting `dark` mode.
- **Responsiveness:** All components must be built mobile-first using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`). Flexible grids and stacking layouts must be used to ensure the application works on all device sizes.

## State Management
For this application, finances do not require (initially) robust management libraries like Redux:
- **State Management:** Simple Context API for Authentication and Theme.
- Heavy use of `useState` and `useEffect` to load the base list of the active Planning (Plannings and their corresponding Blocks).
- Use of **Context API (`AuthContext`)** to check the user's session and store the JWT Token across all screens.
- Requests made via the service layer reload the UI and reactively close modals.
