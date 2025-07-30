# Frontend Development Guide

## Overview

This guide covers frontend development practices, patterns, and conventions used in TaskFlow. The frontend is built with React 18, TypeScript, and modern development tools.

## Table of Contents

- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Styling Guidelines](#styling-guidelines)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Common/        # Generic components
│   │   ├── Layout/        # Layout components
│   │   ├── Forms/         # Form components
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Dashboard/
│   │   ├── Tasks/
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React Context providers
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   ├── assets/            # Images, fonts, etc.
│   └── styles/            # Global styles
├── tests/                 # Test files
├── docs/                  # Component documentation
└── storybook/             # Storybook configuration
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- VS Code (recommended)

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm start
```

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run type-check # Run TypeScript type checking
npm run storybook  # Start Storybook
```

### VS Code Extensions

Recommended extensions for optimal development experience:

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Prettier - Code formatter
- ESLint

## Component Architecture

### Component Types

#### 1. Presentational Components

Pure components that only handle UI rendering:

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
```

#### 2. Container Components

Components that handle business logic and data fetching:

```typescript
const TaskListContainer: React.FC = () => {
  const { state, actions } = useApp();
  const { tasks, loading, error } = state;
  const { getTasks } = useTaskApi();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        actions.setLoading("tasks", true);
        const tasksData = await getTasks();
        actions.setTasks(tasksData);
      } catch (err) {
        actions.setError("tasks", err.message);
      } finally {
        actions.setLoading("tasks", false);
      }
    };

    loadTasks();
  }, []);

  if (loading.tasks) return <LoadingSpinner />;
  if (error.tasks) return <ErrorMessage message={error.tasks} />;

  return <TaskList tasks={tasks} onTaskUpdate={actions.updateTask} />;
};
```

#### 3. Compound Components

Components that work together as a cohesive unit:

```typescript
const Modal = ({ children, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Modal.Header = ({ children }) => <div className="modal-header">{children}</div>;
Modal.Body = ({ children }) => <div className="modal-body">{children}</div>;
Modal.Footer = ({ children }) => <div className="modal-footer">{children}</div>;

// Usage
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <h2>Confirm Action</h2>
  </Modal.Header>
  <Modal.Body>
    <p>Are you sure you want to delete this task?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleConfirm}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>;
```

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition to build complex components
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Default Props**: Use default parameters instead of defaultProps
5. **Error Boundaries**: Wrap components that might fail in error boundaries

## State Management

### Context API Pattern

TaskFlow uses React Context API with useReducer for global state management:

```typescript
// types/state.ts
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  tasks: Task[];
  projects: Project[];
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

export type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_LOADING"; payload: { key: string; value: boolean } }
  | { type: "SET_ERROR"; payload: { key: string; value: string | null } };

// contexts/AppContext.tsx
const AppContext = createContext<{
  state: AppState;
  actions: AppActions;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = useMemo(
    () => ({
      setUser: (user: User) => dispatch({ type: "SET_USER", payload: user }),
      setTasks: (tasks: Task[]) =>
        dispatch({ type: "SET_TASKS", payload: tasks }),
      addTask: (task: Task) => dispatch({ type: "ADD_TASK", payload: task }),
      updateTask: (task: Task) =>
        dispatch({ type: "UPDATE_TASK", payload: task }),
      deleteTask: (taskId: string) =>
        dispatch({ type: "DELETE_TASK", payload: taskId }),
      setLoading: (key: string, value: boolean) =>
        dispatch({ type: "SET_LOADING", payload: { key, value } }),
      setError: (key: string, value: string | null) =>
        dispatch({ type: "SET_ERROR", payload: { key, value } }),
    }),
    []
  );

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
```

### Local State Management

For component-specific state, use useState and useReducer:

```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Complex state
const [formState, setFormState] = useReducer((state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "RESET":
      return initialFormState;
    default:
      return state;
  }
}, initialFormState);
```

## Custom Hooks

### API Hooks

```typescript
// hooks/useApi.ts
export const useApi = <T>(apiCall: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
};

// Usage
const {
  data: tasks,
  loading,
  error,
  execute: loadTasks,
} = useApi(() => apiService.tasks.getAll());
```

### Form Hooks

```typescript
// hooks/useForm.ts
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;

    const validationErrors = validationSchema.validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};
