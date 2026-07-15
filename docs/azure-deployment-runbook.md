# Azure Deployment Runbook

## Objective

Deploy the Sustainability Impact Logger as a cloud-hosted application using Azure App Service and Azure Database for PostgreSQL Flexible Server.

The application and managed database are now deployed and validated. The remaining work is to add monitoring with Application Insights and automate delivery with GitHub Actions.

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

* Configured PostgreSQL public networking with restricted firewall access for:

  * The local development IP address
  * Azure App Service outbound IP addresses
  * Azure App Service additional outbound IP addresses

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

* Tested the local application successfully against Azure PostgreSQL:

  * Create impact item
  * Update item status
  * Confirm persisted data after refresh
  * Delete impact item
  * Verify `/api/health/ready`

* Created an Azure App Service Plan and Linux-based Azure App Service:

  ```text
  app-sustainability-impact-ahnaf
  ```

* Configured the App Service runtime for Node.js 24.

* Added production App Service environment variables:

  * `DATABASE_URL`
  * `NODE_ENV=production`
  * `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
  * `NPM_CONFIG_PRODUCTION=false`

* Configured the App Service startup command:

  ```text
  npm start
  ```

* Deployed the application using Azure CLI ZIP deployment.

* Verified the deployed application successfully:

  * Homepage loads
  * `/api/health` responds successfully
  * `/api/health/ready` confirms Azure PostgreSQL connectivity
  * Create impact item
  * Update item status
  * Confirm persisted data after refresh
  * Delete impact item

---

## Current Architecture

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
```

### Planned Observability and Delivery Architecture

```text
User
  ↓
Azure App Service
  ↓
Next.js application
  ↓
Azure Database for PostgreSQL Flexible Server
  ↓
Azure Monitor Application Insights

GitHub Actions
  ↓
Lint → Build → Deploy → Health Check
```

---

## Health Endpoints

* `/api/health`
  Confirms that the Next.js application process is running.

* `/api/health/ready`
  Confirms that the application can connect to PostgreSQL.

The readiness endpoint is particularly useful after deployment because it confirms that Azure App Service and Azure PostgreSQL are correctly configured and able to communicate.

---

## Remaining Deployment Phases

1. Create and configure Application Insights.
2. Add the Application Insights connection string to App Service settings.
3. Add OpenTelemetry instrumentation to the Next.js application.
4. Verify request, dependency, and exception telemetry.
5. Add a GitHub Actions CI validation workflow.
6. Add a GitHub Actions deployment workflow.
7. Automate production Prisma migrations during deployment.
8. Replace manual ZIP deployment with CI/CD deployment.
9. Define the Azure infrastructure using Terraform as a later Infrastructure as Code phase.

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

It applies committed migration files without creating new migrations, making it suitable for Azure PostgreSQL and future CI/CD workflows.

---

## Deployment Notes

The initial manual deployment used Azure CLI ZIP deployment:

```bash
az webapp deploy
```

The deployment package was created from the committed Git version to avoid deploying local-only files such as:

```text
.env
node_modules
.next
.git
```

Build automation was enabled through:

```text
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

The App Service build required development dependencies because Tailwind and PostCSS are build-time dependencies. This was enabled through:

```text
NPM_CONFIG_PRODUCTION=false
```

---

## Security Notes

* Real passwords and connection strings are never committed to Git.
* The local `.env` file is excluded from version control.
* `.env.example` contains only non-sensitive example values.
* Azure PostgreSQL uses public networking with firewall access restricted to the required development and App Service outbound IP addresses.
* Database communication requires TLS through `sslmode=require`.
* `DATABASE_URL` is configured through Azure App Service application settings rather than repository files.
* Azure App Service basic authentication and FTP basic authentication remain disabled.
* GitHub Actions will later use OpenID Connect authentication instead of long-lived Azure credentials.
* Application Insights connection details will be stored as Azure App Service application settings.

---

## Cost Considerations

This project is configured as a small portfolio deployment.

Current cost-conscious decisions:

* PostgreSQL Flexible Server uses a Development workload configuration.
* High availability is disabled.
* Resources are grouped in one dedicated resource group for easier review and deletion.
* Azure App Service is configured only for portfolio use.
* Application Insights will be configured with minimal data collection and cost monitoring.
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

* [x] App Service Plan created
* [x] Azure App Service created
* [x] Node.js 24 runtime configured
* [x] App Service environment variables configured
* [x] App Service outbound IPs allowed in PostgreSQL firewall
* [x] Application deployed successfully
* [x] `/api/health` returns HTTP 200
* [x] `/api/health/ready` returns HTTP 200
* [x] CRUD operations tested from deployed application

### Observability and CI/CD

* [ ] Application Insights configured
* [ ] Requests visible in Application Insights
* [ ] Database dependencies visible in Application Insights
* [ ] Exceptions visible in Application Insights
* [ ] GitHub Actions CI workflow added
* [ ] GitHub Actions deployment workflow added
* [ ] Production migrations automated during deployment
* [ ] Deployment health check automated
