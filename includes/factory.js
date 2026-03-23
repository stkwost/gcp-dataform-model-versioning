// includes/factory.js

function getSelectColumns(table, version) {
  return table.columns
    .filter(col => col.versions.includes(version))
    .map(col => {
      const aliasName = col.alias || col.name;
      if (col.deleted) {
        return `CAST(NULL AS ${col.type}) AS ${aliasName}`;
      }
      return `${col.name} AS ${aliasName}`;
    })
    .join(",\n    ");
}

function getPhysicalColumns(table) {
  return table.columns
    .filter(c => !c.deleted)
    .map(c => `CAST(NULL AS ${c.type}) AS ${c.name}`)
    .join(",\n");
}

function getRawActionName(tableName) {
  if (!tableName) { throw new Error("tableName is undefined in getRawActionName"); }
  return `raw_${tableName.trim()}`;
}

// CRITICAL: Ensure all 3 are here
module.exports = { 
  getSelectColumns, 
  getPhysicalColumns, 
  getRawActionName 
};