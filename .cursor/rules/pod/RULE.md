---
alwaysApply: true
---

You are a Senior Frontend Engineer.

You MUST strictly follow ALL rules below when generating or modifying code in this project.

====================================================
TECH STACK
====================================================

- React (Function Components only)
- TypeScript (strict)
- TailwindCSS (utility-first)
- shadcn/ui (latest version)
- Atomic Design architecture

====================================================
CORE DECISION (NON-NEGOTIABLE)
====================================================

- components/ui represents ATOMS
- UI components are imported directly from components/ui
- No atoms wrapper or re-export layer is allowed
- shadcn/ui is the single source of UI truth

====================================================
PROJECT STRUCTURE
====================================================
components/
├── ui/ → ATOMS (shadcn/ui)
├── molecules/ → Composed UI units
├── organisms/ → Feature-level UI
├── templates/ → Page layouts
└── pages/ → Page composition only

====================================================
ATOMIC DESIGN RULES
====================================================
ATOMS (components/ui)

- Primitive, reusable UI components only
- No business logic
- No API calls
- No application state
- No domain-specific naming
- No feature-specific styling
- Stateless or minimal internal state only

MOLECULES

- MUST compose one or more UI components
- May contain local UI state
- NO API calls
- NO business logic
- NO global state

ORGANISMS

- Feature-level UI
- May contain complex state
- May handle events and orchestration
- MUST delegate business logic to hooks or services

TEMPLATES

- Layout and structural composition only
- NO logic
- NO data fetching

PAGES

- Compose templates and organisms
- Handle routing concerns only
- NO UI primitives

====================================================
IMPORT RULES (VERY IMPORTANT)
====================================================

- UI components MUST be imported directly from components/ui
- UI components MUST NOT be re-exported elsewhere
- Molecules / Organisms / Pages MUST NOT redefine UI primitives
- Relative imports across layers are FORBIDDEN

Correct:
import { Button } from "@/components/ui/button";

Incorrect:
import { Button } from "@/components/atoms/button";
import { Button } from "@/components/ui";

====================================================
COMPONENT RULES
====================================================

- Function components ONLY
- Named exports ONLY
- One component per file
- Component name MUST match file name
- Components must stay under ~150 lines

====================================================
NAMING CONVENTIONS
====================================================

- Component: PascalCase
- Hook: useSomething
- Variable / function: camelCase
- Boolean: is / has / can prefix
- File name: kebab-case or same as component

====================================================
TAILWINDCSS RULES
====================================================

- Utility-first ONLY
- No inline styles
- No CSS modules
- Avoid arbitrary values unless necessary
- Mobile-first responsive design
- Use Tailwind spacing & color tokens

====================================================
STATE & LOGIC RULES
====================================================

- Business logic MUST live in hooks or services
- UI components should be stateless whenever possible
- Avoid useEffect unless necessary
- Do NOT use useMemo / useCallback by default

====================================================
FORM RULES
====================================================

- Controlled forms only
- Validation logic belongs in schema or hooks
- Form UI elements belong to molecules
- Pages handle submit orchestration

====================================================
ERROR & LOADING RULES
====================================================

- Explicit loading, empty, and error states
- Do NOT swallow errors
- User-facing messages must be friendly
- Log technical errors only in development

====================================================
PERFORMANCE RULES
====================================================

- Avoid premature optimization
- Memoization only with proven performance issues
- Prefer simple code over optimized code

====================================================
CODE QUALITY PRINCIPLES
====================================================

- DRY: Do not repeat logic
- SOLID: Single Responsibility is mandatory
- KISS: Prefer simplest solution
- YAGNI: Do not build unused features

====================================================
WHAT NOT TO DO
====================================================

- Do NOT add Redux unless explicitly requested
- Do NOT add Context unless truly global state is required
- Do NOT introduce abstractions without usage
- Do NOT guess requirements
- Do NOT modify shadcn/ui internals

====================================================
FINAL CHECK BEFORE RESPONDING
====================================================
Before generating code, verify:

1. components/ui is used as ATOMS
2. No atoms wrapper layer exists
3. Imports follow rules strictly
4. Atomic boundaries are respected
5. DRY / SOLID / KISS / YAGNI are not violated
6. Code is clean, readable, and minimal

If any rule conflicts or is unclear, ASK before proceeding.
