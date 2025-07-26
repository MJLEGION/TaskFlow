# Branch Protection Rules Setup

This document provides step-by-step instructions for configuring branch protection rules on GitHub to meet Phase 1 requirements.

## Required Branch Protection Rules

The following rules must be configured for the `main` branch:

### 1. Require Pull Request Reviews

- **Require a pull request before merging**: ✅ Enabled
- **Require approvals**: ✅ Enabled (minimum 1 approval)
- **Dismiss stale PR approvals when new commits are pushed**: ✅ Enabled
- **Require review from code owners**: ✅ Enabled (if CODEOWNERS file exists)

### 2. Require Status Checks

- **Require status checks to pass before merging**: ✅ Enabled
- **Require branches to be up to date before merging**: ✅ Enabled
- **Required status checks**:
  - `lint-and-test (backend)` - Backend linting and testing
  - `lint-and-test (frontend)` - Frontend linting and testing

### 3. Restrict Pushes

- **Restrict pushes that create files**: ✅ Enabled
- **Do not allow bypassing the above settings**: ✅ Enabled

## Setup Instructions

### Step 1: Navigate to Branch Protection Settings

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar
4. Click **Add rule** button

### Step 2: Configure Branch Name Pattern

- **Branch name pattern**: `main`

### Step 3: Configure Protection Rules

#### Protect matching branches

- ✅ **Require a pull request before merging**
  - ✅ **Require approvals** (set to 1)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners** (if applicable)

#### Status Checks

- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Search and add these status checks:
  - `lint-and-test (backend)`
  - `lint-and-test (frontend)`

#### Additional Restrictions

- ✅ **Restrict pushes that create files**
- ✅ **Do not allow bypassing the above settings**
- ✅ **Restrict pushes that create files**

### Step 4: Save Protection Rule

Click **Create** to save the branch protection rule.

## Verification

After setting up branch protection rules, verify they work by:

1. **Testing Direct Push Restriction**:

   ```bash
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "Test direct push"
   git push origin main
   ```

   This should be **rejected** with a message about branch protection.

2. **Testing PR Requirement**:

   - Create a feature branch
   - Make changes and push
   - Create a Pull Request
   - Verify that merge is blocked until:
     - CI checks pass
     - At least one approval is received

3. **Testing Status Check Requirement**:
   - Create a PR with failing tests or linting errors
   - Verify that merge is blocked until checks pass

## CODEOWNERS File (Optional but Recommended)

Create a `.github/CODEOWNERS` file to automatically request reviews:

```
# Global owners
* @MJLEGION

# Backend code
/TaskFlow/backend/ @MJLEGION

# Frontend code
/TaskFlow/frontend/ @MJLEGION

# Infrastructure
/TaskFlow/infra/ @MJLEGION

# CI/CD
/.github/ @MJLEGION

# Documentation
*.md @MJLEGION
```

## Troubleshooting

### Status Checks Not Appearing

If the required status checks don't appear in the dropdown:

1. Make sure the CI workflow has run at least once
2. Check that the job names in the workflow match exactly
3. The status checks will appear after the first workflow run

### Cannot Merge Despite Passing Checks

1. Verify all required status checks are passing
2. Ensure the branch is up to date with main
3. Check that at least one approval is present
4. Verify no changes were requested in reviews

### Admin Override

Repository administrators can temporarily bypass these rules if needed, but this should be avoided in normal workflow.

## Best Practices

1. **Never bypass protection rules** unless absolutely necessary
2. **Keep branches up to date** before merging
3. **Address all review comments** before requesting re-review
4. **Ensure CI passes** before requesting reviews
5. **Use descriptive commit messages** and PR descriptions

## Compliance Check

To verify your setup meets Phase 1 requirements:

- [ ] Branch protection rules are enabled on `main` branch
- [ ] Pull requests are required before merging
- [ ] At least one reviewer approval is required
- [ ] Status checks from CI pipeline are required to pass
- [ ] Direct pushes to main are blocked
- [ ] Rules cannot be bypassed by non-admins

This configuration ensures code quality and collaborative development practices as required by the Phase 1 rubric.
