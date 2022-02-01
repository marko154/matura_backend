import express from "express";
import { create, getAll } from "../controllers/mentor.controller";

const router = express.Router();

router.post("/create", create);
router.get("/all", getAll);

export default router;
