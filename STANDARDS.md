# Arcanean Code Standards

## 📚 Table of Contents
1. [Architecture](#-architecture)
2. [Code Style](#-code-style)
3. [Testing](#-testing)
4. [API Design](#-api-design)
5. [State Management](#-state-management)
6. [Documentation](#-documentation)
7. [Git Workflow](#-git-workflow)

## 🏛 Architecture

### Project Structure
```
arcanea/
├── apps/                  # Main applications (web, mobile, etc.)
│   └── web/               # Next.js web application
│   └── mobile/            # React Native application (future)
├── packages/              # Shared packages
│   ├── ui/                # Shared UI components
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utilities
├── docs/                  # Project documentation
└── scripts/               # Build and utility scripts
```

### Design Patterns
- **Frontend**: Component-based architecture with atomic design principles
- **State Management**: React Context for global state, React Query for server state
- **Styling**: Tailwind CSS with CSS Modules for component-scoped styles
- **API Layer**: tRPC for type-safe API calls

## 🎨 Code Style

### TypeScript
- Strict mode enabled
- Explicit return types for exported functions
- Use interfaces for public API definitions
- Prefer `type` over `interface` for internal types

### Naming Conventions
- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with `I` prefix (e.g., `IUserProfile`)

## 🧪 Testing

### Test Structure
```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx  # Unit tests
│       └── Button.stories.tsx  # Storybook stories
└── __tests__/
    └── integration/    # Integration tests
```

### Testing Standards
- **Unit Tests**: 80% minimum coverage
- **Integration Tests**: For critical user flows
- **E2E Tests**: Using Cypress for web, Detox for mobile
- **Snapshot Testing**: For UI components

## 🌐 API Design

### RESTful Standards
- Use nouns instead of verbs in endpoint paths
- Version your API (e.g., `/api/v1/users`)
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Return appropriate HTTP status codes

### Error Handling
```typescript
{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Please provide a valid email address",
    "details": {
      "field": "email"
    }
  }
}
```

## 📱 State Management

### Global State
- React Context for app-wide state
- Redux Toolkit for complex state logic
- React Query for server state

### Local State
- `useState` for simple component state
- `useReducer` for complex state logic
- Custom hooks for reusable stateful logic

## 📝 Documentation

### Code Comments
- JSDoc for all public APIs
- Inline comments for complex logic
- `// TODO:` for pending improvements

### Project Documentation
- `README.md` in each package
- Storybook for UI components
- Swagger/OpenAPI for API documentation

## 🔄 Git Workflow

### Branch Naming
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `chore/` - Maintenance tasks

### Commit Messages
Follow Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code changes that don't fix bugs or add features
- `perf:` Performance improvements
- `test:` Adding or modifying tests
- `chore:` Changes to build process or auxiliary tools

## 🛠 Development Tools

### Required Tools
- Node.js 18+
- pnpm 8+
- Docker (for local development)

### VS Code Extensions
- ESLint
- Prettier
- Stylelint
- EditorConfig
- GitLens

## 🔒 Security

### Best Practices
- Never commit secrets to version control
- Use environment variables for configuration
- Regular dependency updates
- Security headers for web applications
- Input validation on both client and server

## 🚀 Deployment

### Environments
- `development` - Local development
- `staging` - Pre-production testing
- `production` - Live environment

### CI/CD
- Automated tests on every push
- Automated deployments to staging on `main` branch
- Manual approval for production deployments

---

*Last updated: June 2025*
