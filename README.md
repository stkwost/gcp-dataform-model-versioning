A Metadata-Driven Versioned Architecture
1. Architecture Overview
This project implements a decoupled architecture where the Raw Layer (Physical Tables) is separated
from the Consumption Layer (Logical Views). This allows for schema evolution and versioning without
breaking downstream reports.
2. Versioning Logic (since/until)
Each column in the metadata has a 'since' and 'until' tag. The system automatically filters these
columns based on the target version being built.
Property Description
name The Logical name shown to the user.
physicalName The actual column name in BigQuery.
since The version number where this column starts.
until The version number where this column is deprecated.
3. Environment Isolation
Using the 'env' variable, datasets are prefixed (e.g., dev_raw_layer). The cleanup script is hard-coded
to block execution if the environment is 'prod'.
4. Command Reference
• dataform run --tags raw - Updates BigQuery table structures.
• dataform run --tags stable - Updates current production views.
• dataform run --tags v1 - Updates legacy version 1 views.
• dataform run --tags cleanup - Wipes the dev environment.

Project Structure
/includes/metadata.js: Define your tables and columns here.
/includes/factory.js: Logic for versioning and aliasing.
/definitions/01_raw_layer.js: Physical BigQuery tables.
/definitions/02_consumption_versions.js: Versioned datasets (v1, v2).
/definitions/03_consumption_stable.js: Production views.
/definitions/99_cleanup.js: Safety-guarded deletion script.
How to execute
Set your env in workflow_settings.yaml.
Run dataform run --tags raw to update schemas.
Run dataform run --tags stable to update views.
Safety
The cleanup script will NOT run if env is set to prod.