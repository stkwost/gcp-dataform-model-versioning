/**
 * THE CLEANUP SCRIPT (Safety Guarded)
 * This is used to wipe the environment for a fresh start.
 * CRITICAL: It will NOT run if the 'env' variable is set to 'prod'.
 */
const { RAW_SCHEMA, CONSUMPTION_SCHEMA, VERSIONED_SCHEMA_PREFIX } = require("../includes/constants");
const { versions } = require("../includes/metadata");
const env = dataform.projectConfig.vars.env || "dev";

operate("cleanup_environment", {
    tags: ["cleanup"]
}).queries(ctx => {
    // SECURITY CHECK: Prevent accidental deletion of production data.
    if (env === "prod") {
        return ["SELECT 'CLEANUP BLOCKED: Environment is set to PROD'"];
    }

    const project = dataform.projectConfig.defaultDatabase;
    const queries = [
        `DROP SCHEMA IF EXISTS \`${project}.${CONSUMPTION_SCHEMA}\` CASCADE`,
        `DROP SCHEMA IF EXISTS \`${project}.${RAW_SCHEMA}\` CASCADE`
    ];

    // Wipe all versioned datasets as well.
    versions.forEach(v => {
        queries.push(`DROP SCHEMA IF EXISTS \`${project}.${VERSIONED_SCHEMA_PREFIX}_v${v}\` CASCADE`);
    });

    return queries;
});