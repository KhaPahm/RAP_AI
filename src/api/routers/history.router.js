import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _DeleteHistory, _GetHistory } from "../controllers/history.controllers.js";

const upload = Multer();
const router = Router();

router.post("/getHistory", upload.any(), TokenValidator, CheckUrlRole, _GetHistory);
router.post("/deleteHistory", upload.any(), TokenValidator, _DeleteHistory);


export default router;