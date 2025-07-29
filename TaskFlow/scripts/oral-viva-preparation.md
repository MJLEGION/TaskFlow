# Oral Viva Preparation Guide (15 minutes)

## Focus Areas & Expected Questions

### 1. Technical Decision Justification

#### Pipeline Architecture

**Q: Why did you choose this specific pipeline structure?**
**A:** "I implemented a multi-stage pipeline with clear separation of concerns:

- Build & Test stage ensures code quality before any deployment
- Security scanning stage implements DevSecOps practices with both dependency and container scanning
- Separate staging and production deployments with manual approval gates
- This structure provides safety, security, and control over releases"

**Q: Why use GitHub Actions instead of other CI/CD tools?**
**A:** "GitHub Actions provides native integration with our repository, excellent container support, and built-in security features. The YAML-based configuration is version-controlled and the marketplace provides robust actions for Azure integration."

#### Container Strategy

**Q: Explain your containerization approach.**
**A:** "I used multi-stage Docker builds to optimize image size and security:

- Frontend: Build stage compiles React, serve stage uses minimal Node.js image
- Backend: Single-stage with Alpine Linux for minimal attack surface
- All images use specific version tags and are scanned for vulnerabilities"

### 2. DevOps Principles Understanding

#### Continuous Integration/Continuous Deployment

**Q: What's the difference between CI and CD in your implementation?**
**A:** "CI focuses on code integration - automated testing, linting, and security scanning on every commit. CD extends this to automated deployment - my pipeline automatically deploys to staging and provides controlled production deployments with approval gates."

**Q: How do you ensure deployment reliability?**
**A:** "Multiple layers of reliability:

- Comprehensive test suite (46 tests) with coverage reporting
- Security scanning before any deployment
- Health checks after deployment
- Automated rollback capabilities
- Blue-green deployment strategy with containers"

#### Infrastructure as Code

**Q: How does IaC benefit your deployment process?**
**A:** "IaC with Terraform ensures:

- Reproducible infrastructure across environments
- Version-controlled infrastructure changes
- Consistent configuration between staging and production
- Easy disaster recovery and scaling"

### 3. Security Implementation Rationale

#### DevSecOps Integration

**Q: Explain your security scanning strategy.**
**A:** "I implemented security at multiple levels:

- **Dependency scanning** with npm audit catches vulnerable packages
- **Container scanning** with Trivy identifies OS and application vulnerabilities
- **SARIF reporting** integrates findings into GitHub Security tab
- **Automated blocking** prevents deployment of high-severity vulnerabilities"

**Q: How do you handle security vulnerabilities found in scans?**
**A:** "The pipeline documents all findings and can be configured to fail on high-severity issues. I maintain a security remediation process:

1. Immediate assessment of vulnerability impact
2. Update dependencies or apply patches
3. Re-run security scans to verify fixes
4. Document remediation in security reports"

#### Access Control

**Q: How do you secure your deployment pipeline?**
**A:** "Multiple security layers:

- GitHub environments with required reviewers for production
- Azure service principal with minimal required permissions
- Secrets management through GitHub Secrets
- Container registry authentication
- Network security through Azure App Service"

### 4. Monitoring Strategy Explanation

#### Application Insights Integration

**Q: Explain your monitoring approach.**
**A:** "Comprehensive monitoring with Azure Application Insights:

- **Real-time metrics** for performance monitoring
- **Custom events** for business logic tracking
- **Exception monitoring** for error detection
- **Health endpoints** for system status
- **Automated alerts** for high error rates and downtime"

**Q: What metrics do you consider most important?**
**A:** "Key metrics include:

- Response time and throughput for performance
- Error rate and exception count for reliability
- Memory usage and CPU for resource management
- Custom business metrics for user engagement
- Availability and uptime for service reliability"

#### Alerting Strategy

**Q: How do you handle production incidents?**
**A:** "Proactive incident management:

- Automated alerts trigger on error rate thresholds
- Health check failures trigger immediate notifications
- Application Insights provides detailed error analysis
- Rollback procedures are documented and automated
- Post-incident reviews improve future reliability"

### 5. Operational Procedures

#### Troubleshooting

**Q: Walk me through debugging a production issue.**
**A:** "Systematic troubleshooting approach:

1. **Check monitoring dashboard** for error patterns
2. **Review Application Insights** for detailed error traces
3. **Examine health endpoints** for system status
4. **Check recent deployments** for correlation
5. **Use log analysis** to identify root cause
6. **Implement fix** through standard pipeline
7. **Verify resolution** through monitoring"

**Q: How do you ensure zero-downtime deployments?**
**A:** "Container-based blue-green deployments:

- New version deployed alongside current version
- Health checks verify new version functionality
- Traffic gradually shifted to new version
- Automatic rollback if health checks fail
- Azure App Service handles the traffic switching"

#### Release Management

**Q: Explain your release management process.**
**A:** "Structured release process:

- **Feature branches** for development
- **Develop branch** for staging integration
- **Main branch** for production releases
- **Conventional commits** for automated changelog
- **Semantic versioning** with automated tagging
- **Manual approval** gates for production"

### 6. Problem-Solving Scenarios

#### Scenario: Pipeline Failure

**Q: Your security scan finds a critical vulnerability. What do you do?**
**A:** "Immediate response:

1. Pipeline automatically blocks deployment
2. Assess vulnerability severity and impact
3. Update affected dependencies or apply patches
4. Re-run security scans to verify fix
5. Document remediation in security report
6. Proceed with deployment only after clearance"

#### Scenario: Production Outage

**Q: Your production application is down. Walk me through your response.**
**A:** "Incident response procedure:

1. **Immediate assessment** through monitoring dashboard
2. **Check health endpoints** and error logs
3. **Identify root cause** using Application Insights
4. **Implement quick fix** or rollback to previous version
5. **Verify restoration** through health checks
6. **Communicate status** to stakeholders
7. **Conduct post-mortem** to prevent recurrence"

## Key Technical Concepts to Master

### DevOps Principles

- Continuous Integration/Continuous Deployment
- Infrastructure as Code
- Configuration Management
- Monitoring and Observability
- Security Integration (DevSecOps)

### Azure Services

- Azure App Service and Container Apps
- Azure Container Registry
- Azure Application Insights
- Azure Monitor and Alerts
- Azure Resource Manager

### Security Practices

- Vulnerability scanning and management
- Container security
- Secrets management
- Access control and authentication
- Security monitoring and incident response

### Monitoring and Operations

- Application performance monitoring
- Log aggregation and analysis
- Alerting and notification strategies
- Incident response procedures
- Capacity planning and scaling

## Confidence Building Tips

1. **Practice explaining technical concepts** in simple terms
2. **Prepare specific examples** from your implementation
3. **Know your monitoring dashboard** and how to navigate it
4. **Understand the business value** of your technical decisions
5. **Be ready to discuss trade-offs** and alternative approaches
6. **Practice troubleshooting scenarios** with your actual system
7. **Review your pipeline configuration** and be able to explain each step

## Sample Questions to Practice

1. "Why did you choose Azure over AWS or GCP?"
2. "How would you scale this application to handle 10x more traffic?"
3. "What would you do if your container registry was compromised?"
4. "How do you ensure data consistency during deployments?"
5. "Explain how you would implement feature flags in this pipeline."
6. "What metrics would you add to better understand user behavior?"
7. "How would you implement disaster recovery for this application?"
