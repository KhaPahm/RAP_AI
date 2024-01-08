import { Router } from "express";
import { GetAllUser, LogIn } from "../controllers/user.controllers.js";
import Multer from "multer";

const upload = Multer();
const router = Router();

router.get("/all", GetAllUser);
router.post("/login", upload.any(), LogIn);

export default router;