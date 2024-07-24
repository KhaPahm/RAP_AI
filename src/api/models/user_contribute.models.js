import { ActionReport, Status } from "../interfaces/enum.interfaces.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js"; 

export class User_Contribute {
    constructor(contribute_id = 0, user_id = 0) {
        this.user_id = user_id;
        this.contribute_id = contribute_id;
    }

    async AddUserContribute() {
        const strQuery = `INSERT INTO User_Contribute(contribute_id, user_id) 
                            VALUES ("${this.contribute_id}", "${this.user_id}")`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.report_id = result.data.insertId;
            return new Result(ResultCode.Success, "Success");
        }

        return new Result(ResultCode.Err, "Erro when create new User_Contribute!", null);
    }

}