export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const connectionString =
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (!connectionString) {
    return;
  }

  const { useAzureMonitor: startAzureMonitor } = await import(
    "@azure/monitor-opentelemetry"
  );

  startAzureMonitor({
    azureMonitorExporterOptions: {
      connectionString,
    },
  });
}