import express from "express";
import {
  create,
  getAll,
  get,
  deleteCaregiver,
  createAvailibility,
  update,
  getSessions,
  checkEmsoAvailable,
  getAvailibility,
} from "../controllers/caregiver.controller";

const router = express.Router();

router.post("/create/", create);
router.post("/create-availibility/", createAvailibility);

router.get("/all", getAll);
router.get("/:id/sessions", getSessions);
router.get("/:id/availibility", getAvailibility);
router.get("/:id", get);
router.get("/emso-available/:emso", checkEmsoAvailable);

router.patch("/:id", update);

router.delete("/:id", deleteCaregiver);

export default router;
