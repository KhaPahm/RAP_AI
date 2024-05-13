import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import ImageModel from "./image.models.js";
import tf from "@tensorflow/tfjs-node"

export class Animal_Red_List {
    constructor(animal_red_list_id = 0, vn_name = "", en_name = "", sc_name = "", animal_infor = "", status = Status.OK, animal_type = "", conservation_status = "", images = [], predict_id = 0, animal_type_id = 0, conservation_status_id = 0) {
        this.animal_red_list_id = animal_red_list_id;
        this.vn_name = vn_name;
        this.en_name = en_name;
        this.sc_name = sc_name;
        this.animal_infor = animal_infor;
        this.status = status;
        this.animal_type = animal_type;
        this.conservation_status = conservation_status;
        this.images = images;
        this.predict_id = predict_id;
        this.animal_type_id = animal_type_id;
        this.conservation_status_id = conservation_status_id;
    }

    // async AddAnimalRedList() {
    //     const strQuery = `INSERT INTO Animal_Red_List(
    //                             vn_name,
    //                             en_name,
    //                             sc_name,
    //                             animal_infor,
    //                             predict_id,
    //                             status,
    //                             animal_type_id,
    //                             conservation_status_id
    //                         ) VALUES (
    //                             "${this.vn_name}",
    //                             "${this.en_name}",
    //                             "${this.sc_name}",
    //                             "${this.animal_infor}",
    //                             ${this.predict_id},
    //                             "${this.status}",
    //                             ${this.animal_type_id},
    //                             ${this.conservation_status_id}
    //                         )`;
    //     const result = await query(strQuery);
    //     if(result.resultCode == ResultCode.Success)
    //     {
    //         this.animal_red_list_id = result.data.insertId;
    //         return new Result(ResultCode.Success, "Thêm mới động vật thành công!", this);
    //     }
    //     if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
    //         return new Result(ResultCode.Err, "Động vật đã tồn tại, vui lòng nhập mới", null);
    //     }

    //     return new Result(ResultCode.Err, "Erro when add new role!", null);
    // }

    // async UpdateAnimalRedList() {
    //     const strQuery = `UPDATE Animal_Red_List SET
    //                         vn_name = "${this.vn_name}",
    //                         en_name = "${this.en_name}",
    //                         sc_name = "${this.sc_name}",
    //                         animal_infor = "${this.animal_infor}",
    //                         predict_id = ${this.predict_id},
    //                         status = "${this.status}",
    //                         animal_type_id = ${this.animal_type_id},
    //                         conservation_status_id = ${this.conservation_status_id}
    //                     WHERE animal_red_list_id = ${this.animal_red_list_id};
    //                     `;
    //     const result = await query(strQuery);

    //     if(result.resultCode == ResultCode.Success)
    //     {
    //         this.role_id = result.data.insertId;
    //         return new Result(ResultCode.Success, "Cập nhật động vật thành công!", this);
    //     }
    //     if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
    //         return new Result(ResultCode.Err, "Động vật đã tồn tại, vui lòng nhập mới", null);
    //     }

    //     return new Result(ResultCode.Err, "Erro when add new role!", null);
    // }

