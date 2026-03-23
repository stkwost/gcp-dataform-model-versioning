// includes/metadata.js
const tables = [
  {
    tableName: "customers",
    columns: [
      { name: "customer_id", type: "INT64", versions: [1, 2] },
      { name: "customer_name_raw", type: "STRING", versions: [1, 2], alias: "customer_name" },
      { name: "zip_code", type: "STRING", versions: [1, 2] },
      { name: "street_address", type: "STRING", versions: [1, 2] },
      { name: "country_code", type: "STRING", versions: [1, 2] },
      { name: "email_address", type: "STRING", versions: [1], alias: "mail"}      
      // Mark as deleted: V1 view sees NULL, Raw table drops it entirely
//      { name: "mail2", type: "STRING", versions: [1], deleted: true }, 
//      { name: "mail4", type: "STRING", versions: [2], alias: "primary_email" },

    ]
  }
];

const versions = [1, 2];
const currentVersion = 2; 

module.exports = { tables, versions, currentVersion };