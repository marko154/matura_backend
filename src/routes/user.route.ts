import express from "express";
import {
	login,
	get,
	register,
	requestPasswordReset,
	verify,
	resetPassword,
	setAvatarPhoto
} from "../controllers/user.controller";
import { auth } from "../utils/authMiddleware";

const router = express.Router();

router.get("/", auth, get);
router.get("/verify/:token", verify);

router.post("/login", login);
router.post("/register", register);
router.post("/request-password-reset", requestPasswordReset);

router.patch("/reset-password/", resetPassword);
router.patch("/avatar-photo/", resetPassword);

export default router;
