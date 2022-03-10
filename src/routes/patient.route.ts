import express from "express";
import {
  create,
  getAll,
  get,
  update,
  deletePatient,
  addContacts,
  assignCaregiver,
  getClosestCaregivers,
  checkEmsoAvailable,
  getSessions,
  getEmergencyContacts,
  getAllSessions,
  createSession,
} from "../controllers/patient.controller";

const router = express.Router();

router.post("/create", create);
router.post("/create-session", createSession);
router.post("/:id/add-contacts", addContacts);
router.post("/assign-caregiver", assignCaregiver);

router.get("/all", getAll);
router.get("/:id/sessions", getSessions);
router.get("/all-sessions", getAllSessions);
router.get("/:id/contacts", getEmergencyContacts);
router.get("/:location_id/closest-caregivers", getClosestCaregivers);
router.get("/:id", get);
router.get("/emso-available/:emso", checkEmsoAvailable);

router.delete("/:id", deletePatient);

router.patch("/:id", update);

export default router;
