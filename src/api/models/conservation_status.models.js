import { query } from "./index.models.js";
import { Status } from "../interfaces/enum.interfaces.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";

export class Conservation_Status {
    constructor(conservation_status_id = 0, status_name = "", stand_name = "", description = "", status = Status.OK) {
        this.conservation_status_id = conservation_status_id;
        this.status_name = status_name;
        this.stand_name = stand_name;
        this.description = description;
        this.status = status;
    }

    async AddConservationStatus() {
        const strQuery = `INSERT INTO Conservation_Status(status_name, stand_name, description, status) 
                            VALUES ("${this.status_name}", "${this.stand_name}", "${this.description}", "${this.status}")`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.conservation_status_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm tình trạng bảo tồn thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Tình trạng bảo tồn đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    async UpdateConservationStatus() {
        const strQuery = `UPDATE Conservation_Status SET status_name = "${this.status_name}", 
                                            stand_name = "${this.stand_name}",
                                            description =  "${this.description}",
                                            status = "${this.status}" 
                                        WHERE conservation_status_id = ${this.conservation_status_id}`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm tình trạng bảo tồn thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Tình trạng bảo tồn đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    static async GetConservationStatus(conservation_status_id = 0, status = null) {
        var strQuery = "";
        if(conservation_status_id == 0 && status == null) {
            strQuery = `SELECT * FROM Conservation_Status`;
        } 
        else if(conservation_status_id != 0 && status != null) {
            strQuery = `SELECT * FROM Conservation_Status WHERE conservation_status_id = ${conservation_status_id} and status = "${status}"`;
        }
        else if(conservation_status_id != 0) {
            strQuery = `SELECT * FROM Conservation_Status WHERE conservation_status_id = ${conservation_status_id}"`;
        }
        else {
            strQuery = `SELECT * FROM Conservation_Status WHERE status = "${status}"`;
        }
        const result = await query(strQuery);

        return result;
    }
}