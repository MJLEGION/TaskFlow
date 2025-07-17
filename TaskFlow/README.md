# TaskFlow

TaskFlow is a full-stack project management application designed to streamline task and project tracking for teams and individuals. This repository contains both the backend API (Node.js/Express/PostgreSQL) and the frontend (React/Tailwind CSS).

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Continuous Integration](#continuous-integration)
- [Security & Branch Protection](#security--branch-protection)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication and authorization (JWT)
- Project, task, and time entry management
- Responsive React frontend with Tailwind CSS
- RESTful API with Express.js
- PostgreSQL database with migration scripts
- Automated CI pipeline for linting and testing

---

## Project Structure

```
TaskFlow/
├── backend/         # Node.js/Express API, migrations, tests
├── frontend/        # React app (with Tailwind CSS)
├── .github/         # GitHub Actions workflows, issue/PR templates
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Backend Setup

```bash
cd backend
npm install
# Configure your .env file (see .env.example if available)
npm run migrate   # Run database migrations
npm run dev       # Start backend in development mode
```

### Frontend Setup

```bash
cd frontend
npm install
npm start         # Runs the React app in development mode
```

### Database

- PostgreSQL is used as the database.
- Migration scripts are located in `backend/migrations/`.

---

## Development Workflow

- **Branches:**  
  - `main`: Production-ready code  
  - `develop`: Ongoing development

- **GitHub Project Board:**  
  Track issues, features, and milestones using the project board.

- **Branch Protection:**  
  - Pull Requests required for merging to `main`
  - At least one reviewer approval
  - Passing status checks from CI pipeline

---

## Continuous Integration

- **GitHub Actions** is used for CI/CD.
- On every push or pull request to `main` or `develop`, the pipeline:
  - Installs dependencies
  - Runs linter and unit tests
  - Builds the application

Workflow files are in `.github/workflows/`.

---

## Security & Branch Protection

- Direct pushes to `main` are disabled.
- All code changes require Pull Requests and review.
- CI checks must pass before merging.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

See `.github/PULL_REQUEST_TEMPLATE.md` for PR guidelines.

---

## License

[MIT](LICENSE) (or specify your license)

---

**Feel free to ask for customization or additional sections (e.g., API documentation, environment variables, etc.)!**