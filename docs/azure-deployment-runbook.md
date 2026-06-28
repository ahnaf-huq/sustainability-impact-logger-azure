# Azure Deployment Runbook

## Objective

Deploy Sustainability Impact Logger to Azure App Service with Azure Database for PostgreSQL Flexible Server.

## Target Architecture

User
↓
Azure App Service
↓
Next.js application
↓
Azure Database for PostgreSQL Flexible Server
↓
Azure Monitor Application Insights

## Deployment Phases

1. Prepare the Next.js application for cloud deployment.
2. Create Azure resource group, App Service, PostgreSQL, and Application Insights.
3. Configure App Service environment variables.
4. Apply Prisma production migrations.
5. Deploy manually and validate health endpoints.
6. Add Application Insights telemetry.
7. Add GitHub Actions CI/CD.

## Health Endpoints

- `/api/health`: confirms that the application process is running.
- `/api/health/ready`: confirms that the application can connect to PostgreSQL.

## Security Notes

- No passwords or connection strings are committed to Git.
- Azure values will be configured as App Service application settings.
- PostgreSQL will require TLS and restricted firewall access.
- GitHub Actions will later use OpenID Connect authentication instead of a long-lived Azure password.