```

## Styling Guidelines

### Tailwind CSS

TaskFlow uses Tailwind CSS for styling. Follow these conventions:

#### 1. Component-Specific Styles

```typescript
const TaskCard: React.FC<TaskCardProps> = ({ task, isDarkMode }) => {
  const cardClasses = `
    p-4 rounded-lg border transition-all duration-200 hover:shadow-md
    ${
      isDarkMode
        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
        : "bg-white border-gray-200 hover:bg-gray-50"
    }
  `;

  const priorityClasses = {
    low: "text-green-600 bg-green-100",
    medium: "text-yellow-600 bg-yellow-100",
    high: "text-red-600 bg-red-100",
  };

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorityClasses[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {task.description}
      </p>
    </div>
  );
};
```

#### 2. Responsive Design

```typescript
const ResponsiveGrid: React.FC = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {children}
  </div>
);
```

#### 3. Dark Mode Support

```typescript
const ThemeAwareComponent: React.FC = () => {
  const { isDarkMode } = useApp();

  return (
    <div
      className={`
      p-4 rounded-lg
      ${
        isDarkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      }
    `}
    >
      Content
    </div>
  );
};
```

### Custom CSS

For complex animations or styles not possible with Tailwind:

```css
/* styles/animations.css */
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-right {
  animation: slideInFromRight 0.3s ease-out;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks/Tasks"));

// Route-based code splitting
const App: React.FC = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### Memoization

```typescript
// Memoize expensive calculations
const ExpensiveComponent: React.FC<{ data: any[] }> = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      computed: expensiveCalculation(item),
    }));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
};

// Memoize callbacks
const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const handleTaskUpdate = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      // Update logic
    },
    []
  );

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} />
      ))}
    </div>
  );
};

// Memoize components
const TaskItem = React.memo<TaskItemProps>(({ task, onUpdate }) => {
  return <div>{/* Task item content */}</div>;
});
```

### Virtual Scrolling

For large lists, use virtual scrolling:

```typescript
import { FixedSizeList as List } from "react-window";

const VirtualTaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TaskItem task={tasks[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={tasks.length} itemSize={80} width="100%">
      {Row}
    </List>
  );
};
```

## Testing

### Unit Testing

```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  test("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("shows loading state", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
```

### Integration Testing

```typescript
// __tests__/TaskList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { TaskList } from "../TaskList";
import { AppProvider } from "../../contexts/AppContext";

const renderWithProvider = (component: React.ReactElement) => {
  return render(<AppProvider>{component}</AppProvider>);
};

describe("TaskList", () => {
  test("loads and displays tasks", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "completed" },
    ];

    // Mock API call
    jest.spyOn(apiService.tasks, "getAll").mockResolvedValue(mockTasks);

    renderWithProvider(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });
});
```

### E2E Testing

```typescript
// cypress/integration/task-management.spec.ts
describe("Task Management", () => {
  beforeEach(() => {
    cy.login("user@example.com", "password");
    cy.visit("/tasks");
  });

  it("should create a new task", () => {
    cy.get('[data-testid="new-task-button"]').click();
    cy.get('[data-testid="task-title-input"]').type("New Task");
    cy.get('[data-testid="task-description-input"]').type("Task description");
    cy.get('[data-testid="save-task-button"]').click();

    cy.contains("New Task").should("be.visible");
    cy.contains("Task created successfully").should("be.visible");
  });

  it("should update task status", () => {
    cy.get('[data-testid="task-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="status-dropdown"]').click();
        cy.get('[data-testid="status-completed"]').click();
      });

    cy.contains("Task updated successfully").should("be.visible");
  });
});
```

## Best Practices

### 1. Component Organization

- Keep components small and focused
- Use TypeScript for type safety
- Follow consistent naming conventions
- Document complex components

### 2. Performance

- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid inline object/function creation in render
- Use useCallback and useMemo appropriately

### 3. Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

### 4. Error Handling

- Implement error boundaries
- Provide meaningful error messages
- Handle loading and error states
- Log errors for debugging

### 5. Code Quality

- Use ESLint and Prettier
- Write comprehensive tests
- Follow consistent code style
- Document complex logic

### 6. Security

- Sanitize user input
- Validate data on both client and server
- Use HTTPS for all requests
- Implement proper authentication

This guide provides a comprehensive overview of frontend development practices in TaskFlow. For specific implementation details, refer to the component documentation and code examples in the repository.
