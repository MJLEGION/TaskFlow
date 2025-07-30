# Testing Guide

## Overview

TaskFlow follows a comprehensive testing strategy that includes unit tests, integration tests, end-to-end tests, and performance tests. This guide covers testing practices, tools, and conventions used throughout the project.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)
- [Test Data Management](#test-data-management)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## Testing Philosophy

TaskFlow follows the testing pyramid approach:

```
    /\
   /  \
  / E2E \     <- Few, high-level tests
 /______\
/        \
| Integration |  <- Some integration tests
|____________|
|            |
|    Unit     |  <- Many, fast unit tests
|____________|
```

### Testing Principles

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Write Tests First**: Use TDD/BDD when possible
3. **Keep Tests Simple**: Each test should verify one specific behavior
4. **Make Tests Independent**: Tests should not depend on each other
5. **Use Descriptive Names**: Test names should clearly describe what is being tested

## Testing Stack

### Frontend Testing

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking
- **Cypress**: End-to-end testing
- **Storybook**: Component testing and documentation

### Backend Testing

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library
- **Test Containers**: Integration testing with real databases
- **Artillery**: Load testing

### Code Coverage

- **Istanbul/NYC**: Code coverage reporting
- **Coveralls**: Coverage tracking service

## Test Structure

### Directory Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── __tests__/
│   │   ├── pages/
│   │   │   └── __tests__/
│   │   ├── hooks/
│   │   │   └── __tests__/
│   │   └── utils/
│   │       └── __tests__/
│   ├── cypress/
│   │   ├── integration/
│   │   ├── fixtures/
│   │   └── support/
│   └── __mocks__/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── __tests__/
│   │   ├── services/
│   │   │   └── __tests__/
│   │   └── utils/
│   │       └── __tests__/
│   └── tests/
│       ├── integration/
│       ├── fixtures/
│       └── helpers/
└── e2e/
    ├── specs/
    ├── fixtures/
    └── support/
```

### Test File Naming

- Unit tests: `ComponentName.test.tsx` or `functionName.test.ts`
- Integration tests: `ComponentName.integration.test.tsx`
- E2E tests: `feature-name.spec.ts`

## Unit Testing

### Frontend Unit Tests

#### Component Testing

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("applies correct variant classes", () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-500");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is accessible", () => {
    render(<Button aria-label="Close dialog">×</Button>);
    expect(screen.getByLabelText(/close dialog/i)).toBeInTheDocument();
  });
});
```

#### Hook Testing

```typescript
// hooks/__tests__/useApi.test.ts
import { renderHook, act } from "@testing-library/react";
import { useApi } from "../useApi";

const mockApiCall = jest.fn();

describe("useApi Hook", () => {
  beforeEach(() => {
    mockApiCall.mockClear();
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useApi(mockApiCall));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful API call", async () => {
    const mockData = { id: 1, name: "Test" };
    mockApiCall.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiCall));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle API call errors", async () => {
    const errorMessage = "API Error";
    mockApiCall.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useApi(mockApiCall));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});
```

#### Utility Function Testing

```typescript
// utils/__tests__/dateUtils.test.ts
import { formatDate, isOverdue, getDaysUntilDue } from "../dateUtils";

describe("Date Utils", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      expect(formatDate(date)).toBe("Jan 15, 2024");
    });

    it("handles invalid dates", () => {
      expect(formatDate(null)).toBe("Invalid Date");
      expect(formatDate(undefined)).toBe("Invalid Date");
    });
  });

  describe("isOverdue", () => {
    it("returns true for past dates", () => {
      const pastDate = new Date("2023-01-01");
      expect(isOverdue(pastDate)).toBe(true);
    });

    it("returns false for future dates", () => {
      const futureDate = new Date("2025-01-01");
      expect(isOverdue(futureDate)).toBe(false);
    });
  });

  describe("getDaysUntilDue", () => {
    it("calculates days correctly", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(getDaysUntilDue(tomorrow)).toBe(1);
    });
  });
});
```

### Backend Unit Tests

#### Controller Testing

```typescript
// controllers/__tests__/taskController.test.ts
import request from "supertest";
import app from "../../app";
import { TaskService } from "../../services/TaskService";

jest.mock("../../services/TaskService");
const mockTaskService = TaskService as jest.Mocked<typeof TaskService>;

describe("Task Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1", status: "todo" },
        { id: "2", title: "Task 2", status: "completed" },
      ];

      mockTaskService.getAllTasks.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer valid-token")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTasks);
    });

    it("should handle service errors", async () => {
      mockTaskService.getAllTasks.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer valid-token")
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe("Database error");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const newTask = { title: "New Task", description: "Task description" };
      const createdTask = { id: "3", ...newTask, status: "todo" };

      mockTaskService.createTask.mockResolvedValue(createdTask);

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", "Bearer valid-token")
        .send(newTask)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(createdTask);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", "Bearer valid-token")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
```

#### Service Testing

```typescript
// services/__tests__/TaskService.test.ts
import { TaskService } from "../TaskService";
import { TaskRepository } from "../repositories/TaskRepository";
import { NotificationService } from "../NotificationService";

jest.mock("../repositories/TaskRepository");
jest.mock("../NotificationService");

const mockTaskRepository = TaskRepository as jest.Mocked<typeof TaskRepository>;
const mockNotificationService = NotificationService as jest.Mocked<
  typeof NotificationService
>;

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task and send notification", async () => {
      const taskData = { title: "New Task", assigneeId: "user-1" };
      const createdTask = { id: "task-1", ...taskData, status: "todo" };

      mockTaskRepository.create.mockResolvedValue(createdTask);

      const result = await taskService.createTask(taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
      expect(
        mockNotificationService.sendTaskAssignedNotification
      ).toHaveBeenCalledWith(createdTask);
      expect(result).toEqual(createdTask);
    });

    it("should handle repository errors", async () => {
      const taskData = { title: "New Task" };
      mockTaskRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(taskService.createTask(taskData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status and send notification", async () => {
      const taskId = "task-1";
      const newStatus = "completed";
      const updatedTask = { id: taskId, status: newStatus, title: "Task" };

      mockTaskRepository.findById.mockResolvedValue({
        id: taskId,
        status: "todo",
      });
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTaskStatus(taskId, newStatus);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
        status: newStatus,
      });
      expect(
        mockNotificationService.sendTaskCompletedNotification
      ).toHaveBeenCalledWith(updatedTask);
      expect(result).toEqual(updatedTask);
    });
  });
});
```

## Integration Testing

### Frontend Integration Tests

```typescript
// components/__tests__/TaskList.integration.test.tsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { TaskList } from "../TaskList";
import { AppProvider } from "../../contexts/AppContext";

const server = setupServer(
  rest.get("/api/tasks", (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          { id: "1", title: "Task 1", status: "todo" },
          { id: "2", title: "Task 2", status: "completed" },
        ],
      })
    );
  }),

  rest.put("/api/tasks/:id", (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        success: true,
        data: { id, title: "Updated Task", status: "completed" },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProvider = (component: React.ReactElement) => {
  return render(<AppProvider>{component}</AppProvider>);
};

describe("TaskList Integration", () => {
  it("should load and display tasks from API", async () => {
    renderWithProvider(<TaskList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should update task status", async () => {
    renderWithProvider(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const statusButton = screen.getByTestId("task-1-status");
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(screen.getByText(/task updated/i)).toBeInTheDocument();
    });
  });

  it("should handle API errors gracefully", async () => {
    server.use(
      rest.get("/api/tasks", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Server error" }));
      })
    );

    renderWithProvider(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument();
    });
  });
});
```

### Backend Integration Tests

```typescript
// tests/integration/taskRoutes.integration.test.ts
import request from "supertest";
import { setupTestDatabase, cleanupTestDatabase } from "../helpers/database";
import app from "../../src/app";

describe("Task Routes Integration", () => {
  let authToken: string;

  beforeAll(async () => {
    await setupTestDatabase();

    // Create test user and get auth token
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    authToken = response.body.data.token;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe("Task CRUD Operations", () => {
    let taskId: string;

    it("should create a new task", async () => {
      const taskData = {
        title: "Integration Test Task",
        description: "This is a test task",
        priority: "medium",
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);

      taskId = response.body.data.id;
    });

    it("should retrieve the created task", async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });

    it("should update the task", async () => {
      const updateData = { title: "Updated Task Title" };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it("should delete the task", async () => {
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verify task is deleted
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

## End-to-End Testing

### Cypress E2E Tests

```typescript
// cypress/integration/task-management.spec.ts
describe("Task Management", () => {
  beforeEach(() => {
    cy.login("test@example.com", "password123");
    cy.visit("/tasks");
  });

  it("should complete the full task lifecycle", () => {
    // Create a new task
    cy.get('[data-testid="new-task-button"]').click();
    cy.get('[data-testid="task-title-input"]').type("E2E Test Task");
    cy.get('[data-testid="task-description-input"]').type(
      "This is an E2E test task"
    );
    cy.get('[data-testid="task-priority-select"]').select("High");
    cy.get('[data-testid="save-task-button"]').click();

    // Verify task appears in list
    cy.contains("E2E Test Task").should("be.visible");
    cy.contains("Task created successfully").should("be.visible");

    // Update task status
    cy.get('[data-testid="task-item"]')
      .contains("E2E Test Task")
      .parent()
      .within(() => {
        cy.get('[data-testid="status-dropdown"]').click();
        cy.get('[data-testid="status-in-progress"]').click();
      });

    cy.contains("Task updated successfully").should("be.visible");

    // Add a comment
    cy.get('[data-testid="task-item"]').contains("E2E Test Task").click();

    cy.get('[data-testid="comment-input"]').type("This is a test comment");
    cy.get('[data-testid="add-comment-button"]').click();

    cy.contains("This is a test comment").should("be.visible");

    // Complete the task
    cy.get('[data-testid="status-dropdown"]').click();
    cy.get('[data-testid="status-completed"]').click();

    cy.contains("Task completed successfully").should("be.visible");

    // Verify task appears in completed section
    cy.get('[data-testid="completed-tasks"]').within(() => {
      cy.contains("E2E Test Task").should("be.visible");
    });
  });

  it("should handle task filtering and search", () => {
    // Test search functionality
    cy.get('[data-testid="search-input"]').type("E2E Test");
    cy.get('[data-testid="search-results"]').should("contain", "E2E Test Task");

    // Test filtering
    cy.get('[data-testid="filter-button"]').click();
    cy.get('[data-testid="priority-filter"]').select("High");
    cy.get('[data-testid="apply-filters-button"]').click();

    cy.get('[data-testid="task-list"]').should("contain", "E2E Test Task");

    // Clear filters
    cy.get('[data-testid="clear-filters-button"]').click();
    cy.get('[data-testid="task-list"]').should("be.visible");
  });
});
```

### Custom Cypress Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createTask(taskData: any): Chainable<void>;
      deleteAllTasks(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem("authToken", response.body.data.token);
  });
});

Cypress.Commands.add("createTask", (taskData) => {
  const token = window.localStorage.getItem("authToken");
  cy.request({
    method: "POST",
    url: "/api/tasks",
    headers: { Authorization: `Bearer ${token}` },
    body: taskData,
  });
});

Cypress.Commands.add("deleteAllTasks", () => {
  const token = window.localStorage.getItem("authToken");
  cy.request({
    method: "DELETE",
    url: "/api/tasks/all",
    headers: { Authorization: `Bearer ${token}` },
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery/load-test.yml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Stress test"
  variables:
    auth_token: "{{ $processEnvironment.AUTH_TOKEN }}"

scenarios:
  - name: "Task operations"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.data.token"
              as: "auth_token"
      - get:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ auth_token }}"
      - post:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ auth_token }}"
          json:
            title: "Load test task {{ $randomString() }}"
            description: "This is a load test task"

  - name: "Project operations"
    weight: 30
    flow:
      - get:
          url: "/api/projects"
          headers:
            Authorization: "Bearer {{ auth_token }}"
```

### Frontend Performance Testing

```typescript
// tests/performance/component-performance.test.tsx
import { render } from "@testing-library/react";
import { performance } from "perf_hooks";
import { TaskList } from "../../src/components/TaskList";

describe("Component Performance", () => {
  it("should render large task list within acceptable time", () => {
    const largeTasks = Array.from({ length: 1000 }, (_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      status: "todo",
      priority: "medium",
    }));

    const startTime = performance.now();
    render(<TaskList tasks={largeTasks} />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
  });

  it("should handle frequent updates efficiently", () => {
    const tasks = Array.from({ length: 100 }, (_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      status: "todo",
    }));

    const { rerender } = render(<TaskList tasks={tasks} />);

    const startTime = performance.now();

    // Simulate 10 updates
    for (let i = 0; i < 10; i++) {
      const updatedTasks = tasks.map((task) => ({
        ...task,
        title: `Updated Task ${task.id} - ${i}`,
      }));
      rerender(<TaskList tasks={updatedTasks} />);
    }

    const endTime = performance.now();
    const updateTime = endTime - startTime;

    expect(updateTime).toBeLessThan(50); // Should update in less than 50ms
  });
});
```

## Test Data Management

### Test Fixtures

```typescript
// tests/fixtures/tasks.ts
export const mockTasks = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the project",
    status: "todo",
    priority: "high",
    assigneeId: "user-1",
    projectId: "project-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Fix authentication bug",
    description: "Resolve issue with JWT token expiration",
    status: "in_progress",
    priority: "medium",
    assigneeId: "user-2",
    projectId: "project-1",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

export const mockProjects = [
  {
    id: "project-1",
    name: "TaskFlow Development",
    description: "Main development project for TaskFlow",
    status: "active",
    ownerId: "user-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];
```

### Database Test Helpers

```typescript
// tests/helpers/database.ts
import { Pool } from "pg";
import { migrate } from "../migrations";

let testDb: Pool;

export const setupTestDatabase = async () => {
  testDb = new Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  });

  // Run migrations
  await migrate(testDb);

  // Seed test data
  await seedTestData();
};

export const cleanupTestDatabase = async () => {
  if (testDb) {
    await testDb.query("TRUNCATE TABLE tasks, projects, users CASCADE");
    await testDb.end();
  }
};

export const seedTestData = async () => {
  // Insert test users
  await testDb.query(`
    INSERT INTO users (id, name, email, password_hash)
    VALUES 
      ('user-1', 'Test User 1', 'test1@example.com', '$2b$10$hash1'),
      ('user-2', 'Test User 2', 'test2@example.com', '$2b$10$hash2')
  `);

  // Insert test projects
  await testDb.query(`
    INSERT INTO projects (id, name, description, owner_id)
    VALUES ('project-1', 'Test Project', 'Test project description', 'user-1')
  `);
};
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: taskflow_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run frontend tests
        run: |
          cd frontend
          npm test -- --coverage --watchAll=false

      - name: Run backend tests
        run: |
          cd backend
          npm test -- --coverage --watchAll=false
        env:
          TEST_DATABASE_URL: postgresql://postgres:postgres@localhost:5432/taskflow_test

      - name: Upload coverage to Coveralls
        uses: coverallsapp/github-action@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Start services
        run: docker-compose -f docker-compose.test.yml up -d

      - name: Wait for services
        run: sleep 30

      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Start application
        run: |
          npm run build
          npm start &
          sleep 30

      - name: Run Cypress tests
        uses: cypress-io/github-action@v4
        with:
          working-directory: frontend
          wait-on: "http://localhost:3000"
          wait-on-timeout: 120
```

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests focused on a single behavior

### 2. Test Data

- Use factories or fixtures for consistent test data
- Avoid hardcoded values in tests
- Clean up test data after each test
- Use realistic but minimal test data

### 3. Mocking

- Mock external dependencies and APIs
- Use MSW for API mocking in frontend tests
- Mock at the boundary (services, not internal functions)
- Verify mock interactions when relevant

### 4. Assertions

- Use specific assertions that clearly express intent
- Test both positive and negative cases
- Include edge cases and error conditions
- Use custom matchers for complex assertions

### 5. Performance

- Keep tests fast and focused
- Use parallel test execution when possible
- Mock expensive operations
- Profile slow tests and optimize them

### 6. Maintenance

- Update tests when requirements change
- Remove obsolete tests
- Refactor test code like production code
- Document complex test scenarios

This comprehensive testing guide ensures TaskFlow maintains high quality and reliability through thorough automated testing at all levels.
