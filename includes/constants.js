/**
 * ENVIRONMENT SETTINGS
 * We use the 'env' variable from workflow_settings.yaml to determine 
 * if we are building in 'dev' (test) or 'prod' (live).
 */
const env = dataform.projectConfig.vars.env || "dev";

// If in dev, we prefix datasets (e.g., 'dev_raw_layer') to avoid overwriting production.
const prefix = env === "prod" ? "" : `${env}_`;

const LOCATION = "US"; 

// The 'Raw' layer contains the physical BigQuery tables.
const RAW_SCHEMA = `${prefix}raw_layer`;

// The 'Stable' dataset contains the current "Production" views for users.
const CONSUMPTION_SCHEMA = `${prefix}consumption`; 

// This prefix is used to create versioned datasets like 'consumption_v1', 'consumption_v2'.
const VERSIONED_SCHEMA_PREFIX = `${prefix}consumption`; 

module.exports = {
  LOCATION,
  RAW_SCHEMA,
  CONSUMPTION_SCHEMA,
  VERSIONED_SCHEMA_PREFIX
};