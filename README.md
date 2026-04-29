# @jantudeb/react-ui

Shared React UI components library for StudyPath projects.

## Overview

This package contains reusable React components that can be used across multiple StudyPath projects. It's designed to be used as a Git submodule in a monorepo structure with pnpm.

## Installation

This package is meant to be used as part of a monorepo workspace. It's included as a Git submodule in the `packages/react-ui` directory.

## Usage

### In the main project

Import components directly from the package:

```typescript
import { Button, Form, Card } from '@jantudeb/react-ui'
// Or use subpath imports
import { Button } from '@jantudeb/react-ui/buttons'
import { Form } from '@jantudeb/react-ui/form'
```

## Available Components

- **Alerts**: Alert components
- **Breadcrumb**: Breadcrumb navigation
- **Buttons**: Button, Link, ButtonSubmit
- **Calendar**: Date picker and calendar
- **Cards**: Card components
- **Collapsible**: Collapsible sections
- **Components**: EmptyState and other utility components
- **Dialogs**: AlertDialog, ConfirmationDialog, Dialog, Modal, Sheet
- **File Upload**: File upload components
- **Form**: Form components with validation
- **Hooks**: Custom React hooks (useIsMobile, useMediaQuery, etc.)
- **Inputs**: Input, Checkbox, Radio, Select, Textarea, DatePicker
- **Lib**: Utility functions
- **Loaders**: Loading spinners
- **Menus**: Dropdown menus
- **Popover**: Popover components
- **React Markdown**: Markdown renderer
- **Sidebar**: Sidebar navigation
- **Skeletons**: Loading skeletons
- **Table**: Data table components
- **Tabs**: Tab components
- **Tooltip**: Tooltip components
- **Types**: Shared TypeScript types

## Development

### Building

```bash
pnpm build
```

### Development mode

```bash
pnpm dev
```

This will watch for changes and rebuild automatically.

## Dependencies

This package uses:
- React 19+
- Radix UI components
- Tailwind CSS (peer dependency)
- React Hook Form
- Zod for validation
- And other utility libraries

## Git Submodule Usage

This package is designed to be used as a Git submodule. To use it in a new project:

1. Add as submodule:
```bash
git submodule add https://github.com/JantuDeb/ReactUI.git packages/react-ui
```

2. Initialize and update:
```bash
git submodule update --init --recursive
```

3. Configure your workspace in `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
```

4. Add to your project's dependencies in `package.json`:
```json
{
  "dependencies": {
    "@jantudeb/react-ui": "workspace:*"
  }
}
```

## Making Changes

When making changes to this package:

1. Work in the `packages/react-ui` directory
2. Build the package: `pnpm build`
3. Test in the parent project
4. Commit changes to the ReactUI repository
5. Update the submodule reference in the parent project

## License

- 
