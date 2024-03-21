import { ActionReport, Status } from "../interfaces/enum.interfaces.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js"; 

export class User_Report {
    constructor(user_report_id = 0,action = ActionReport.Create, handle_time = "", user_id = 0, report_id = 0) {
        this.user_report_id = user_report_id;
        this.action = action;
        this.handle_time = handle_time;
        this.user_id = user_id;
        this.report_id = report_id;
    }

    async AddUserReport() {
        const strQuery = `INSERT INTO User_Report(
                                action,
                                handle_time,
                                user_id,
                                report_id
                            ) VALUES (
                                "${this.action}",
                                "${this.handle_time}",
                                ${this.user_id},
                                ${this.report_id}
                            )`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.user_report_id = result.data.insertId;
            return new Result(ResultCode.Success, "Success!", this);
        }

        return new Result(ResultCode.Err, "Erro when add record action!", null);
    }

    async AddRecordActionReport() {
        const strQueryCheck = `SELECT * FROM User_Report WHERE report_id = ${this.report_id} AND action = "CREATE";`;
        const check = await query(strQueryCheck);
        if(check.resultCode == ResultCode.Success && check.data.length > 0 && this.action == "CREATE") {
            return new Result(ResultCode.Warning, "Acction was recorded, can't record again!", null);
        }
        else {
            return this.AddUserReport();
        }
    }

    async DeleteRecordActionReport() {
        const strQueryCheck = `DELETE FROM User_Report WHERE report_id = ${this.report_id} AND action = "${this.action}"`;
        const result = await query(strQueryCheck);
        return result;
    }

}