import Mailer from "nodemailer";
import { GoogleOAuth2 } from "../../config/googleAuth.config.js";
import { OAuth2Client } from "google-auth-library";
import { ResultCode } from "../interfaces/enum.interfaces.js"
import { WriteErrLog } from "../helpers/index.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
export async function SendingMail(email = "", title = "", content = "") {
    const outh2 = new OAuth2Client(
        GoogleOAuth2.clientId,
        GoogleOAuth2.clientSecret
    );

    outh2.setCredentials({
        refresh_token: GoogleOAuth2.refresh_token
    });
    try {
        const oAuthAccessTokenObject = await outh2.getAccessToken();
        const oAuthAccessToken = oAuthAccessTokenObject?.token;
        const transport = Mailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: "khapham.work@gmail.com",
                clientId: GoogleOAuth2.clientId,
                clientSecret: GoogleOAuth2.clientSecret,
                refreshToken: GoogleOAuth2.refresh_token,
                accessToken: oAuthAccessToken
            }
        });
    
        const mailOptions = {
            to: email,
            subject: title,
            html: content
        };
    
        const result = await transport.sendMail(mailOptions);
        if(result != null) {
            return new Result(ResultCode.Success, `Đã gửi OTP đến địa chỉ: ${email}!`);
        } else {
            return new Result(ResultCode.Err, `Không thể gửi email đến địa chỉ: ${email}!`);
        }
    } catch(err) {
        WriteErrLog(err)
        return new Result(ResultCode.Err, `Không thể gửi email đến địa chỉ: ${email}!`);
    }
    
}