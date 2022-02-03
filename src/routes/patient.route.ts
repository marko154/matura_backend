import express from "express";
import {
	create,
	getAll,
	get,
	deletePatient,
	addContact,
} from "../controllers/patient.controller";

const router = express.Router();

router.post("/create", create);
router.post("/add-contact", addContact);
router.get("/all", getAll);
router.get("/:id", get);
router.delete("/:id", deletePatient);

export default router;
