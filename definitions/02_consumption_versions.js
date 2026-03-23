const { tables, versions } = require("../includes/metadata");
const { VERSIONED_SCHEMA_PREFIX, RAW_SCHEMA } = require("../includes/constants"); // Added RAW_SCHEMA
const { getSelectColumns } = require("../includes/factory");

versions.forEach((v) => {
  tables.forEach((table) => {
    publish(`${table.tableName}_v${v}`, {
      type: "view",
      schema: `${VERSIONED_SCHEMA_PREFIX}_v${v}`,
      tags: ["versions", `v${v}`] // <--- Multiple tags allowed
    }).query(ctx => {
      const columns = getSelectColumns(table, v);
      
      // Use the Schema and Table Name explicitly to force resolution
      return `SELECT ${columns} FROM ${ctx.ref(RAW_SCHEMA, table.tableName)}`;
    });
  });
});