import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";

export class Animal_Red_List_New {
    constructor(animal_red_list_id = 0, vn_name = "", en_name = "", sc_name = "", animal_infor = "", status = Status.OK, predict_id, animal_type_id, conservation_status_id, images = [] ) {
        this.animal_red_list_id = animal_red_list_id;
        this.vn_name = vn_name;
        this.en_name = en_name;
        this.sc_name = sc_name;
        this.animal_infor = animal_infor;
        this.status = status;
        this.images = images;
        this.predict_id = predict_id;
        this.animal_type_id = animal_type_id, 
        this.conservation_status_id = conservation_status_id
    }

    async AddAnimalRedList() {
        const strQuery = `INSERT INTO Animal_Red_List(
                                vn_name,
                                en_name,
                                sc_name,
                                animal_infor,
                                predict_id,
                                status,
                                animal_type_id,
                                conservation_status_id
                            ) VALUES (
                                "${this.vn_name}",
                                "${this.en_name}",
                                "${this.sc_name}",
                                "${this.animal_infor}",
                                ${this.predict_id},
                                "${this.status}",
                                ${this.animal_type_id},
                                ${this.conservation_status_id}
                            )`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.animal_red_list_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm mới động vật thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Động vật đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    async UpdateAnimalRedList() {
        const strQuery = `UPDATE Animal_Red_List SET
                            vn_name = "${this.vn_name}",
                            en_name = "${this.en_name}",
                            sc_name = "${this.sc_name}",
                            animal_infor = "${this.animal_infor}",
                            predict_id = ${this.predict_id},
                            status = "${this.status}",
                            animal_type_id = ${this.animal_type_id},
                            conservation_status_id = ${this.conservation_status_id}
                        WHERE animal_red_list_id = ${this.animal_red_list_id};
                        `;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.animal_red_list_id = result.data.insertId;
            return new Result(ResultCode.Success, "Cập nhật động vật thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Động vật đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

}