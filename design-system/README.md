# Arcanea Design System

A comprehensive design system for the Arcanea ecosystem, providing consistent styling and components across all platforms.

## Features

- **Modern Dark Theme** with purple/emerald accent colors
- **Responsive Typography** using Inter and Poppins fonts
- **Component Library** with Tailwind CSS
- **Design Tokens** for consistent theming
- **Accessibility** focused components

## Getting Started

1. Install dependencies:
   ```bash
   npm install -D tailwindcss @tailwindcss/typography @tailwindcss/forms
   ```

2. Extend your `tailwind.config.js`:
   ```js
   const arcaneaTheme = require('./styleguide/tailwind.config.js')
   module.exports = arcaneaTheme
   ```

3. Import the base styles in your CSS:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Colors

### Primary Palette
- **Primary (Purple)**: `bg-primary-500` (#8b5cf6)
- **Dark Background**: `bg-dark-900` (#0f0f17)
- **Dark Surface**: `bg-dark-800` (#1a1a2e)

### Accents
- **Emerald (Success/CTA)**: `bg-emerald-500` (#10b981)
- **Warning**: `bg-warning-500` (#f59e0b)
- **Danger**: `bg-danger-500` (#ef4444)

## Typography

### Font Families
- **Sans (Body)**: `font-sans` (Inter)
- **Display**: `font-display` (Poppins)
- **Mono**: `font-mono` (Fira Code)

### Text Sizes
- **Display**: `text-4xl` to `text-7xl`
- **Headings**: `text-2xl` to `text-4xl`
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)

## Components

### Buttons
```html
<!-- Primary -->
<button class="px-6 py-2 rounded-lg bg-primary hover:bg-primary-600">
  Click me
</button>

<!-- CTA -->
<button class="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600">
  Get Started
</button>

<!-- Secondary -->
<button class="px-6 py-2 border border-gray-600 hover:border-primary/50">
  Secondary
</button>
```

### Cards
```html
<div class="bg-dark-800 rounded-xl p-6 border border-dark-700">
  <h3 class="text-xl font-semibold mb-2">Card Title</h3>
  <p class="text-gray-400 mb-4">Card content goes here.</p>
  <button class="text-primary hover:text-primary-300">Action</button>
</div>
```

## Best Practices

1. **Use semantic HTML** for better accessibility
2. **Follow the 8px grid system** for consistent spacing
3. **Use Tailwind's utility classes** instead of custom CSS
4. **Keep components focused** and reusable
5. **Test in dark mode** by default

## Development

To view the style guide locally:
1. Open `styleguide/index.html` in a browser
2. Or run a local server in the `styleguide` directory

## License

MIT
