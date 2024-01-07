const User = require("../models/user.models");
const bcrypt = require("bcrypt"); 

async function HashPassword(password = "") {
    const salt = await bcrypt.genSalt(10);
    const passwordWasHashed = await bcrypt.hash(password, salt);
    return passwordWasHashed;
}



module.exports = {
    async GetAllUser() {
        return User.GetAllUser();
    },
    async Login(userName = "", password = "") {    
        const t = await HashPassword(password);
        const userInfor = await User.Login(userName);
        if(userInfor.length != 1) {
            return {
                totalResult: 0,
                userInfor: userInfor[0]
            }
        }

        const match = await bcrypt.compare(password,userInfor[0].password)
        if(match) {
            return {
                totalResult: 1,
                userInfor: userInfor[0]
            }
        } else {
            return {
                totalResult: 0,
                userInfor: userInfor[0]
            }
        }
    }

}