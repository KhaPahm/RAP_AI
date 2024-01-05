const express = require('express');
const router = express.Router();
const userRouter = require("./user.routers");


router.use("/user", userRouter);
router.use("/", (req, res) => {
    res.send("This is API for RAP.")
});

module.exports = router;
