import express from "express";

// routers
import userRoutes from "./user.route";
import caregiverRoutes from "./caregiver.route";
import mentorRoutes from "./mentor.route";

const router = express.Router();

router.use("/mentor", mentorRoutes);
router.use("/caregiver", caregiverRoutes);
router.use("/user", userRoutes);

export default router;
