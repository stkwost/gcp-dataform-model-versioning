const { tables, currentVersion } = require("../includes/metadata");
const { CONSUMPTION_SCHEMA } = require("../includes/constants");
const { getSelectColumns, getRawActionName } = require("../includes/factory");

tables.forEach((table) => {
  // We use a unique Dataform Action Name: consumption_customers
  const actionName = `consumption_${table.tableName}`;
  const rawRef = getRawActionName(table.tableName);

  publish(actionName, {
    type: "view",
    schema: CONSUMPTION_SCHEMA,
    name: table.tableName, // The BigQuery name will be just 'customers'
    tags: ["stable"]
  }).query(ctx => {
    return `SELECT ${getSelectColumns(table, currentVersion)} FROM ${ctx.ref(rawRef)}`;
  });
});