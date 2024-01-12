import jwt from "jsonwebtoken";
import ApiRespone from "../interfaces/api.respone.interfaces.js";

export async function TokenValidator(req, res, next) {
    const accessToken = req.headers.authorization;
    //Kiểm tra accesssToken có tồn tại không
    if(!accessToken) {
        //Nếu unfined thì trả về lỗi
        return res.json(new ApiRespone(0, null, 100, "Lỗi xác thực!"));
    }
    //Lấy sign key của jwt
    const signingKey = process.env.JWT_SIGN_ACCESS_KEY;
    await jwt.verify(accessToken, signingKey, (err, decode) => {
        if(err)
        {
            //Nếu quá trình xác thực lỗi thì trả về lỗi
            return res.json(ApiRespone.Err(100, "Lỗi xác thực!"));
        }
        //nếu quá trình xác thực thành công thì tiếp tục đến middleware tiếp theo
        req.user = decode;
        next();
    })
}