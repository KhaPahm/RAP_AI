const User = require("../models/models.user");

module.exports = {
    async GetAllUser() {
        return User.GetAllUser();
    }
}