    static async GetAnimalRedList(id = 0, status = Status.OK) {
        var strQuery = "";
        if(id == 0) {
            strQuery = `select arl.animal_red_list_id, 
                                arl.vn_name,
                                arl.en_name,
                                arl.sc_name,
                                arl.animal_infor,
                                arl.status,
                                arl.predict_id,
                                cs.stand_name as conservation_status ,
                                aty.type_name as animal_type,
                                aty.animal_type_id,
                                cs.conservation_status_id
                        from Animal_Red_List arl 
                        left join Conservation_Status cs 
                        on arl.conservation_status_id = cs.conservation_status_id
                        left join Animal_Types aty 
                        on arl.animal_type_id = aty.animal_type_id
                        where arl.status = "${status}" ORDER BY arl.predict_id ASC`;
        } 
        else {
            strQuery = `select arl.animal_red_list_id, 
                                arl.vn_name,
                                arl.en_name,
                                arl.sc_name,
                                arl.animal_infor,
                                arl.status,
                                arl.predict_id,
                                cs.stand_name as conservation_status ,
                                aty.type_name as animal_type,
                                aty.animal_type_id,
                                cs.conservation_status_id
                        from Animal_Red_List arl 
                        left join Conservation_Status cs 
                        on arl.conservation_status_id = cs.conservation_status_id
                        left join Animal_Types aty 
                        on arl.animal_type_id = aty.animal_type_id
                        where arl.animal_red_list_id = ${id} and arl.status = "${status}" ORDER BY arl.predict_id ASC`;
        }
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && id != 0 && result.data.length > 0) {
            const images = await ImageModel.GetImageByAnimalRedList(result.data[0].animal_red_list_id);
            if(images.resultCode == ResultCode.Success) {
                // const lstImagePath = [];
                // images.data.forEach(image => {
                //     lstImagePath.push(image.image_public_path)
                // });
                const animalRedList = new Animal_Red_List(result.data[0].animal_red_list_id, result.data[0].vn_name, 
                    result.data[0].en_name, result.data[0].sc_name, result.data[0].animal_infor, result.data[0].status, 
                    result.data[0].animal_type, result.data[0].conservation_status, images.data, result.data[0].predict_id,
                    result.data[0].animal_type_id, result.data[0].conservation_status_id );
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
                    animal.status,
                    animal.animal_type,
                    animal.conservation_status,
                    null,
                    animal.predict_id,
                    animal.animal_type_id, 
                    animal.conservation_status_id 
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

    static async SearchAnimalRedList(name = "") {
        var strQuery = "";
        strQuery = `select arl.animal_red_list_id, 
                                arl.vn_name,
                                arl.en_name,
                                arl.sc_name,
                                arl.animal_infor,
                                arl.status,
                                cs.stand_name as conservation_status ,
                                aty.type_name as animal_type
                        from Animal_Red_List arl 
                        left join Conservation_Status cs 
                        on arl.conservation_status_id = cs.conservation_status_id
                        left join Animal_Types aty 
                        on arl.animal_type_id = aty.animal_type_id
                        where arl.vn_name like "%${name}%" OR arl.en_name like "%${name}%"`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && result.data.length > 0) 
        {
            const animals = [];
            
            for(var i = 0; i < result.data.length; i++) {
                const animal = result.data[i];
                const a = new Animal_Red_List(animal.animal_red_list_id, 
                    animal.vn_name,
                    animal.en_name,
                    animal.sc_name,
                    animal.animal_infor,
                    animal.status,
                    animal.animal_type,
                    animal.conservation_status,
                    null,
                    animal.predict_id,
                    animal.animal_type_id, 
                    animal.conservation_status_id 
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

    static async GetAnimalRedListByPredictId(predict_id = 0, rate = 0.0, status = Status.OK) {
        rate = rate.toFixed(2);
        var strQuery = `select arl.animal_red_list_id, 
                                arl.vn_name,
                                arl.en_name,
                                arl.sc_name,
                                arl.animal_infor,
                                arl.status,
                                cs.stand_name as conservation_status ,
                                aty.type_name as animal_type
                        from Animal_Red_List arl 
                        left join Conservation_Status cs 
                        on arl.conservation_status_id = cs.conservation_status_id
                        left join Animal_Types aty 
                        on arl.animal_type_id = aty.animal_type_id
                        where arl.predict_id = ${predict_id} and arl.status = "${status}"`;

        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && result.data.length > 0) {
            const images = await ImageModel.GetImageByAnimalRedList(result.data[0].animal_red_list_id);
            if(images.resultCode == ResultCode.Success && images.data.length != 0) {
                // const lstImagePath = [];
                // images.data.forEach(image => {
                //     lstImagePath.push(image.image_public_path)
                // });
                const animalRedList = new Animal_Red_List(result.data[0].animal_red_list_id, result.data[0].vn_name, 
                    result.data[0].en_name, result.data[0].sc_name, result.data[0].animal_infor, result.data[0].status, 
                    result.data[0].animal_type, result.data[0].conservation_status, images.data, predict_id,
                    result.data[0].animal_type_id, result.data[0].conservation_status_id );
                return new Result(ResultCode.Success, "Success", [animalRedList, rate])
            }
            return new Result(ResultCode.Err, "Lỗi tải ảnh!", [null,null])
            
        }
        else {
            return new Result(ResultCode.Warning, "Không nhận dạng được động vật", [null, null])
        }
    }

    
    static async PredictAnimal(buffer) {
        const model = await tf.loadGraphModel('file://src/config/tfjs_files/model.json');
        //console.log("hello");
        const tensor = tf.node
            .decodeImage(buffer, 3)
            .resizeNearestNeighbor([150, 150])
            .toFloat()
            .expandDims();

        const prediction = model.predict(tensor);
        const result = prediction.as1D().argMax().dataSync()[0];
        const rate = prediction.dataSync()[result];
        return await this.GetAnimalRedListByPredictId(result+1, rate*100);
    }
}