const mySqlConfig = require("../../config/database.config").mysq;
const mysql = require("mysql2/promise");
const writeLog = require("../helpers/index.helpers");

module.exports = {
    async query(sql) {
        var con = await mysql.createConnection({
            host: mySqlConfig.host,
            user: mySqlConfig.user,
            password: mySqlConfig.password,
            database: mySqlConfig.database,
            port: mySqlConfig.port,
            dateStrings: true,
            decimalNumbers: false
        });

        con.connect((err) => {
            if(err) {
                writeLog.WriteErrLog(err);
            }
            return null;
        });

        const [result, ] = await con.execute(sql);

        con.end((err) => {
            if (err) {
                console.error('Error closing connection: ', err);
                return;
            }
        });

        return result;
    },
};