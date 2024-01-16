import { query } from "./index.models.js"; 
import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Result } from "../interfaces/api.respone.interfaces.js";

export class Role {
    constructor(role_id = 0, role_name = "", role_description = "", status = Status.OK) {
        this.role_id = role_id;
        this.role_name = role_name;
        this.role_description = role_description;
        this.status = status;
    }

    async AddNewRole() {
        const strQuery = `INSERT INTO Role(role_name, role_description) VALUES ("${this.role_name}", "${this.role_description}");`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm quyền thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Phân quyền đã tồn tại, vui lòng thêm phân quyền mới!", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    static async SetRoleForUser(user_id, role_id = 3) {
		const result = await query(`INSERT INTO User_Role(user_id, role_id) VALUES (${user_id}, ${role_id});`)
		return result;
	}

    static async GetRoles(role_id = 0, status = null) {
        var strQuery = "";
        if(role_id == 0 && status == null) {
            strQuery = `SELECT * FROM Role`;
        } 
        else if(role_id != 0 && status != null) {
            strQuery = `SELECT * FROM Role WHERE role_id = ${role_id} and status = "${status}"`;
        }
        else if(role_id != 0) {
            strQuery = `SELECT * FROM Role WHERE role_id = ${role_id}"`;
        }
        else {
            strQuery = `SELECT * FROM Role WHERE status = "${status}"`;
        }

        const result = await query(strQuery);

        return result;
    }

    async UpdateRole() {
        const strQuery = `UPDATE Role SET role_name = "${this.role_name}", 
                                          role_description = "${this.role_description}", 
                                          status = "${this.status}" 
                                          WHERE role_id = ${this.role_id}`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Success!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Phân quyền bị trùng, vui lòng thử lại!", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

}