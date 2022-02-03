import express from "express";
import {
	create,
	getAll,
	get,
	deleteMentor,
} from "../controllers/mentor.controller";

const router = express.Router();

router.post("/create", create);
router.get("/all", getAll);
router.get("/:id", get);
router.delete("/:id", deleteMentor);

export default router;
