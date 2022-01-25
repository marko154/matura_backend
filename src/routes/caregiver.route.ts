import express from "express";
import { create } from "../controllers/caregiver.controller";

const router = express.Router();

router.post("/create/", create);

export default router;
