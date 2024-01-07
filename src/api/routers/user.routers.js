const express = require('express');
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const upload = require('multer')();

router.get("/all", userControllers.GetAllUser);
router.post("/login",upload.any(), userControllers.LogIn);

module.exports = router;