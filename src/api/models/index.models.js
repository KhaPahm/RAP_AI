import { mysq as mySqlConfig } from "../../config/database.config.js";
import { createConnection } from "mysql2/promise";
import { WriteErrLog } from "../helpers/index.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";

export async function query(sql) {
	var con = await createConnection({
		host: mySqlConfig.host,
		user: mySqlConfig.user,
		password: mySqlConfig.password,
		database: mySqlConfig.database,
		port: mySqlConfig.port,
		dateStrings: true,
		decimalNumbers: false,
		multipleStatements: true,
	});

	con.connect((err) => {
		if (err) {
			WriteErrLog(err);
		}
		return new Result(ResultCode.Err, "Erro when connect DB.");
	});
	var result;
	try {
		[result, ] = await con.execute(sql);
		closeConnect(con);
		return new Result(ResultCode.Success, "Success", result);
	} catch (err) {
		await WriteErrLog(err);
		return new Result(ResultCode.Warning, "Erro when query database!", {code: err.code, errono: err.errono});
	}
}

async function closeConnect(con) {
	con.end( async (err) => {
		if (err) {
			await WriteErrLog(err);
		}
	});
}