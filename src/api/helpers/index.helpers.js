const fs = require('fs');
const path = require("path");

module.exports = {
    WriteErrLog(errMsg) {
        const errorLogFile = fs.createWriteStream(path.join(__dirname, "..", "logs", "error.log"));
        var errMsg = "\n----------------------------------------------------\n"
                + Date.now.toString() + "\n";
            errorLogFile.write(errMsg);
        fs.close();
    },
    WriteInforLog(msgInfor) {
        const errorLogFile = fs.createWriteStream(path.join(__dirname, "..", "logs", "info.log"));
        var msg = "\n----------------------------------------------------\n"
                + Date.now.toString() + "\n" + msgInfor;
            errorLogFile.write(msg);
    },

}