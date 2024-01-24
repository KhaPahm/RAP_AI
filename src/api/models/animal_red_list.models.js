import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import ImageModel from "./image.models.js";

export class Animal_Red_List {
    constructor(animal_red_list_id = 0, vn_name = "", en_name = "", sc_name = "", animal_infor = "", predict_id = 0, status = Status.OK, animal_type_id = 0, conservation_status_id = 0, images = []) {
        this.animal_red_list_id = animal_red_list_id;
        this.vn_name = vn_name;
        this.en_name = en_name;
        this.sc_name = sc_name;
        this.animal_infor = animal_infor;
        this.predict_id = predict_id;
        this.status = status;
        this.animal_type_id = animal_type_id;
        this.conservation_status_id = conservation_status_id;
        this.images = this.images;
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
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Cập nhật động vật thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Động vật đã tồn tại, vui lòng nhập mới", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    static async GetAnimalRedList(id = 0, status = Status.OK) {
        var strQuery = "";
        if(id == 0) {
            strQuery = `SELECT * FROM Animal_Red_List WHERE status = "${status}"`;
        } 
        else {
            strQuery = `SELECT * FROM Animal_Red_List WHERE animal_red_list_id = ${id} AND status = "${status}"`;
        }
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && id != 0) {
            const images = await ImageModel.GetImageByAnimalRedList(result.data.animal_red_list_id);
            if(images.resultCode == ResultCode.Success) {
                // const lstImagePath = [];
                // images.data.forEach(image => {
                //     lstImagePath.push(image.image_public_path)
                // });
                const animalRedList = new Animal_Red_List(result.data.animal_red_list_id, result.data.vn_name, result.data.en_name, result.data.sc_name, result.data.animal_infor, result.data.predict_id, result.data.status, result.data.animal_type_id, result.data.conservation_status_id, images.data);
                return new Result(ResultCode.Success, "Success", animalRedList)
            }
            return images;
        }
        else if(result.resultCode == ResultCode.Success && id == 0) {
            const animals = [];
            
            for(var i = 0; i < result.data.length; i++) {
                const animal = result.data[i];
                const a = new Animal_Red_List(animal.animal_red_list_id, 
                    animal.vn_name,
                    animal.en_name,
                    animal.sc_name,
                    animal.animal_infor,
                    animal.predict_id,
                    animal.status,
                    animal.animal_type_id,
                    animal.conservation_status_id,
                    )
                const images = await ImageModel.GetImageByAnimalRedList(animal.animal_red_list_id);
                if(images.resultCode == ResultCode.Success) {
                a.images = images.data;
                }  
                animals.push(a);
            }

            return new Result(ResultCode.Success, "Success", animals);
        }

        return result;
    }
}