import { Router } from "express";
import { _LogIn, _SetPassword, _Register, _VerifyOtp, _ReSendOtp, _UpdateUser, _UpdateAvt, _Logout, _ExpandToken } from "../controllers/user.controllers.js";
import Multer from "multer";
import { TokenValidator, TokenValidatorSkipExpired } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { test } from "../controllers/index.controllers.js";

const upload = Multer();
const router = Router();

router.post("/login", upload.any(), _LogIn);
router.post("/logout", TokenValidatorSkipExpired, _Logout);
router.post("/expand", TokenValidatorSkipExpired, _ExpandToken);
router.post("/resetPassword", upload.any(), TokenValidator, CheckUrlRole, _SetPassword);
router.post("/register", upload.any(), _Register);
router.post("/resendOtp", upload.any(), _ReSendOtp);
router.post("/verifyOtp", upload.any(), _VerifyOtp);
router.post("/updateProfile", upload.any(),TokenValidator, _UpdateUser);
router.post("/updateAvt", upload.single("image"),TokenValidator, _UpdateAvt);
// router.post("/addRedList", upload.any(),TokenValidator, CheckUrlRole);
// router.post("/test", upload.array("image"), test);
router.post("/test", upload.any(), test);

export default router;