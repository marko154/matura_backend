import express from "express";

// routers
import userRoutes from "./user.route";
import caregiverRoutes from "./caregiver.route";
import mentorRoutes from "./mentor.route";
import patientRoutes from "./patient.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/mentors", mentorRoutes);
router.use("/caregiver", caregiverRoutes);
router.use("/patient", patientRoutes);

export default router;
