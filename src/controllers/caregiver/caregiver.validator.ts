import { body, param } from "express-validator";

export const createTermAvailibility = [
  body("caregiver_id").isNumeric().toInt(),
  body("term_id").isInt(),
  body("day_of_week").isInt(),
  body("start_time").isString().toDate(),
  body("end_time").isString().toDate(),
];

export const deleteAvailibility = [param("availibility_id").exists().toInt()];
