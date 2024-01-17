import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";

export class Animal_Type {
    constructor(animal_type_id = 0, type_name = "", description = "", status = Status.OK) {
        this.animal_type_id = animal_type_id;
        this.type_name = type_name;
        this.description = description;
        this.status = status;
    }

    async AddAnimalType() {
        const strQuery = `INSERT INTO Animal_Types(type_name, description, status) 
                            VALUES ("${this.type_name}", "${this.description}", "${this.status}")`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.conservation_status_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm loài mới thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Loài đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    async UpdateAnimalType() {
        const strQuery = `UPDATE Animal_Types SET type_name = "${this.type_name}", 
                                            description =  "${this.description}",
                                            status = "${this.status}" 
                                        WHERE animal_type_id = ${this.animal_type_id}`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Cập nhật loài thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Loài đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    static async GetAnimalTypes(animal_type_id = 0, status = null) {
        var strQuery = "";
        if(animal_type_id == 0 && status == null) {
            strQuery = `SELECT * FROM Animal_Types`;
        } 
        else if(animal_type_id != 0 && status != null) {
            strQuery = `SELECT * FROM Animal_Types WHERE animal_type_id = ${animal_type_id} and status = "${status}"`;
        }
        else if(animal_type_id != 0) {
            strQuery = `SELECT * FROM Animal_Types WHERE animal_type_id = ${animal_type_id}"`;
        }
        else {
            strQuery = `SELECT * FROM Animal_Types WHERE status = "${status}"`;
        }
        const result = await query(strQuery);

        return result;
    }
}