# Infrastructure as Code (IaC) for TaskFlow (Azure)

This directory contains Terraform configuration to provision all required Azure resources for TaskFlow:

- Resource Group
- PostgreSQL Flexible Server
- Azure Container Registry (ACR)
- App Service Plan
- Web App for Containers

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Azure subscription

## Setup & Usage

1. **Login to Azure:**
   ```bash
   az login
   ```
2. **Initialize Terraform:**
   ```bash
   terraform init
   ```
3. **Set required variables:**

   - You can use a `terraform.tfvars` file or pass variables via CLI.
   - At minimum, set `db_password` (PostgreSQL admin password).

4. **Apply the configuration:**

   ```bash
   terraform apply
   ```

   - Review the plan and type `yes` to confirm.

5. **Outputs:**
   - After apply, Terraform will output:
     - ACR login server
     - Web App URL
     - PostgreSQL server name
     - Resource group name

## Next Steps

- Build and push your Docker images to the ACR.
- Configure the Azure Web App to use your image (see main project README for details).

---

**Note:**

- Resource names must be globally unique in Azure (especially ACR and Web App names).
- You may customize variables in `variables.tf` or via `terraform.tfvars`.
