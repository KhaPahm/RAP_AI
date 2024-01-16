/* eslint-disable no-undef */

import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function WriteErrLog(errMsg) {
	var decorerrMsg = "\n----------------------------------------------------\n"
			+ Date().toString() + "\n" + errMsg + "\n";
	await fs.appendFile(__dirname + "/../logs/err.log", decorerrMsg, (err) => {
		if(err) throw err;
	});
}
export async function WriteInforLog(msgInfor) {
	var msg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n" + msgInfor;
	await fs.appendFile(__dirname + "/../logs/infor.log", msg, (err) => {
		if(err) throw err;
	});
}

