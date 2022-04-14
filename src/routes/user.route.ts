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
  checkEmailAvailable,
  getRecentUsers,
  adminCreateUser,
} from "../controllers/user.controller";
import { auth } from "../utils/authentication";

const router = express.Router();

router.get("/", auth, get);
router.get("/verify/:token", verify);
router.get("/email-available/:email", checkEmailAvailable);
router.get("/recent-users", auth, getRecentUsers);

router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/register", register);
router.post("/request-password-reset", requestPasswordReset);
router.post("/create-user", adminCreateUser);

router.patch("/reset-password/", resetPassword);
router.patch("/avatar-photo/", setAvatarPhoto);

export default router;
