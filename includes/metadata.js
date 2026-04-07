const tables = [
  {
    tableName: "customers",
    columns: [

      { name: "v__id", physicalName: "p_id", type: "INT64", since: 1, until: null },

      { name: "v_email", physicalName: "p_email", type: "STRING", since: 1, until: 2 },
//      { name: "v_email_V2", physicalName: "p_email", type: "STRING", since: 3, until: null },      

      { name: "v_phone", physicalName: "p_phone", type: "STRING", since: 2, until: null },

//      { name: "v_address_new", physicalName: "p_address", type: "STRING", since: 2, until: 2 },  

    ]
  }
];

const versions = [1, 2, 3];
const currentVersion = 2;

module.exports = { tables, versions, currentVersion };