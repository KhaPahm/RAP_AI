import express, { json, urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import router from "./api/routers/index.routers.js";

//Config enviroment variable
config();

// eslint-disable-next-line no-undef
const port = process.env.PORT;
const app = express();

app.use(json());

app.use(urlencoded({extended:false}));

app.use(session({
	// eslint-disable-next-line no-undef
	secret: process.env.SESSION_SECRECT_KEY,
	resave: false,
	saveUninitialized: true
}));

app.use(cookieParser());

app.use(cors({
	credentials: true,
	origin: true
}));

app.use("/", router);

app.use((req, res) => {
	res.status(404).send({url: req.originalUrl + " not found!"});
});

app.listen(port, () => {
	console.log(`Server is running in port: ${port}`);
});