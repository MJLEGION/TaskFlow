# Video Demonstration Script (10 minutes maximum)

## Stage 1: Initial State (1 minute)

**Script:** "Hello, my name is [Your Name]. I'm demonstrating the TaskFlow application's complete Continuous Deployment pipeline with DevSecOps integration."

### Actions:

1. **Show Production Application**

   - Navigate to: https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/
   - Show the application is live and functional
   - Navigate through key features (login, dashboard, etc.)

2. **Show Health Status**
   - Visit: https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/health
   - Explain the health check data (uptime, memory, monitoring status)

---

## Stage 2: Code Modification (2 minutes)

**Script:** "Now I'll make a visible code change to demonstrate the automated deployment process."

### Actions:

1. **Make Code Change**

   - Open `TaskFlow/frontend/src/App.js`
   - Find the login page title "TaskFlow" (around line 141)
   - Change it to "TaskFlow - Live Demo" or similar visible change
   - Save the file

2. **Commit with Conventional Commits**

   ```bash
   git add .
   git commit -m "feat(ui): update application title for demo deployment"
   git push origin feature/demo-deployment
   ```

3. **Show Commit in Repository**
   - Navigate to GitHub repository
   - Show the commit in the commit history
   - Explain the conventional commit format

---

## Stage 3: Staging Deployment (3 minutes)

**Script:** "I'll create a pull request to merge into the develop branch for staging deployment."

### Actions:

1. **Create Pull Request**

   - Create PR from `feature/demo-deployment` to `develop`
   - Title: "feat(ui): update application title for demo deployment"
   - Merge the PR

2. **Show Pipeline Execution**

   - Navigate to **Actions** tab
   - Show the running CD pipeline
   - **Explain each stage while it runs:**
     - "The build and test stage is running ESLint and Jest tests"
     - "Security scanning is checking for vulnerabilities with npm audit and Trivy"
     - "Container images are being built and pushed to Azure Container Registry"
     - "Now deploying to staging environment"

3. **Show Security Results**

   - Navigate to **Security** tab
   - Show security scan results
   - Explain vulnerability findings and remediation

4. **Verify Staging Deployment**
   - Navigate to: https://taskflow-webapp-staging.azurewebsites.net/
   - Show the updated title is visible
   - Confirm staging deployment successful

---

## Stage 4: Production Release (3 minutes)

**Script:** "Now I'll merge to main branch for production deployment with manual approval."

### Actions:

1. **Create Production PR**

   - Create PR from `develop` to `main`
   - Title: "release: deploy demo changes to production"
   - Merge the PR

2. **Show Manual Approval Step**

   - Navigate to **Actions** tab
   - Show the pipeline waiting for approval
   - **Explain:** "The pipeline has completed build, test, and security scanning. Now it's waiting for manual approval before production deployment."
   - Click **Review deployments** and approve

3. **Show Monitoring Dashboard**
   - Open Azure Portal
   - Navigate to Application Insights
   - Show live metrics stream
   - **Explain:** "This dashboard shows real-time application performance, request rates, and system health"
   - Show configured alerts: "We have alerts configured for high error rates and system downtime"

---

## Stage 5: Verification (1 minute)

**Script:** "Let me verify the production deployment and show the automated documentation updates."

### Actions:

1. **Verify Production Deployment**

   - Navigate to: https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/
   - Refresh the page
   - Show the updated title is now live in production
   - **Explain:** "The change is now live in production with zero downtime"

2. **Show Updated CHANGELOG**

   - Navigate to repository
   - Open `CHANGELOG.md`
   - Show the automatically generated changelog entry
   - **Explain:** "The pipeline automatically updated our CHANGELOG with deployment details"

3. **Show Release Tag**
   - Navigate to **Releases** tab
   - Show the automatically created release tag
   - **Explain:** "A release tag was automatically created with version information"

---

## Conclusion (30 seconds)

**Script:** "This demonstrates a complete DevSecOps pipeline with:"

- ✅ **Automated testing and security scanning**
- ✅ **Container-based deployments**
- ✅ **Manual approval gates for production**
- ✅ **Real-time monitoring and alerting**
- ✅ **Automated documentation and versioning**

"The entire process from code change to production deployment is fully automated while maintaining security and quality standards."

---

## Technical Points to Emphasize:

1. **Security Integration**: npm audit + Trivy scanning
2. **Manual Approval**: Production deployment requires approval
3. **Monitoring**: Real-time Application Insights dashboard
4. **Health Checks**: Automated health monitoring
5. **Documentation**: Automated CHANGELOG and versioning
6. **Zero Downtime**: Container-based blue-green deployments

## Recording Tips:

- Use 1080p resolution minimum
- Clear audio narration
- Show all screens clearly
- Don't edit during pipeline execution
- Keep within 10-minute limit
- Professional presentation style
