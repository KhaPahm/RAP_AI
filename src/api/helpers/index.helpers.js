/* eslint-disable no-undef */

import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function WriteErrLog(errMsg) {
	var decorerrMsg = "\n----------------------------------------------------\n"
			+ Date().toString() + "\n" + errMsg + "\n";
	await fs.appendFile(__dirname + "/../logs/error.log", decorerrMsg, (err) => {
		if(err) throw err;
	});
	// eslint-disable-next-line no-redeclare
	
}
export function WriteInforLog(msgInfor) {
	var msg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n" + msgInfor;
	fs.appendFile("./src/api/logs/loginfo.log", msg, (err) => {
		if(err) throw err;
	});
}

