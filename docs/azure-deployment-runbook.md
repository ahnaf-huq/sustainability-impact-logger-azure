# Azure Deployment Runbook

## Objective

Deploy the Sustainability Impact Logger as a cloud-hosted application using Azure App Service and Azure Database for PostgreSQL Flexible Server.

The application database is already provisioned and validated. The remaining work is to deploy the Next.js application to Azure App Service, add monitoring, and automate delivery with GitHub Actions.

---

## Current Deployment Status

### Completed

* Created Azure resource group:

  ```text
  rg-sustainability-impact-portfolio
  ```

* Selected region:

  ```text
  Sweden Central
  ```

* Created Azure Database for PostgreSQL Flexible Server:

  ```text
  psql-sustainability-impact-ahnaf.postgres.database.azure.com
  ```

* Configured PostgreSQL version 16.

* Created the application database:

  ```text
  impact_logger
  ```

* Configured local access through a restricted PostgreSQL firewall rule.

* Connected the local Next.js application to Azure PostgreSQL using `DATABASE_URL`.

* Enabled TLS-encrypted database communication with:

  ```text
  sslmode=require
  ```

* Applied the committed Prisma migration using:

  ```bash
  npm run db:migrate:deploy
  ```

* Confirmed the Azure database schema is up to date with:

  ```bash
  npx prisma migrate status
  ```

* Tested the application successfully against Azure PostgreSQL:

  * Create impact item
  * Update item status
  * Confirm persisted data after refresh
  * Delete impact item
  * Verify `/api/health/ready`

---

## Target Architecture

```text
User
  ↓
Azure App Service
  ↓
Next.js application
  ↓
Prisma ORM + PostgreSQL driver adapter
  ↓
Azure Database for PostgreSQL Flexible Server
  ↓
impact_logger database
  ↓
Azure Monitor Application Insights
```

---

## Health Endpoints

* `/api/health`
  Confirms that the Next.js application process is running.

* `/api/health/ready`
  Confirms that the application can connect to PostgreSQL.

The readiness endpoint is especially useful after deployment because it confirms that both Azure App Service and Azure PostgreSQL are correctly configured.

---

## Remaining Deployment Phases

1. Create Azure App Service and App Service Plan.
2. Configure Azure App Service runtime settings for Node.js 20.
3. Add Azure App Service outbound IP addresses to the PostgreSQL firewall.
4. Configure App Service environment variables:

   * `DATABASE_URL`
   * `APPLICATIONINSIGHTS_CONNECTION_STRING`
   * `NODE_ENV=production`
5. Deploy the application manually to Azure App Service.
6. Validate the deployed application and health endpoints.
7. Create Application Insights and verify request, dependency, and exception telemetry.
8. Add GitHub Actions CI validation workflow.
9. Add GitHub Actions deployment workflow with production database migrations.
10. Replace manual deployment with automated CI/CD.

---

## Database Migration Strategy

### Local development

Use Prisma development migrations when making schema changes locally:

```bash
npx prisma migrate dev --name descriptive_migration_name
```

### Azure and production deployment

Use the production-safe migration command:

```bash
npm run db:migrate:deploy
```

This runs:

```bash
prisma migrate deploy
```

It applies committed migration files without creating new migrations, making it suitable for Azure PostgreSQL and later CI/CD workflows.

---

## Security Notes

* Real passwords and connection strings are never committed to Git.
* The local `.env` file is excluded from version control.
* `.env.example` contains only non-sensitive example values.
* Azure PostgreSQL currently uses public networking with firewall access limited to the development IP address.
* Database communication requires TLS through `sslmode=require`.
* Azure App Service will later receive `DATABASE_URL` through App Service application settings rather than repository files.
* The PostgreSQL firewall will later be updated to allow only the Azure App Service outbound IP addresses required by the deployed application.
* GitHub Actions will later use OpenID Connect authentication instead of long-lived Azure credentials.
* Application Insights connection details will be stored as Azure App Service application settings.

---

## Cost Considerations

This project is configured as a small portfolio deployment.

Current cost-conscious decisions:

* PostgreSQL Flexible Server uses a Development workload configuration.
* High availability is disabled.
* Resources are grouped in one dedicated resource group for easier review and deletion.
* Application Insights and App Service settings will be configured with minimal usage in mind.
* Unused resources should be stopped or deleted after testing.

---

## Validation Checklist

### Database integration

* [x] Azure PostgreSQL server created
* [x] `impact_logger` database created
* [x] Prisma migration applied
* [x] Local application connected to Azure PostgreSQL
* [x] CRUD operations tested successfully
* [x] `/api/health/ready` returns a successful response

### App Service deployment

* [ ] App Service Plan created
* [ ] Azure App Service created
* [ ] Node.js 20 runtime configured
* [ ] App Service environment variables configured
* [ ] App Service outbound IPs allowed in PostgreSQL firewall
* [ ] Application deployed successfully
* [ ] `/api/health` returns HTTP 200
* [ ] `/api/health/ready` returns HTTP 200
* [ ] CRUD operations tested from deployed application

### Observability and CI/CD

* [ ] Application Insights configured
* [ ] Requests visible in Application Insights
* [ ] Database dependencies visible in Application Insights
* [ ] GitHub Actions CI workflow added
* [ ] GitHub Actions deployment workflow added
* [ ] Production migrations automated during deployment
