/**
 * VERSIONED CONSUMPTION LAYER
 * This script loops through every version defined in metadata.js and 
 * creates a View. Each version (v1, v2, etc.) lives in its own dataset.
 */
const { tables, versions } = require("../includes/metadata");
const { RAW_SCHEMA, VERSIONED_SCHEMA_PREFIX } = require("../includes/constants");
const { getVersionedColumns } = require("../includes/factory");

versions.forEach((v) => {
    tables.forEach((table) => {
        // Unique ID for Dataform to track this specific version of the table.
        const actionId = `${table.tableName}_v${v}`;
        
        publish(actionId, {
            type: "view",
            schema: `${VERSIONED_SCHEMA_PREFIX}_v${v}`, // e.g. consumption_v1
            name: table.tableName,                       // Physical name in BQ remains 'customers'
            tags: ["versions", `v${v}`]                  // Allows running 'v1' independently
        }).query(ctx => {
            // Get columns filtered for THIS specific version 'v'
            const cols = getVersionedColumns(table, v);
            
            // 'ctx.ref' creates the dependency link to the Raw Layer table.
            return `SELECT ${cols} FROM ${ctx.ref(RAW_SCHEMA, table.tableName)}`;
        });
    });
});