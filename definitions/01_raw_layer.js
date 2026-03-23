const { tables } = require("../includes/metadata");
const { RAW_SCHEMA } = require("../includes/constants");
const { getRawActionName, getPhysicalColumns } = require("../includes/factory");

tables.forEach((table) => {
  const actionName = getRawActionName(table.tableName);

  publish(actionName, {
    type: "incremental",
    schema: RAW_SCHEMA,
    name: table.tableName,
    tags: ["raw"]
  }).preOps(ctx => {
    // This runs only if the table already exists
    return table.columns
      .filter(col => !col.deleted)
      .map(col => `ALTER TABLE IF EXISTS ${ctx.self()} ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
  }).query(ctx => {
    const colList = table.columns
      .filter(c => !c.deleted)
      .map(c => `CAST(NULL AS ${c.type}) AS ${c.name}`)
      .join(",\n    ");

    if (!ctx.incremental()) {
      /**
       * FIRST RUN:
       * Create the empty table structure.
       * Transfers 0 rows.
       */
      return `SELECT ${colList} LIMIT 0`;
    } else {
      /**
       * SUBSEQUENT RUNS:
       * Dataform requires a query to run, but we want 0 data transfer.
       * We select from the table itself with a false condition.
       * Transfers 0 rows.
       */
      return `SELECT * FROM ${ctx.self()} WHERE FALSE`;
    }
  });
});