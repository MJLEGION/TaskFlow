# TaskFlow API Documentation

## Overview

The TaskFlow API is a RESTful web service that provides programmatic access to all TaskFlow features. This documentation covers authentication, endpoints, request/response formats, and examples.

## Base URL

```
Production: https://api.taskflow.com/v1
Staging: https://staging-api.taskflow.com/v1
Development: http://localhost:5000/api/v1
```

## Authentication

TaskFlow uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}
```

## Pagination

List endpoints support pagination using query parameters:

```http
GET /tasks?page=1&limit=20&sort=created_at&order=desc
```

**Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (default: created_at)
- `order`: Sort order (asc/desc, default: desc)

**Response includes pagination metadata:**

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248600
```

## Endpoints

### Authentication

#### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register

```http
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

### Users

#### Get Current User

```http
GET /users/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /users/me
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "newemail@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get Users

```http
GET /users?search=john&role=user&page=1&limit=20
Authorization: Bearer <token>
```

### Projects

#### Get Projects

```http
GET /projects?status=active&owner=me&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**

- `status`: Filter by status (active, completed, archived)
- `owner`: Filter by owner (me, user_id)
- `search`: Search in name and description

#### Create Project

```http
POST /projects
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "active",
  "priority": "high",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "members": ["user_id_1", "user_id_2"]
}
```

#### Get Project

```http
GET /projects/:id
Authorization: Bearer <token>
```

#### Update Project

```http
PUT /projects/:id
Authorization: Bearer <token>
```

#### Delete Project

```http
DELETE /projects/:id
Authorization: Bearer <token>
```

#### Get Project Members

```http
GET /projects/:id/members
Authorization: Bearer <token>
```

#### Add Project Member

```http
POST /projects/:id/members
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "userId": "user_id",
  "role": "member"
}
```

### Tasks

#### Get Tasks

```http
GET /tasks?project=project_id&assignee=user_id&status=todo&priority=high&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**

- `project`: Filter by project ID
- `assignee`: Filter by assignee ID (me for current user)
- `status`: Filter by status (todo, in_progress, review, completed)
- `priority`: Filter by priority (low, medium, high)
- `search`: Search in title and description
- `due_date`: Filter by due date (today, week, month, overdue)

#### Create Task

```http
POST /tasks
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "New Task",
  "description": "Task description",
  "projectId": "project_id",
  "assigneeId": "user_id",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2024-01-20T10:00:00Z",
  "estimatedHours": 8,
  "tags": ["frontend", "urgent"]
}
```

#### Get Task

```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task

```http
PUT /tasks/:id
Authorization: Bearer <token>
```

#### Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### Assign Task

```http
PUT /tasks/:id/assign
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "assigneeId": "user_id"
}
```

#### Add Task Comment

```http
POST /tasks/:id/comments
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "This is a comment",
  "mentions": ["user_id_1", "user_id_2"]
}
```

#### Get Task Comments

```http
GET /tasks/:id/comments?page=1&limit=20
Authorization: Bearer <token>
```

#### Upload Task Attachment

```http
POST /tasks/:id/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

- `file`: File to upload
- `description`: Optional file description

### Time Tracking

#### Get Time Entries

```http
GET /time?user=me&project=project_id&task=task_id&date_from=2024-01-01&date_to=2024-01-31
Authorization: Bearer <token>
```

#### Start Time Tracking

```http
POST /time/start
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "taskId": "task_id",
  "description": "Working on feature implementation"
}
```

#### Stop Time Tracking

```http
POST /time/stop
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "entryId": "entry_id"
}
```

#### Create Manual Time Entry

```http
POST /time
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "taskId": "task_id",
  "description": "Manual time entry",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T17:00:00Z",
  "duration": 28800
}
```

### Notifications

#### Get Notifications

```http
GET /notifications?read=false&type=task_assigned&page=1&limit=20
Authorization: Bearer <token>
```

#### Mark Notification as Read

```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All Notifications as Read

```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

#### Delete Notification

```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

### Analytics

#### Get Dashboard Analytics

```http
GET /analytics/dashboard?period=month&project=project_id
Authorization: Bearer <token>
```

#### Get Productivity Metrics

```http
GET /analytics/productivity?user=me&period=week
Authorization: Bearer <token>
```

#### Get Time Analytics

```http
GET /analytics/time?project=project_id&period=month&group_by=user
Authorization: Bearer <token>
```

#### Get Project Analytics

```http
GET /analytics/projects/:id?period=month
Authorization: Bearer <token>
```

## Webhooks

TaskFlow supports webhooks for real-time notifications:

### Webhook Events

- `task.created`
- `task.updated`
- `task.deleted`
- `task.assigned`
- `task.completed`
- `project.created`
- `project.updated`
- `project.deleted`
- `user.joined`
- `comment.added`

### Webhook Payload

```json
{
  "event": "task.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "task": {
      "id": "task_id",
      "title": "New Task",
      "status": "todo",
      "assignee": {
        "id": "user_id",
        "name": "John Doe"
      }
    }
  }
}
```

### Setting up Webhooks

```http
POST /webhooks
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "url": "https://your-app.com/webhook",
  "events": ["task.created", "task.updated"],
  "secret": "your-webhook-secret"
}
```

## Error Codes

| Code                   | Description                               |
| ---------------------- | ----------------------------------------- |
| `VALIDATION_ERROR`     | Request validation failed                 |
| `AUTHENTICATION_ERROR` | Authentication required or failed         |
| `AUTHORIZATION_ERROR`  | Insufficient permissions                  |
| `NOT_FOUND`            | Resource not found                        |
| `CONFLICT`             | Resource conflict (e.g., duplicate email) |
| `RATE_LIMIT_EXCEEDED`  | Too many requests                         |
| `INTERNAL_ERROR`       | Internal server error                     |
| `SERVICE_UNAVAILABLE`  | Service temporarily unavailable           |

## SDKs and Libraries

Official SDKs are available for popular programming languages:

- **JavaScript/Node.js**: `npm install @taskflow/sdk`
- **Python**: `pip install taskflow-sdk`
- **PHP**: `composer require taskflow/sdk`
- **Ruby**: `gem install taskflow-sdk`
- **Go**: `go get github.com/taskflow/go-sdk`

### JavaScript SDK Example

```javascript
import TaskFlow from "@taskflow/sdk";

const client = new TaskFlow({
  apiKey: "your-api-key",
  baseURL: "https://api.taskflow.com/v1",
});

// Get tasks
const tasks = await client.tasks.list({
  status: "todo",
  assignee: "me",
});

// Create task
const newTask = await client.tasks.create({
  title: "New Task",
  description: "Task description",
  projectId: "project-id",
});
```

## Testing

Use our sandbox environment for testing:

```
Sandbox URL: https://sandbox-api.taskflow.com/v1
Test API Key: test_sk_1234567890abcdef
```

The sandbox environment includes:

- Sample data for testing
- All API endpoints available
- No rate limiting
- Data reset daily

## Support

- **API Documentation**: https://docs.taskflow.com/api
- **Status Page**: https://status.taskflow.com
- **Support Email**: api-support@taskflow.com
- **Discord**: https://discord.gg/taskflow-api

## Changelog

### v1.2.0 (2024-01-15)

- Added webhook support
- New analytics endpoints
- Improved error handling
- Performance optimizations

### v1.1.0 (2023-12-01)

- Added time tracking endpoints
- Enhanced search capabilities
- New notification system
- Bug fixes and improvements

### v1.0.0 (2023-10-01)

- Initial API release
- Core CRUD operations
- Authentication system
- Basic analytics
