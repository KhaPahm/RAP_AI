import express, { json, urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import router from "./api/routers/index.routers.js";
import chokidar from "chokidar";
import { SendingMailAttachment } from "./api/services/mail.services.js";
import path from "path";
//Config enviroment variable
config();

//Test//
// eslint-disable-next-line no-undef

//<<<------Watcher----->>>
var watcher = chokidar.watch("./src/backup/daily/RAP_AI", {ignored: /^\./, persistent: true});
watcher
  .on('add', async function(localPath) {
	// console.log(localPath);
	var flieName = path.parse(localPath);
	var filePath = path.join(flieName.dir, flieName.base);
	SendingMailAttachment(flieName.base, filePath);
  })
  .on('error', function(error) {console.error('Error happened', error);})

//------------------
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