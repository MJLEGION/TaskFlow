# Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git
- Docker (optional)

### Development Setup

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/taskflow.git
   cd taskflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

Examples:

- `feature/user-authentication`
- `bugfix/task-deletion-error`
- `docs/api-documentation`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(auth): add JWT token refresh mechanism

fix(tasks): resolve task deletion cascade issue

docs(api): update authentication endpoints documentation

test(components): add unit tests for TaskList component
```

## Coding Standards

### JavaScript/TypeScript

We use ESLint and Prettier for code formatting:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix

# Format code
npm run format
```

### Code Style Guidelines

1. **Use TypeScript** for type safety
2. **Functional components** with hooks over class components
3. **Descriptive variable names** - prefer clarity over brevity
4. **Small, focused functions** - single responsibility principle
5. **Consistent naming conventions**:
   - camelCase for variables and functions
   - PascalCase for components and classes
   - UPPER_SNAKE_CASE for constants

### Component Guidelines

```typescript
// ✅ Good
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const handleStatusChange = useCallback(
    (newStatus: TaskStatus) => {
      onUpdate({ ...task, status: newStatus });
    },
    [task, onUpdate]
  );

  return <div className="task-card">{/* Component content */}</div>;
};

// ❌ Avoid
const TaskCard = (props) => {
  return <div>{/* Component content */}</div>;
};
```

### API Guidelines

```typescript
// ✅ Good - Consistent error handling
export const createTask = async (
  taskData: CreateTaskRequest
): Promise<Task> => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw new ApiError("Failed to create task", error);
  }
};

// ✅ Good - Input validation
const validateTaskData = (data: CreateTaskRequest): ValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push("Title must be at least 3 characters");
  }

  if (!data.projectId) {
    errors.push("Project ID is required");
  }

  return { isValid: errors.length === 0, errors };
};
```

## Testing Guidelines

### Test Coverage Requirements

- **Unit Tests**: Minimum 80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user workflows

### Writing Tests

```typescript
// ✅ Good test structure
describe("TaskService", () => {
  describe("createTask", () => {
    it("should create a task with valid data", async () => {
      // Arrange
      const taskData = { title: "Test Task", projectId: "project-1" };
      const expectedTask = { id: "task-1", ...taskData };
      mockRepository.create.mockResolvedValue(expectedTask);

      // Act
      const result = await taskService.createTask(taskData);

      // Assert
      expect(result).toEqual(expectedTask);
      expect(mockRepository.create).toHaveBeenCalledWith(taskData);
    });

    it("should throw error with invalid data", async () => {
      // Arrange
      const invalidData = { title: "" };

      // Act & Assert
      await expect(taskService.createTask(invalidData)).rejects.toThrow(
        "Title is required"
      );
    });
  });
});
```

### Test File Organization

```
src/
├── components/
│   ├── TaskCard/
│   │   ├── TaskCard.tsx
│   │   ├── TaskCard.test.tsx
│   │   └── TaskCard.stories.tsx
│   └── __tests__/
│       └── integration/
└── services/
    ├── TaskService.ts
    └── __tests__/
        └── TaskService.test.ts
```

## Pull Request Process

### Before Submitting

1. **Run tests**: Ensure all tests pass

   ```bash
   npm test
   ```

2. **Check code style**: Fix any linting issues

   ```bash
   npm run lint:fix
   ```

3. **Update documentation**: If you've changed APIs or added features

4. **Add tests**: For new features or bug fixes

### PR Template

When creating a pull request, use this template:

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing** in staging environment
4. **Approval** from project maintainer

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Development Guidelines

### Database Changes

1. **Create migrations** for schema changes
2. **Test migrations** on sample data
3. **Document breaking changes**
4. **Provide rollback procedures**

### API Changes

1. **Version your APIs** for breaking changes
2. **Maintain backward compatibility** when possible
3. **Update API documentation**
4. **Add integration tests**

### Frontend Changes

1. **Test across browsers** (Chrome, Firefox, Safari, Edge)
2. **Ensure responsive design** works on mobile
3. **Check accessibility** (WCAG guidelines)
4. **Update Storybook** stories if applicable

### Performance Considerations

1. **Profile performance** impact of changes
2. **Optimize bundle size** for frontend changes
3. **Consider database query** performance
4. **Add performance tests** for critical paths

## Security Guidelines

### Security Best Practices

1. **Never commit secrets** or credentials
2. **Validate all inputs** on both client and server
3. **Use parameterized queries** to prevent SQL injection
4. **Implement proper authentication** and authorization
5. **Follow OWASP guidelines**

### Security Review Process

1. **Security scan** runs automatically on PRs
2. **Manual security review** for sensitive changes
3. **Penetration testing** for major releases

## Documentation

### Documentation Standards

1. **Code comments** for complex logic
2. **API documentation** using OpenAPI/Swagger
3. **Component documentation** using Storybook
4. **Architecture decisions** recorded in ADRs

### Documentation Updates

- Update relevant documentation with code changes
- Keep README files current
- Update API documentation for endpoint changes
- Add examples for new features

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat with the community
- **Email**: security@taskflow.com for security issues

### Getting Help

1. **Check existing issues** and documentation first
2. **Search Discord** for similar questions
3. **Create a GitHub issue** with detailed information
4. **Join our Discord** for real-time help

### Recognition

Contributors are recognized in:

- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **Annual contributor report**

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Schedule

- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly
- **Major releases**: Quarterly

Thank you for contributing to TaskFlow! Your contributions help make project management better for everyone. 🚀
