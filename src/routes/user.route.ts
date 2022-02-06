import express from "express";
import {
	login,
	googleLogin,
	get,
	register,
	requestPasswordReset,
	verify,
	resetPassword,
	setAvatarPhoto,
} from "../controllers/user.controller";
import { auth } from "../utils/authentication";

const router = express.Router();

router.get("/", auth, get);
router.get("/verify/:token", verify);

router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/register", register);
router.post("/request-password-reset", requestPasswordReset);

router.patch("/reset-password/", resetPassword);
router.patch("/avatar-photo/", setAvatarPhoto);

export default router;
