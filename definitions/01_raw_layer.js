/**
 * RAW LAYER SETUP
 * This script uses 'operate' to run manual SQL commands in BigQuery.
 * Unlike 'publish', 'operate' allows us to run 'ALTER TABLE' to add 
 * new columns without recreating the table and losing data.
 */
const { tables, currentVersion } = require("../includes/metadata");
const { RAW_SCHEMA } = require("../includes/constants");

tables.forEach((table) => {
  operate(table.tableName, {
    tags: ["raw", "demo"],          // Run this using: dataform run --tags raw
    hasOutput: true,        // Tells Dataform this operation creates a table others can use
    dataset: RAW_SCHEMA     // The BigQuery dataset where the table lives
  }).queries(ctx => {
    const project = dataform.projectConfig.defaultDatabase;
    const fullTable = `\`${project}.${RAW_SCHEMA}.${table.tableName}\``;
    
    // Batch all ALTER TABLE commands into one script to avoid BigQuery rate limits.
    const batchAlters = table.columns
      .map(c => `ALTER TABLE ${fullTable} ADD COLUMN IF NOT EXISTS ${c.physicalName || c.name} ${c.type}`)
      .join(";\n");

    return [
      `CREATE SCHEMA IF NOT EXISTS \`${project}.${RAW_SCHEMA}\``,
      `CREATE TABLE IF NOT EXISTS ${fullTable} (_metadata_version INT64)`,
      `BEGIN ${batchAlters}; END;` // Executes all column additions in one go.
    ];
  });
});