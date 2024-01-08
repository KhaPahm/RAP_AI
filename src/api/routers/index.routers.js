import { Router } from "express";
const router = Router();
import userRouter from "./user.routers.js";


router.use("/user", userRouter);
router.use("/", (req, res) => {
	res.send("This is API for RAP.");
});

export default router;
