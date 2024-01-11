/* eslint-disable no-undef */

import fs from "fs";
import path from "path";


export function WriteErrLog(errMsg) {
	var errMsg = "\n----------------------------------------------------\n"
			+ Date.now.toString() + "\n";
	fs.appendFile("./src/api/logs/error.log", errMsg, (err) => {
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

