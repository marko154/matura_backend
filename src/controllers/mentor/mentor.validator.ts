import { body } from "express-validator";

const create = [body("first_name").isAlpha()];

export { create };
