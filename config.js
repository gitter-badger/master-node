
// Container for all the environments
const environments = {}


// Development environment
environments.development = {
  port: 3000,
  envName: 'development'
}

// Staging environment
environments.staging = {
  port: 3000,
  envName: 'staging'
}

// Production environment
environments.production = {
  port: 5000,
  envName: 'production'
}

// Determine which env was passed as a command-line argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string'
  ? process.env.NODE_ENV.toLowerCase()
  : '';

// Check that the current environment is defined previously
const envToExport = typeof(environments[currentEnv]) == 'object'
  ? environments[currentEnv]
  : environments.development;

// Export the module
module.exports = envToExport;