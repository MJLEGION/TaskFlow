# GitHub Environment Setup Guide

## Required GitHub Environments

To enable the CD pipeline with manual approval for production, you need to set up GitHub environments:

### 1. Staging Environment

1. Go to your GitHub repository
2. Navigate to **Settings** → **Environments**
3. Click **New environment**
4. Name: `staging`
5. **No protection rules needed** (automatic deployment)

### 2. Production Environment

1. Click **New environment**
2. Name: `production`
3. **Enable protection rules:**
   - ✅ **Required reviewers**: Add yourself as a reviewer
   - ✅ **Wait timer**: 0 minutes (optional)
   - ✅ **Deployment branches**: Only `main` branch

## Required GitHub Secrets

Add these secrets in **Settings** → **Secrets and variables** → **Actions**:

### Azure Credentials

```bash
AZURE_CREDENTIALS
# JSON object with Azure service principal credentials
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

### Container Registry

```bash
ACR_USERNAME=your-acr-username
ACR_PASSWORD=your-acr-password
AZURE_SUBSCRIPTION_ID=your-subscription-id
```

### Application Insights

```bash
APPLICATIONINSIGHTS_CONNECTION_STRING=your-connection-string
```

## Environment URLs

After setup, your environments will be available at:

- **Staging**: https://taskflow-webapp-staging.azurewebsites.net/
- **Production**: https://taskflow-webapp-legion-ghahajc0d4a7byaf.ukwest-01.azurewebsites.net/

## Manual Approval Process

1. When code is pushed to `main`, the pipeline will:
   - Build and test automatically
   - Run security scans
   - Build and push container images
   - **Wait for manual approval** before production deployment
2. You'll receive a notification to approve the deployment
3. After approval, the production deployment will proceed automatically
