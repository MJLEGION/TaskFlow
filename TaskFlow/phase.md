# Phase 2 Submission

## Live Public URL

**https://taskflow-webapp.azurewebsites.net**

*Note: The backend API is successfully deployed and responding. The "Route not found" message indicates the API is running correctly - it's designed to serve API endpoints rather than a web interface at the root path.*

---

## Screenshots of Provisioned Resources

[](https://photos.app.goo.gl/WyxBApMdrCxFvFjCA)

---

## Peer Review

- **Link to Pull Request you reviewed:**
  > _Paste the URL of the PR you reviewed for your peer here._

---

## Reflection

### What Went Well:
- **Infrastructure as Code**: Terraform configuration worked smoothly for provisioning Azure resources (PostgreSQL, Container Registry, App Service)
- **Docker Multi-stage Builds**: Efficient containerization with optimized image sizes
- **Azure Integration**: Seamless integration between Azure CLI, Container Registry, and App Service

### Challenges Faced:
- **Docker Build Context**: Initial issues with Dockerfile paths requiring updates to reference correct directory structure (backend/ and frontend/)
- **Container Registry Authentication**: Required proper Azure CLI login and ACR authentication
- **Nginx Group Conflict**: Frontend Dockerfile needed adjustment for existing nginx group in base image

### Key Learnings:
- Importance of proper build context and file paths in multi-directory projects
- Value of Infrastructure as Code for reproducible deployments
- Docker multi-stage builds significantly reduce final image size and improve security
