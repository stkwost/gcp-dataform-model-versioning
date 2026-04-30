# 🚀 Metadata-Driven Versioned Data Architecture

This project implements a **decoupled data architecture** within Google Cloud Dataform. By separating the **Physical Raw Layer** from the **Logical Consumption Layer**, we enable seamless schema evolution and multi-version support without disrupting downstream reporting dependencies.

---

## 🏗 Architecture Overview

The system uses a metadata-first approach to manage how data flows from BigQuery source tables to user-facing views.

1.  **Raw Layer (Physical):** Hardened tables containing the source data.
2.  **Consumption Layer (Logical):** Dynamic views generated based on versioning logic, providing a stable interface for BI tools.

---

## 💡 Why JavaScript over SQLX?

In Dataform, `.sqlx` files are limited to a **one-to-one mapping** between files and actions (tables/views). You cannot use loops to generate multiple tables in a single `.sqlx` file.

This repository leverages the **Dataform JavaScript API** to implement a **Factory Pattern**. A single loop over metadata in a `.js` file can automatically generate dozens of versioned views. This dramatically reduces maintenance overhead and ensures consistency across versions.

---

## 🔢 Versioning Logic (`since` / `until`)

Each column defined in the metadata is governed by `since` and `until` tags. The system automatically filters these columns based on the target version being built.

| Property | Description |
| :--- | :--- |
| **`name`** | The Logical name shown to the user (Alias). |
| **`physicalName`** | The actual column name as it exists in BigQuery. |
| **`since`** | The version number where this column is introduced. |
| **`until`** | The version number where this column is deprecated. |

---

## 📂 Project Structure

The repository is organized into logic-driven modules to ensure scalability:

*   **`/includes/metadata.js`**: The single source of truth. Define your tables and column schemas here.
*   **`/includes/factory.js`**: The engine. Contains logic for versioning, aliasing, and automated view generation.
*   **`/definitions/01_raw_layer.js`**: Generates the physical BigQuery tables.
*   **`/definitions/02_consumption_versions.js`**: Generates legacy versioned datasets (e.g., `v1`, `v2`).
*   **`/definitions/03_consumption_stable.js`**: Generates the current "Stable" production views.
*   **`/definitions/99_cleanup.js`**: A safety-guarded script for environment hygiene.

---

## 🛠 Command Reference

Use Dataform tags to manage your lifecycle. Dataset names are automatically prefixed based on your `env` variable (e.g., `dev_raw_layer`).

*   `dataform run --tags raw` — Updates physical BigQuery table structures.
*   `dataform run --tags stable` — Updates current production views.
*   `dataform run --tags v1` — Updates legacy version 1 views.
*   `dataform run --tags cleanup` — Wipes the development environment.

---

## 🚀 How to Execute

1.  **Configure Environment:** Set your `env` variable in `workflow_settings.yaml`.
2.  **Deploy Schema:** Run `dataform run --tags raw` to ensure physical tables match metadata definitions.
3.  **Publish Views:** Run `dataform run --tags stable` to refresh logical consumption views.

---

## 🛑 Safety & Environment Isolation

> [!IMPORTANT]
> **Production Guardrails:** 
> Using the `env` variable, datasets are dynamically prefixed to prevent cross-contamination. The `99_cleanup.js` script is hard-coded to **block execution** if the environment is set to `prod`. You cannot accidentally wipe production data using this framework.
