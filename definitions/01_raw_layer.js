// definitions/01_raw_layer.js
const { tables } = require("../includes/metadata");
const { RAW_SCHEMA } = require("../includes/constants");
const { getPhysicalColumns, getRawActionName } = require("../includes/factory");

tables.forEach((table) => {
  // This must generate 'raw_customers'
  const actionName = getRawActionName(table.tableName); 

  publish(actionName, {
    type: "table",
    schema: RAW_SCHEMA,
    name: table.tableName, // This is the BigQuery Table Name
  }).query(ctx => `SELECT ${getPhysicalColumns(table)} LIMIT 0`);
});