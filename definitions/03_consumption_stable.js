const {
    tables,
    currentVersion
} = require("../includes/metadata");
const {
    CONSUMPTION_SCHEMA,
    RAW_SCHEMA
} = require("../includes/constants");
const {
    getSelectColumns
} = require("../includes/factory");

tables.forEach((table) => {
    // Unique Dataform Action Name
    const actionName = `consumption_${table.tableName}`;

    publish(actionName, {
        type: "view",
        schema: CONSUMPTION_SCHEMA,
        name: table.tableName,
        tags: ["stable", "production"]
    }).query(ctx => {
        // We use the two-argument ref: (Dataset, TableName)
        // This forces Dataform to look for the physical table in the raw schema
        return `SELECT ${getSelectColumns(table, currentVersion)} FROM ${ctx.ref(RAW_SCHEMA, table.tableName)}`;
    });
});