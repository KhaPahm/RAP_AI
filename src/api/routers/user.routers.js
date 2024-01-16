import { Router } from "express";
import { _LogIn, _SetPassword, _Register, _VerifyOtp } from "../controllers/user.controllers.js";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { test } from "../controllers/index.controllers.js";

const upload = Multer();
const router = Router();

router.post("/login", upload.any(), _LogIn);
router.post("/resetPassword", upload.any(), TokenValidator, CheckUrlRole, _SetPassword);
router.post("/register", upload.any(), _Register);
router.post("/verifyOtp", upload.any(), _VerifyOtp);
router.post("/addRedList", upload.any(),TokenValidator, CheckUrlRole);
router.post("/test", test);

export default router;