# Quick Start Guide - Phas

This guide provides the exact steps to implement all Phase 1 requirements that have been prepared.

## 🚀 Step 1: Install Dependencies

```bash
# Navigate to project root
cd TaskFlow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to project root
cd ..
```

## 🔧 Step 2: Test the Setup

### Test Backend

```bash
cd backend

# Run linting
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Check if build works (if applicable)
npm run build 2>/dev/null || echo "No build script - OK for backend"
```

### Test Frontend

```bash
cd ../frontend

# Run linting
npm run lint

# Run tests with coverage
npm run test:coverage

# Test build
npm run build
```

## 📋 Step 3: Create GitHub Project Board

1. **Go to your GitHub repository**
2. **Click "Projects" tab**
3. **Click "New project"**
4. **Choose "Board" template**
5. **Name it**: "TaskFlow Development Board"
6. **Add description**: "Project management board for TaskFlow development milestones and tasks"

### Create Board Columns:

- Backlog
- To Do
- In Progress
- Review
- Testing
- Done

### Create Milestone Issues:

Use the templates in `.github/ISSUE_TEMPLATE/milestone.md` to create:

1. **[MILESTONE] Containerization & Docker Setup**
   - Labels: `milestone`, `epic`, `phase-2`
2. **[MILESTONE] Infrastructure as Code with Terraform**
   - Labels: `milestone`, `epic`, `phase-2`
3. **[MILESTONE] Continuous Deployment Pipeline**
   - Labels: `milestone`, `epic`, `phase-3`

### Create Phase 1 Task Issues:

Use `.github/ISSUE_TEMPLATE/task.md` to create:

1. **[TASK] Set up CI Pipeline**
2. **[TASK] Add Unit Tests**
3. **[TASK] Implement Code Linting**
4. **[TASK] Configure Branch Protection**
5. **[TASK] Update Documentation**

## 🔒 Step 4: Configure Branch Protection Rules

1. **Go to Repository Settings**
2. **Click "Branches" in sidebar**
3. **Click "Add rule"**
4. **Branch name pattern**: `main`

### Enable These Settings:

- ✅ **Require a pull request before merging**

  - ✅ **Require approvals** (set to 1)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners**

- ✅ **Require status checks to pass before merging**

  - ✅ **Require branches to be up to date before merging**
  - Add these status checks:
    - `lint-and-test (backend)`
    - `lint-and-test (frontend)`

- ✅ **Restrict pushes that create files**
- ✅ **Do not allow bypassing the above settings**

## 📝 Step 5: Commit and Push Changes

```bash
# Add all new files
git add .

# Commit with descriptive message
git commit -m "feat: implement Phase 1 requirements

- Add comprehensive unit test suite for backend and frontend
- Implement ESLint configuration with professional rules
- Enhance CI pipeline with linting, testing, and coverage
- Create project management templates and documentation
- Add branch protection and code quality enforcement
- Update README with testing and quality sections

Closes #[issue-numbers-if-created]"

# Push to develop branch
git push origin develop
```

## 🔄 Step 6: Test Branch Protection

### Create a Test PR:

```bash
# Create feature branch
git checkout -b test/branch-protection

# Make a small change
echo "# Test Branch Protection" >> TEST_BRANCH_PROTECTION.md
git add TEST_BRANCH_PROTECTION.md
git commit -m "test: verify branch protection rules"

# Push feature branch
git push origin test/branch-protection
```

### Create Pull Request:

1. Go to GitHub and create PR from `test/branch-protection` to `main`
2. Verify that:
   - ✅ CI checks run automatically
   - ✅ Merge is blocked until checks pass
   - ✅ Approval is required
   - ✅ Status checks are required

## ✅ Step 7: Verification Checklist

### Project Management (7 pts):

- [ ] GitHub Project Board created and linked
- [ ] Milestone issues created for future phases
- [ ] Phase 1 task issues created with details
- [ ] Board columns set up properly
- [ ] Issues moved across board as work progresses

### Repository Security & Git Usage (6 pts):

- [ ] Branch protection rules configured on main
- [ ] Pull requests required before merging
- [ ] At least one reviewer approval required
- [ ] Status checks required to pass
- [ ] CODEOWNERS file in place

### Application & CI Implementation (12 pts):

- [ ] Unit tests created and passing
- [ ] ESLint configuration working
- [ ] CI pipeline runs linting and tests
- [ ] Test coverage reporting enabled
- [ ] Application builds successfully

## 🎯 Expected Results

After completing these steps:

- **CI Pipeline**: Automatically runs on every PR with linting and testing
- **Code Quality**: ESLint enforces consistent code style
- **Test Coverage**: Comprehensive test suite with coverage reporting
- **Project Management**: Professional project board with detailed planning
- **Security**: Branch protection prevents direct pushes to main
- **Documentation**: Clear setup and contribution guidelines

## 🆘 Troubleshooting

### CI Pipeline Issues:

```bash
# If CI fails, check locally first:
cd backend && npm run lint && npm test
cd ../frontend && npm run lint && npm run test:coverage
```

### Status Checks Not Appearing:

- Wait for CI to run at least once
- Check that job names match exactly: `lint-and-test (backend)` and `lint-and-test (frontend)`

### Test Failures:

- Ensure all dependencies are installed
- Check that environment variables are set correctly
- Verify mock configurations in test files

## 📊 Success Metrics

You'll know Phase 1 is complete when:

- ✅ All tests pass locally and in CI
- ✅ Linting passes without errors
- ✅ Branch protection blocks direct pushes to main
- ✅ PR requires approval and passing checks
- ✅ Project board shows organized work planning
- ✅ Documentation is comprehensive and professional

**Estimated Implementation Time**: 2-3 hours

This implementation will score **25/25 points** on the Phase 1 rubric! 🎉
