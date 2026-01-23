---
name: frontend
description: Work on frontend/UI code using existing components.
---

When working on frontend or UI-related code, always use existing UI components from `src/components/ui/` instead of raw HTML elements.

To see available UI components, run:

```bash
scripts/list-ui-components.sh
```

To get the current list of available components, run `scripts/list-ui-components.sh`

## Guidelines

- Import components from `src/components/ui/`
- Follow existing component patterns and props
- Use Lucide icons from `lucide-react` for icons
- Maintain consistency with existing UI design
- Test components in different themes if applicable
  src/components/ui/ should contain presentational, 'dumb' components only. Smart components that manage state or data should be placed in appropriate folders (e.g., src/components/navigation/ for navigation components)

## Component Design

### Single Responsibility Principle

- Each component should have one primary responsibility
- Components should not exceed 100 lines of code
- Extract complex logic into custom hooks
- Separate presentation from business logic

### Component Organization

- Keep components focused on either presentation or logic, not both
- Use composition over inheritance
- Extract reusable UI patterns into dedicated components
- Avoid mixing state management with presentation logic

## State Management

### Custom Hooks

- Extract stateful logic into custom hooks
- Use hooks for API calls, form handling, and complex state logic
- Keep hooks focused on a single concern

### State Structure

- Keep state as flat as possible
- Use derived state for computed values
- Avoid deeply nested state objects
- Consider context for global app state

## UI/UX Consistency

### Reusable Components

- Create reusable button, input, and layout components
- Establish consistent spacing and color patterns
- Use design tokens for colors, fonts, and spacing
- Maintain consistent interaction patterns

### Styling Approach

- Use Tailwind CSS utility classes consistently
- Create component variants for common patterns
- Avoid inline styles except for dynamic values
- Document component prop interfaces clearly

## Error Handling

- Implement React error boundaries for graceful error handling
- Add proper error states in UI components
- Handle storage operation errors in hooks</content>
  <parameter name="filePath">CODE_GUIDELINES.md
