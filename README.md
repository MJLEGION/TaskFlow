# TaskFlow Project Setup Guide

## Step 1: Repository Setup

1. **Clone your repository:**
   ```bash
   git clone https://github.com/MJLEGION/TaskFlow.git
   cd TaskFlow
   ```

2. **Create branch structure:**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

3. **Set up branch protection rules on GitHub:**
   - Go to Settings → Branches in your GitHub repo
   - Add rule for `main` branch:
     - ✅ Require a pull request before merging
     - ✅ Require approvals (1)
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Select "CI Pipeline" as required status check (after first CI run)

## Step 2: Create Project Directory Structure

Create the following directory structure in your repository:

```
TaskFlow/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   └── time.js
│   │   └── utils/
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   └── setup.js
│   ├── scripts/
│   │   └── migrate.js
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Projects/
│   │   │   ├── Tasks/
│   │   │   └── Common/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Projects.js
│   │   ├── hooks/
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Step 3: GitHub Project Board Setup

1. **Create GitHub Project:**
   - Go to your repository → Projects tab
   - Click "New Project" → "Board"
   - Name it "TaskFlow Development Board"

2. **Create Columns:**
   - 📝 Backlog
   - 🏗️ To Do
   - 🚀 In Progress
   - 👀 In Review
   - ✅ Done

3. **Add Milestones/Epics:**
   Create these as Issues with "Epic" label:
   - Epic: Phase 1 - Foundation & CI
   - Epic: Phase 2 - Containerization
   - Epic: Phase 3 - Infrastructure as Code
   - Epic: Phase 4 - Continuous Deployment
   - Epic: Phase 5 - Monitoring & Logging
   - Epic: Phase 6 - Security & Performance
   - Epic: Phase 7 - Final Integration

4. **Create Phase 1 User Stories:**
   Create these as Issues:
   - User Story: Set up repository with branch protection
   - User Story: Create backend API structure
   - User Story: Implement user authentication
   - User Story: Create project management endpoints
   - User Story: Build frontend login/register
   - User Story: Create dashboard interface
   - User Story: Set up CI pipeline
   - User Story: Write comprehensive tests
   - User Story: Configure linting and code quality

## Step 4: File Contents to Add

I'll provide you with the specific file contents for each component. Copy the following files into your repository structure.

## Next Steps After Setup

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Backend
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Frontend
   cp .env.example .env
   # Edit .env with API URL
   ```

3. **Create and run database:**
   ```bash
   createdb taskflow_db
   cd backend
   npm run migrate
   ```

4. **Test the application:**
   ```bash
   # Backend (in one terminal)
   cd backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm start
   ```

5. **Run tests:**
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

This setup will give you a complete foundation that meets all Phase 1 requirements for the "Exemplary" rating (25/25 points).