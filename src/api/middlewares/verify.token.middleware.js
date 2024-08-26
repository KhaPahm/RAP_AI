import jwt from "jsonwebtoken";
import ApiRespone from "../interfaces/api.respone.interfaces.js";

export async function TokenValidator(req, res, next) {
    const accessToken = req.headers.authorization;
    //Kiểm tra accesssToken có tồn tại không
    if(!accessToken) {
        //Nếu unfined thì trả về lỗi
        return res.status(403).json(new ApiRespone(0, null, 100, "Lỗi xác thực!"));
    }
    //Lấy sign key của jwt
    const signingKey = process.env.JWT_SIGN_ACCESS_KEY;
    await jwt.verify(accessToken, signingKey, (err, decode) => {
        if(err)
        {
            if(err.name == "TokenExpiredError")
                return res.status(403).json(ApiRespone.Err(101, "Expried"));
            
            //Nếu quá trình xác thực lỗi thì trả về lỗi
            return res.status(403).json(ApiRespone.Err(100, "Lỗi xác thực!"));
        }
        //nếu quá trình xác thực thành công thì tiếp tục đến middleware tiếp theo
        req.user = decode;
        next();
    })
}

export async function TokenForgotPassword(req, res, next) {
    const accessToken = req.headers.authorization;
    //Kiểm tra accesssToken có tồn tại không
    if(!accessToken) {
        //Nếu unfined thì trả về lỗi
        return res.status(403).json(new ApiRespone(0, null, 100, "Lỗi xác thực!"));
    }
    //Lấy sign key của jwt
    const signingKey = process.env.JWT_SIGN_TEMP_ACCESS_KEY;
    await jwt.verify(accessToken, signingKey, (err, decode) => {
        if(err)
        {
            if(err.name == "TokenExpiredError")
                return res.status(403).json(ApiRespone.Err(101, "Expried"));
            
            //Nếu quá trình xác thực lỗi thì trả về lỗi
            return res.status(403).json(ApiRespone.Err(100, "Lỗi xác thực!"));
        }
        //nếu quá trình xác thực thành công thì tiếp tục đến middleware tiếp theo
        req.user = decode;
        next();
    })
}

export async function TokenValidatorSkipExpired(req, res, next) {
    const accessToken = req.headers.authorization;
    //Kiểm tra accesssToken có tồn tại không
    if(!accessToken) {
        //Nếu unfined thì trả về lỗi
        return res.status(403).json(new ApiRespone(0, null, 100, "Lỗi xác thực!"));
    }
    //Lấy sign key của jwt
    const signingKey = process.env.JWT_SIGN_ACCESS_KEY;
    const payload = await jwt.verify(accessToken, signingKey, {ignoreExpiration: true});
    req.user = payload;
    next();
}