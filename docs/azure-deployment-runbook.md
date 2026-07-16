# Azure Deployment Runbook

## Objective

Deploy the Sustainability Impact Logger as a cloud-hosted application using Azure App Service, Azure Database for PostgreSQL Flexible Server, and Azure Monitor Application Insights.

The application, managed database, App Service deployment, and monitoring setup are now deployed and validated. The remaining work is to automate delivery with GitHub Actions and later define the infrastructure using Terraform.

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

* Created an Azure Application Insights resource for monitoring.

* Added the Application Insights connection string to Azure App Service environment variables:

  ```text
  APPLICATIONINSIGHTS_CONNECTION_STRING
  ```

* Installed Azure Monitor OpenTelemetry instrumentation for the Node.js runtime.

* Added Next.js instrumentation through:

  ```text
  src/instrumentation.ts
  ```

* Verified Application Insights telemetry from the deployed application:

  * Request telemetry
  * Health endpoint calls
  * Database readiness checks
  * CRUD operation traffic
  * Failed or invalid request visibility

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

Azure App Service
  ↓
Azure Monitor OpenTelemetry
  ↓
Application Insights
```

---

## Planned CI/CD Architecture

```text
Developer
  ↓
GitHub Repository
  ↓
GitHub Actions
  ↓
Lint → Build → Prisma migrate deploy → Deploy to Azure App Service
  ↓
Post-deployment health checks
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

1. Add a GitHub Actions CI validation workflow.
2. Add a GitHub Actions deployment workflow.
3. Automate production Prisma migrations during deployment.
4. Add automated post-deployment health checks for:

   * `/api/health`
   * `/api/health/ready`
5. Replace manual ZIP deployment with CI/CD deployment.
6. Add Application Insights alert rules for failed health checks or high failure rates.
7. Add telemetry cost controls, such as daily caps or retention settings.
8. Define the Azure infrastructure using Terraform as a later Infrastructure as Code phase.
9. Explore private networking or VNet integration as a future production-ready networking improvement.

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

The deployment package can be recreated with:

```bash
git archive --format=zip --output=sustainability-impact-logger.zip HEAD
```

The ZIP file is a generated deployment artifact and should not be committed to Git.

Build automation was enabled through:

```text
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

The App Service build required development dependencies because Tailwind and PostCSS are build-time dependencies. This was enabled through:

```text
NPM_CONFIG_PRODUCTION=false
```

The App Service startup command is:

```text
npm start
```

---

## Monitoring Notes

Application monitoring is configured through Azure Monitor Application Insights.

The application uses:

```text
@azure/monitor-opentelemetry
```

Instrumentation is registered through:

```text
src/instrumentation.ts
```

The Application Insights connection string is configured as an App Service environment variable:

```text
APPLICATIONINSIGHTS_CONNECTION_STRING
```

This value is not committed to Git.

Application Insights has been verified for:

* Request telemetry
* Health endpoint traffic
* CRUD operation traffic
* Failed or invalid request visibility

Future monitoring improvements may include:

* Custom telemetry events for important user actions
* Alert rules for failed health checks
* Alert rules for high failure rates
* Cost controls for telemetry ingestion
* Retention and sampling configuration

---

## Security Notes

* Real passwords and connection strings are never committed to Git.
* The local `.env` file is excluded from version control.
* `.env.example` contains only non-sensitive example values.
* Azure PostgreSQL uses public networking with firewall access restricted to the required development and App Service outbound IP addresses.
* Database communication requires TLS through `sslmode=require`.
* `DATABASE_URL` is configured through Azure App Service application settings rather than repository files.
* `APPLICATIONINSIGHTS_CONNECTION_STRING` is configured through Azure App Service application settings rather than repository files.
* Azure App Service basic authentication and FTP basic authentication remain disabled.
* GitHub Actions will later use OpenID Connect authentication instead of long-lived Azure credentials.
* Monitoring configuration is separated from source code to avoid exposing cloud-specific connection details.

---

## Cost Considerations

This project is configured as a small portfolio deployment.

Current cost-conscious decisions:

* PostgreSQL Flexible Server uses a Development workload configuration.
* High availability is disabled.
* Resources are grouped in one dedicated resource group for easier review and deletion.
* Azure App Service is configured only for portfolio use.
* Application Insights is configured for learning and portfolio monitoring.
* Future telemetry cost controls should include daily caps, retention review, and minimal unnecessary ingestion.
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

### Observability

* [x] Application Insights configured
* [x] Application Insights connection string added to App Service settings
* [x] OpenTelemetry instrumentation added
* [x] Requests visible in Application Insights
* [x] Health endpoint telemetry visible in Application Insights
* [x] CRUD request telemetry visible in Application Insights
* [x] Failed or invalid request visibility verified

### CI/CD

* [ ] GitHub Actions CI workflow added
* [ ] GitHub Actions deployment workflow added
* [ ] Production migrations automated during deployment
* [ ] Deployment health check automated
* [ ] Manual ZIP deployment replaced with CI/CD
