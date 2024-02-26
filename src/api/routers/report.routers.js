import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _CreateNewReport, _GetReport, _RecordAction } from "../controllers/report.controllers.js";


const upload = Multer();
const router = Router();

router.post("/createReport", upload.single("image"), TokenValidator, CheckUrlRole, _CreateNewReport);
router.post("/getReport", upload.any(), TokenValidator, CheckUrlRole, _GetReport);
router.post("/recordAction", upload.any(), TokenValidator, CheckUrlRole, _RecordAction);


export default router;