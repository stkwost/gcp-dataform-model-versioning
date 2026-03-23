const { tables } = require("../includes/metadata");
const { RAW_SCHEMA } = require("../includes/constants");
const { getPhysicalColumns, getRawActionName } = require("../includes/factory");

tables.forEach((table) => {
  publish(getRawActionName(table.tableName), {
    type: "table",
    schema: RAW_SCHEMA,
    name: table.tableName,
    tags: ["raw"] // <--- Tag for the Raw Layer
  }).query(ctx => `SELECT ${getPhysicalColumns(table)} LIMIT 0`);
});