const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const routerIndexPath = path.join(__dirname, "api", "routers", "index.routers.js");
const router = require(routerIndexPath);

//Config enviroment variable
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: process.env.SESSION_SECRECT_KEY,
    resave: false,
    saveUninitialized: true
}))

app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: true
}))

app.use("/", router);

app.use((req, res) => {
    res.status(404).send({url: req.originalUrl + " not found!"});
})

app.listen(port, () => {
    console.log(`Server is running in port: ${port}`);
})