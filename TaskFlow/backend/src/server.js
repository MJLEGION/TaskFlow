// Application Insights integration for monitoring
const appInsights = require('applicationinsights');
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(true)
    .setUseDiskRetryCaching(true)
    .start();
  console.log('Azure Application Insights initialized.');
} 