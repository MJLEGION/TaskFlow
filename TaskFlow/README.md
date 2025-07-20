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

---

## Docker-Based Setup

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running the Application with Docker Compose

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```
2. The services will be available at:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)
   - PostgreSQL: localhost:5432 (user: taskflow, password: taskflowpass)

3. To stop the services:
   ```bash
   docker-compose down
   ```

---

## Cloud Deployment & Infrastructure as Code (IaC)

This project uses **Terraform** to provision Azure cloud resources:

- Azure PostgreSQL Database
- Azure Container Registry (ACR)
- Azure Web App for Containers (App Service)
- Networking (Resource Group, VNet, etc.)

Terraform configuration is located in the `infra/` directory.

### Steps:

1. Install [Terraform](https://www.terraform.io/downloads.html) and [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
2. Authenticate with Azure:
   ```bash
   az login
   ```
3. Initialize and apply Terraform:
   ```bash
   cd infra
   terraform init
   terraform apply
   ```
4. Build and push Docker images to ACR (see outputs from Terraform for registry info).
5. Configure Azure Web App to use the pushed images (via Azure Portal or CLI).
6. Access your app via the public URL provided by Azure.

See `phase.md` for deployment evidence and reflection.

---

## 1. **PostgreSQL Flexible Server Location Restriction**

You are still getting:

```
Subscriptions are restricted from provisioning in location 'westeurope'. Try again in a different location.
**This means your Azure for Students subscription does not support PostgreSQL Flexible Server in any of the regions you’ve tried.**
This is a common limitation for student/trial accounts.

---

## 2. **Terraform Provider Inconsistent Result**
```

Provider produced inconsistent result after apply
...
This is a bug in the provider...

```
This is a side effect of the failed resource creation and Azure’s API returning unexpected results. It’s not your fault and is common when resources fail to create.

---

## **What Should You Do?**

### **A. Stop Trying New Regions for PostgreSQL Flexible Server**
You have already tried the main available regions.
**Your subscription does not support this service.**

---

### **B. Use an Alternative Database Option**

#### **Option 1: Azure SQL Database**
- Azure SQL Database is usually available for student subscriptions.
- I can help you update your Terraform and backend code to use Azure SQL Database instead of PostgreSQL.

#### **Option 2: Local PostgreSQL or Docker**
- For development/demo, you can use a local PostgreSQL instance or a Dockerized PostgreSQL (already set up in your `docker-compose.yml`).

---

## **How to Proceed**

**If you want to use Azure SQL Database:**
- Let me know, and I’ll generate the Terraform and backend changes for you.

**If you want to use local/Docker PostgreSQL for now:**
- You can continue development locally and deploy to Azure later if your subscription changes.

---

### **Summary**
- Your Azure for Students subscription does **not** support PostgreSQL Flexible Server.
- You need to use a different database service (Azure SQL Database is recommended for Azure).
- The Terraform provider error is a side effect of the failed resource creation.

---

**Let me know which option you want to proceed with, and I’ll guide you step by step!**
```
