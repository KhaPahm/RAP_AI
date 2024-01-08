/* eslint-disable no-undef */

import fs from "fs";
import path from "path";


export function WriteErrLog(errMsg) {
	const errorLogFile = fs.createWriteStream(path.join(__dirname, "..", "logs", "error.log"));
	// eslint-disable-next-line no-redeclare
	var errMsg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n";
	errorLogFile.write(errMsg);
	fs.close();
}
export function WriteInforLog(msgInfor) {
	const errorLogFile = fs.createWriteStream(path.join(__dirname, "..", "logs", "info.log"));
	var msg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n" + msgInfor;
	errorLogFile.write(msg);
}

