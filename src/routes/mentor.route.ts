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

const router = express.Router();

/**
 * @openapi
 * /mentors:
 *   post:
 *     tags:
 *       - Mentor
 *     summary: create a new mentor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewMentor'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 user:
 *                   type: object
 *   get:
 *     tags:
 *       - Mentor
 *     summary: get mentors
 *     parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *              type: integer
 *          required: true
 *        - in: query
 *          name: page
 *          schema:
 *              type: integer
 *          required: true
 *        - in: query
 *          name: search
 *          schema:
 *              type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                      total:
 *                        type: integer
 *                      mentors:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/NewMentor'
 */

router.post("/", create);
router.post("/:id/assign-caregivers", assignCaregivers);
router.post("/unassign-caregivers", unassignCaregivers);

router.patch("/", update);

router.get("/", getAll);
router.get("/assignable-caregivers", getAssignableCaregivers);
router.get("/:id", get);
router.get("/:id/caregivers", getCaregivers);

router.delete("/:id", deleteMentor);

export default router;
