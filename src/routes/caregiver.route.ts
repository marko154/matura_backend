import express from "express";
import {
	create,
	getAll,
	get,
	deleteCaregiver,
	createAvailibility,
} from "../controllers/caregiver.controller";

const router = express.Router();

router.post("/create/", create);
router.post("/create-availibility/", createAvailibility);
router.get("/all", getAll);
router.get("/:id", get);
router.delete("/:id", deleteCaregiver);

export default router;
