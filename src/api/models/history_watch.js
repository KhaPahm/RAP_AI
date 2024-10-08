import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import { AnimalSearchTypes } from "../interfaces/enum.interfaces.js";
import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import ImageModel from "./image.models.js";

export class History_Watch {
    constructor (user_id = 0, animal_red_list_id = 0, watch_time = ConverDateTimeToString(new Date()), search_type = AnimalSearchTypes.Predict, ratio_search = null) {
        this.user_id = user_id,
        this.animal_red_list_id = animal_red_list_id,
        this.watch_time = watch_time,
        this.search_type = search_type,
        this.ratio_search = ratio_search,
        this.vn_name = "",
        this.en_name = "",
        this.img = ""
    }

    async CheckHistory() {
        const strQuery = `SELECT user_id, animal_red_list_id FROM History_Watch where user_id = ${this.user_id} && animal_red_list_id = ${this.animal_red_list_id}`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && result.data.length == 1)
            return true;
        return false;
    }

    async AddNewHistory() {
        const strQuery = `INSERT INTO History_Watch (
                                user_id,
                                animal_red_list_id,
                                watch_time,
                                search_type,
                                ratio_search
                            ) VALUES (
                                ${this.user_id},
                                ${this.animal_red_list_id},
                                "${this.watch_time}",
                                "${this.search_type}",
                                ${this.ratio_search}
                            )`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.animal_red_list_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm mới lịch sử thành công", this);
        }

        return new Result(ResultCode.Err, "Erro when add new history!", null);
    }

    async UpdateHistory() {
        const strQuery = `UPDATE History_Watch SET 
                                watch_time = "${this.watch_time}",
                                ratio_search = ${this.ratio_search},
                                search_type = "${this.search_type}",
                            WHERE user_id = ${this.user_id} && animal_red_list_id = ${this.animal_red_list_id}
                            `; 
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.animal_red_list_id = result.data.insertId;
            return new Result(ResultCode.Success, "Cập nhật lịch sử thành công", this);
        }

        return new Result(ResultCode.Err, "Erro when update history!", null);
    }

    static async GetHistory(user_id = 0, status = Status.OK) {
        const strQuery = `select hw.*, arl.vn_name, arl.en_name 
                            from History_Watch hw left join Animal_Red_List arl 
                            on hw.animal_red_list_id = arl.animal_red_list_id 
                            where hw.user_id = ${user_id};`

        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && result.data.length > 0) {
            var dt = result.data;
                var lsHistory = []

            for(var i = 0; i < dt.length; i++) {
                var history = new History_Watch(dt[i].user_id, dt[i].animal_red_list_id, dt[i].watch_time, dt[i].search_type, dt[i].ratio_search);
                history.en_name = dt[i].en_name;
                history.vn_name = dt[i].vn_name;
                const resultGetImage = await ImageModel.GetImageByAnimalRedList(dt[i].animal_red_list_id);
                if(resultGetImage.resultCode == ResultCode.Success) {
                    history.img = resultGetImage.data[0].image_public_path;
                }
                else {
                    history.img = "";
                }

                lsHistory.push(history)
            }
            
            result.data = lsHistory;
        }

        return result;
    }

    static async SetStatusForHistory(user_id, animal_red_list_id, status = Status.OK) {
        const strQuery = `Delete From History_Watch WHERE user_id = ${user_id} && animal_red_list_id = ${animal_red_list_id}`;
        const result = await query(strQuery);
        return result;
    }
}