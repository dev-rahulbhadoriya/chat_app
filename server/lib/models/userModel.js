const dbquery = require("../helpers/dbquery");
module.exports = {

    getUsersList: () => {
        const query = `select id,users_name,employee_name from users`;
        return dbquery.executeQuery(query);
    },
   
};