# @jantudeb/react-ui

Shared React UI components for StudyPath projects. The component source is synchronized from `JantuDeb/studypath-admin-v2` `dev` branch at commit `11fee41`, with package entry points and portable imports.

## Use

Import from the package root:

```tsx
import { Button, Calendar, Form, MarkdownInput, Table } from "@jantudeb/react-ui"
```

Or import a component group:

```tsx
import { Button } from "@jantudeb/react-ui/buttons"
import { Calendar } from "@jantudeb/react-ui/calendar"
import { Form } from "@jantudeb/react-ui/form"
```

The package expects React 19 and Tailwind CSS with the StudyPath theme tokens available in the consuming application.

## Demo app

The demo uses TanStack Router for navigation and TanStack Table for a sortable data example.

```bash
pnpm install
pnpm demo
```

The demo command builds the component package first, then starts the Vite app. Use `pnpm demo:build` to build both packages.

## Develop

```bash
pnpm build
pnpm dev
```

In the parent pnpm workspace, the package can also be used as a Git submodule under `packages/react-ui` with a `workspace:*` dependency.
