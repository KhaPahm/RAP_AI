const express = require('express');
const router = express.Router();

router.use("/", (req, res) => {
    res.send("This is API for RAP.")
})

module.exports = router;
