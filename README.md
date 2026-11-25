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

For compatibility, `@jantudeb/react-ui/calender` and `@jantudeb/react-ui/react-mardown` remain available. New code should use the correctly spelled `calendar` and `react-markdown` subpaths.

The package expects React 19 and Tailwind CSS with the StudyPath theme tokens available in the consuming application.

## Develop

```bash
pnpm install
pnpm build
```

In the parent pnpm workspace, the package can be used as a Git submodule under `packages/react-ui` with a `workspace:*` dependency.
