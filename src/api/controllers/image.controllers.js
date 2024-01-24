import { ResultCode } from "../interfaces/enum.interfaces.js";
import ImageModel from "../models/image.models.js";
import { UpdateImage } from "../services/image.services.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";


export async function _UpdateImage(req, res) {
    const imageID = req.body.imageID || 0;
    const status = req.body.status || "OK";

    if(imageID == 0) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const image = new ImageModel();
        image.image_id = imageID;
        image.status = status;
        const result = await UpdateImage(image);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}