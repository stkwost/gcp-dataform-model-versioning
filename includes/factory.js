/**
 * COLUMN MAPPING & VERSIONING LOGIC
 * This function loops through your metadata and builds the SQL SELECT clause.
 * It handles:
 * 1. Renaming: Maps 'physicalName' to the logical 'name' using SQL aliases (AS).
 * 2. Versioning: Only includes columns where (since <= version) and (until >= version).
 */
function getVersionedColumns(table, targetVersion) {
    if (!table || !table.columns) return "*";

    return table.columns
        .filter(col => {
            // Logic: Is the column born yet? AND Is it not deprecated yet?
            const isBorn = col.since <= targetVersion;
            const isNotDead = !col.until || col.until >= targetVersion;
            return isBorn && isNotDead;
        })
        .map(col => {
            const physical = col.physicalName || col.name;
            const logical = col.name;
            // Generates: physical_column AS logical_column
            return `${physical} AS ${logical}`;
        })
        .join(",\n    ");
}

module.exports = { getVersionedColumns };