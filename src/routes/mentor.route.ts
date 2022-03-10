import express from "express";
import {
  create,
  getAll,
  get,
  deleteMentor,
  update,
  getCaregivers,
  getAssignableCaregivers,
  assignCaregivers,
  unassignCaregivers,
} from "../controllers/mentor.controller";

const router = express.Router();

router.post("/create", create);
router.post("/:id/assign-caregivers", assignCaregivers);
router.post("/unassign-caregivers", unassignCaregivers);

router.patch("/", update);

router.get("/all", getAll);
router.get("/assignable-caregivers", getAssignableCaregivers);
router.get("/:id", get);
router.get("/:id/caregivers", getCaregivers);

router.delete("/:id", deleteMentor);

export default router;
