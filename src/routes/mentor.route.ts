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
} from "../controllers/mentor/mentor.controller";
import { auth, isAdmin } from "../utils/authentication";

const router = express.Router();

router.post("/", auth, create);
router.post("/:id/assign-caregivers", auth, assignCaregivers);
router.post("/unassign-caregivers", auth, unassignCaregivers);

router.patch("/", auth, isAdmin, update);

router.get("/", auth, isAdmin, getAll);
router.get("/assignable-caregivers", auth, getAssignableCaregivers);
router.get("/:id", auth, get);
router.get("/:id/caregivers", auth, getCaregivers);

router.delete("/:id", auth, isAdmin, deleteMentor);

export default router;
