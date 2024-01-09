/* eslint-disable no-undef */

import fs from "fs";
import path from "path";


export function WriteErrLog(errMsg) {
	const errorLogFile = fs.createWriteStream("./src/api/logs/error.log");
	// eslint-disable-next-line no-redeclare
	var errMsg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n";
	errorLogFile.write(errMsg);
}
export function WriteInforLog(msgInfor) {
	const errorLogFile = fs.createWriteStream("./src/api/logs/loginfo.log");
	var msg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n" + msgInfor;
	errorLogFile.write(msg);
}

