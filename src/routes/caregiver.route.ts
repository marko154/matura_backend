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
  createTermAvailibility,
  deleteAvailibility,
} from "../controllers/caregiver/caregiver.controller";
import * as validate from "../controllers/caregiver/caregiver.validator";

const router = express.Router();

router.post("/create/", create);
router.post("/:id/availibility/", createAvailibility);
// add availibility for a term
router.post(
  "/:id/term-availibility/",
  validate.createTermAvailibility,
  createTermAvailibility
);

router.get("/all", getAll);
router.get("/:id/sessions", getSessions);
router.get("/:id/availibility", getAvailibility);
router.get("/:id", get);
router.get("/emso-available/:emso", checkEmsoAvailable);

router.patch("/:id", update);

router.delete(
  "/availibility/:availibility_id",
  validate.deleteAvailibility,
  deleteAvailibility
);
router.delete("/:id", deleteCaregiver);

export default router;
