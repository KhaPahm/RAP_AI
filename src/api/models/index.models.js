import { mysq as mySqlConfig } from "../../config/database.config.js";
import { createConnection } from "mysql2/promise";
import { WriteErrLog } from "../helpers/index.helpers.js";

export async function query(sql) {
	var con = await createConnection({
		host: mySqlConfig.host,
		user: mySqlConfig.user,
		password: mySqlConfig.password,
		database: mySqlConfig.database,
		port: mySqlConfig.port,
		dateStrings: true,
		decimalNumbers: false
	});

	con.connect((err) => {
		if (err) {
			WriteErrLog(err);
		}
		return null;
	});

	const [result,] = await con.execute(sql);

	con.end((err) => {
		if (err) {
			console.error("Error closing connection: ", err);
			return;
		}
	});

	return result;
}