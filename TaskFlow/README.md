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
  [TaskFlow Development Board](https://github.com/MJLEGION/TaskFlow/projects/1) - Track issues, features, and milestones using the project board.

- **Project Management:**

  - **Setup Guide**: [Project Board Setup Instructions](PROJECT_BOARD_SETUP.md)
  - **Issues**: [GitHub Issues](https://github.com/MJLEGION/TaskFlow/issues)

- **Branch Protection:**
  - Pull Requests required for merging to `main`
  - At least one reviewer approval
  - Passing status checks from CI pipeline
  - **Setup Guide**: [Branch Protection Setup Instructions](BRANCH_PROTECTION_SETUP.md)

---

## Continuous Integration

- **GitHub Actions** is used for CI/CD.
- On every push or pull request to `main` or `develop`, the pipeline:
  - Installs dependencies
  - Runs ESLint for code quality
  - Executes unit tests with coverage reporting
  - Builds the application
  - Uploads coverage reports to Codecov

Workflow files are in `.github/workflows/`.

## Testing & Code Quality

### Running Tests

```bash
# Backend tests
cd backend
npm test                    # Run tests
npm run test:coverage      # Run with coverage
npm run test:watch         # Watch mode

# Frontend tests
cd frontend
npm test                   # Interactive test runner
npm run test:coverage      # Run with coverage
```

### Code Linting

```bash
# Backend linting
cd backend
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues

# Frontend linting
cd frontend
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
```

### Pre-commit Hooks

Pre-commit hooks are configured to run linting and tests automatically:

```bash
# Install pre-commit (optional)
pip install pre-commit
pre-commit install
```

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

---

## Live Environments

### Production Environment
- **Production URL:** https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/
- **Health Check:** https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/health
- **API Health:** https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/api/health

### Staging Environment
- **Staging URL:** https://taskflow-webapp-staging.azurewebsites.net/
- **Health Check:** https://taskflow-webapp-staging.azurewebsites.net/health
- **API Health:** https://taskflow-webapp-staging.azurewebsites.net/api/health

### Deployment Status
- ✅ **Continuous Deployment:** Fully automated pipeline
- ✅ **Security Scanning:** npm audit + Trivy container scanning
- ✅ **Monitoring:** Azure Application Insights with custom alerts
- ✅ **Health Checks:** Automated health monitoring
- ✅ **Release Management:** Automated versioning and CHANGELOG updates

---

## Continuous Deployment Pipeline

### Pipeline Overview
The TaskFlow project implements a complete **Continuous Deployment (CD) pipeline** with **DevSecOps integration**:

```

Code Push → Build & Test → Security Scan → Container Build → Deploy → Monitor

```

### Pipeline Stages

#### 1. 🔨 Build & Test
- **Linting:** ESLint code quality checks
- **Testing:** Jest unit tests with coverage reporting
- **Build:** Application compilation and artifact creation
- **Coverage:** Codecov integration for test coverage tracking

#### 2. 🔒 Security Scanning (DevSecOps)
- **Dependency Scanning:** npm audit for vulnerability detection
- **Container Scanning:** Trivy security scanning for Docker images
- **SARIF Reports:** Security findings uploaded to GitHub Security tab
- **Automated Remediation:** Security issues documented and tracked

#### 3. 🐳 Container Build & Push
- **Multi-stage Builds:** Optimized Docker images
- **Registry Push:** Automated push to Azure Container Registry
- **Image Tagging:** Environment-specific tagging (latest, develop, SHA)
- **Build Artifacts:** Secure storage and versioning

#### 4. 🚀 Deployment Automation
- **Staging Deployment:** Automatic deployment on `develop` branch
- **Production Deployment:** Manual approval required for `main` branch
- **Health Checks:** Automated post-deployment verification
- **Rollback Capability:** Quick rollback on deployment failures

#### 5. 📊 Monitoring & Alerts
- **Application Insights:** Real-time performance monitoring
- **Custom Alerts:** High error rate and downtime notifications
- **Health Endpoints:** Continuous health monitoring
- **Dashboard:** Live metrics and system status

### Deployment Environments

| Environment | Branch | URL | Deployment |
|-------------|--------|-----|------------|
| **Staging** | `develop` | https://taskflow-webapp-staging.azurewebsites.net/ | Automatic |
| **Production** | `main` | https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/ | Manual Approval |

### Security Integration
- ✅ **Dependency Vulnerability Scanning** with npm audit
- ✅ **Container Image Security Scanning** with Trivy
- ✅ **Security Results Documentation** in GitHub Security tab
- ✅ **Automated Security Reporting** in pipeline summaries

---

## Monitoring & Observability

### Application Insights Integration
This project uses **Azure Application Insights** for comprehensive monitoring:

- 📊 **Real-time Metrics:** Live performance and usage statistics
- 🔍 **Request Tracking:** All HTTP requests automatically logged
- ⚠️ **Exception Monitoring:** Automatic error detection and alerting
- 📈 **Custom Events:** Business logic tracking and analytics
- 🚨 **Alerts:** Configured for high error rates and system health

### Monitoring Features
- **Live Metrics Stream:** Real-time application performance
- **Application Map:** Visual dependency tracking
- **Failure Analysis:** Detailed error investigation tools
- **Performance Insights:** Response time and throughput analysis
- **Custom Dashboards:** Tailored monitoring views

### Health Monitoring
- **Health Endpoints:** `/health` and `/api/health` for system status
- **Uptime Monitoring:** Continuous availability checks
- **Memory Usage:** System resource monitoring
- **Version Tracking:** Deployment version information

**Access Monitoring:**
1. Azure Portal → Application Insights → TaskFlow resource
2. Live Metrics Stream for real-time data
3. Failures tab for error analysis
4. Performance tab for response time metrics

---

## Video Demonstration

A full video demonstration of the automated pipeline, monitoring, and release process is available at:
- [Video Demo Link](ADD_YOUR_VIDEO_LINK_HERE)

---

## Release Management

- All changes are tracked in [CHANGELOG.md](../CHANGELOG.md) following Conventional Commits.
- Please use Conventional Commits for all PRs and merges.

```
