const tables = [
  {
    tableName: "customers",
    columns: [
      { name: "customer_id", physicalName: "c_id", type: "INT64", since: 1, until: null },
      { name: "email_address", physicalName: "email", type: "STRING", since: 1, until: 2 },
      { name: "email_address_v2", physicalName: "email", type: "STRING", since: 3, until: null },      
      { name: "phone", physicalName: "ph_num_v2", type: "STRING", since: 2, until: null },
    ]
  }
];

const versions = [1, 2, 3];
const currentVersion = 3;

module.exports = { tables, versions, currentVersion };