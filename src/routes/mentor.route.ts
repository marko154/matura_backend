import express from "express";
import { create } from "../controllers/mentor.controller";

const router = express.Router();

router.post("/create/", create);

export default router;
