# Project Guidelines

## Core Rules
- **Environment**: Ubuntu Server (Dockerized), Node.js v22, Python 3.10.
- **Documentation**:
  - Architecture & Stack -> `docs/ARCHITECTURE.md`
  - API & Database -> `docs/API_SPECS.md`
- **Tools**:
  - Use `context7` for external docs (React, Django, Tailwind).
  - Use `repomix` sparingly (focus on specific files).
  - Use `postgres` MCP for database migrations and queries.

## Coding Standards

### Backend (Django)
- **Views**: Use `ModelViewSet` for CRUD, `APIView` for custom tools.
- **Serializers**: Always use `ModelSerializer` with explicit `Meta`.
- **Naming**: `snake_case` for functions/vars, `PascalCase` for classes.
- **Services**: Business logic goes to `core/services/`, not views.

### Frontend (React/Vite)
- **Components**: Functional components + Hooks. PascalCase naming.
- **Styling**: **Tailwind CSS 4** only. No custom CSS files (except `index.css`).
  - Use `cn()` helper for class merging.
  - Colors must use CSS variables (oklch) defined in `index.css`.
- **State**: `useState` for local, `react-router` for URL state. No Redux.
- **Imports**: Absolute imports (`@/components/...`).

## Migration Context (Partner -> MyForum)
We are porting features from a Next.js project ("Partner") to this Django/Vite project.
- **Do NOT** copy `next/image` or `next/link`. Use `<img>` and `react-router-dom`.
- **Do NOT** copy Server Components. Convert logic to API calls.
- **KEEP** the visual style (Tailwind classes) exact.
