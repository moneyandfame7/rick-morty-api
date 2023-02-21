export interface DatabaseConfig {
  getDatabaseHost: () => string
  getDatabasePort: () => number
  getDatabaseName: () => string
  getDatabaseUsername: () => string
  getDatabasePassword: () => string
}
