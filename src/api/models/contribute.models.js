import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";

export class Contribute {
    constructor(contribute_id = 0, animal_name = "", description = "", datetime = ConverDateTimeToString(Date.now), status = Status.OK) {
        this.contribute_id = contribute_id;
        this.animal_name = animal_name;
        this.description = description;
        if(typeof datetime == "function") {
            this.datetime = ConverDateTimeToString(datetime)
        }
        else {
            this.datetime = datetime;
        }
        this.status = status;
    }

    async AddContribute() {
        const strQuery = `INSERT INTO Contribute(animal_name, description, datetime, status) 
                            VALUES ("${this.animal_name}", "${this.description}", "${this.datetime}", "${this.status}")`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            this.contribute_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm góp ý!", this);
        }

        return new Result(ResultCode.Err, "Erro when create new contribute!", null);
    }

    async DeleteContribute() {
        const strQuery = `DELETE FROM Contribute WHERE contribute_id = ${this.contribute_id}`;

        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.report_id = result.data.insertId;
            return new Result(ResultCode.Success, "Xóa góp ý thành công!", this);
        }

        return new Result(ResultCode.Err, "Erro when delete contribute!", null);
    }

    static async GetContributeById(contribute_id = 0) {
        const strQuery = `select u.user_id,
                            u.email,
                            u.full_name,
                            u.phone_number,
                            c.animal_name,
                            c.contribute_id,
                            c.description,
                            c.datetime,
                            c.status,
                            i.image_id,
                            i.image_type,
                            i.image_local_path,
                            i.image_public_path
                            from User_Contribute uc 
                            left join Contribute c on uc.contribute_id = c.contribute_id
                            left join User u on u.user_id = uc.user_id
                            left join Image i on uc.contribute_id = i.contribute_id
                            where uc.contribute_id = ${contribute_id} and i.contribute_id <> 0;`;

        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success && result.data.length > 0)
        {
            return this.HandleResultSuccess(result.data)
        }

        return new Result(ResultCode.Err, "Erro when get contribute!", null);
    }

    static async HandleResultSuccess(datas) {
        const fline = datas[0];
        const userInfor = {
            user_id: fline.user_id,
            email: fline.email,
            full_name: fline.full_name,
            phone_number: fline.phone_number,
        }

        const contribute = {
            contribute_id: fline.contribute_id,
            animal_name: fline.animal_name,
            description: fline.description,
            datetime: fline.datetime,
            status: fline.status,
            images: []
        }

        var images = [];
        datas.forEach(data => {
            var image = {
                image_id: data.image_id,
                image_type: data.image_type,
                image_local_path: data.image_local_path,
                image_public_path: data.image_public_path,
            }
            images.push(image);
        });

        contribute.images = images;
        return new Result(ResultCode.Success, "Success", {userInfor, contribute});
    }
}