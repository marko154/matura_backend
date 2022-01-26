import express from "express";
import { get, register, verify } from "../controllers/user.controller";

const router = express.Router();

router.get("/:email", get);
router.post("/register", register);
router.get("/verify/:token", verify);

export default router;
