/**
 * STABLE CONSUMPTION LAYER (The "Production" View)
 * This script creates the final views that most business users and BI tools (like Looker or Tableau) will use.
 * * It automatically points to the 'currentVersion' defined in metadata.js.
 * When you update 'currentVersion' in your metadata, this view updates its columns automatically.
 */
const { tables, currentVersion } = require("../includes/metadata");
const { RAW_SCHEMA, CONSUMPTION_SCHEMA } = require("../includes/constants");
const { getVersionedColumns } = require("../includes/factory");

tables.forEach((table) => {
    // Unique Action ID for Dataform to track this specific view.
    // We prefix with 'stable_' to avoid naming collisions with versioned views.
    const actionId = `stable_${table.tableName}`;

    publish(actionId, {
        type: "view",
        schema: CONSUMPTION_SCHEMA, // e.g., 'consumption' or 'dev_consumption'
        name: table.tableName,      // The physical name in BigQuery will be 'customers'
        tags: ["prod","demo"]    // Run this using: dataform run --tags prod
    }).query(ctx => {
        /**
         * VERSION FILTERING:
         * We pass 'currentVersion' to the factory. This ensures that even if you have 
         * 'future' columns defined in metadata (since: 4), they won't show up here 
         * until you officially increment the currentVersion to 4.
         */
        const cols = getVersionedColumns(table, currentVersion);

        /**
         * DEPENDENCY MANAGEMENT:
         * ctx.ref(RAW_SCHEMA, table.tableName) tells Dataform:
         * "Don't create this view until the Raw Table is finished adding columns."
         */
        return `SELECT 
    ${cols} 
FROM ${ctx.ref(RAW_SCHEMA, table.tableName)}`;
    });
});