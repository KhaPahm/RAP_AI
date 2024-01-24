import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _UpdateImage } from "../controllers/image.controllers.js";

const upload = Multer();
const router = Router();

router.post("/updateImage", upload.any(), TokenValidator, CheckUrlRole, _UpdateImage);


export default router;
