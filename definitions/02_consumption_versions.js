const { tables, versions } = require("../includes/metadata");
const { VERSIONED_SCHEMA_PREFIX } = require("../includes/constants");
const { getSelectColumns, getRawActionName } = require("../includes/factory");

versions.forEach((v) => {
  tables.forEach((table) => {
    publish(`${table.tableName}_v${v}`, {
      type: "view",
      schema: `${VERSIONED_SCHEMA_PREFIX}_v${v}`,
    }).query(ctx => {
      const rawRef = getRawActionName(table.tableName);
      return `SELECT ${getSelectColumns(table, v)} FROM ${ctx.ref(rawRef)}`;
    });
  });
});