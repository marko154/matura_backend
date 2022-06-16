import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import * as mentor from "../../services/mentor.service";

const create: RequestHandler = async (req, res, next) => {
  const { email, ...rest } = req.body;
  try {
    const user = await mentor.create({ email }, rest);
    res.status(200).json({ status: 200, message: "Success", user });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      res.status(500).json({ message: "Unique constraint failed." });
    } else next(e);
  }
};

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const data = await mentor.getAll(req.query);
    res.status(200).json({ status: "OK", data });
  } catch (err) {
    next(err);
  }
};

const get: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.params);
    const mentorData = await mentor.get(req.params.id);
    res.status(200).json(mentorData);
  } catch (e) {
    next(e);
  }
};

const getCaregivers: RequestHandler = async (req, res, next) => {
  try {
    const caregivers = await mentor.getCaregivers(req.params.id);
    res.status(200).json(caregivers);
  } catch (err) {
    next(err);
  }
};

const getAssignableCaregivers: RequestHandler = async (req, res, next) => {
  try {
    const caregivers = await mentor.getAssignableCaregivers(req.query as any);
    res.status(200).json({ caregivers });
  } catch (err) {
    next(err);
  }
};

const assignCaregivers: RequestHandler = async (req, res, next) => {
  try {
    await mentor.assignCaregivers(req.params.id, req.body);
    res.status(200).json({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

const unassignCaregivers: RequestHandler = async (req, res, next) => {
  try {
    await mentor.unassignCaregivers(req.params.id, req.body);
    res.status(200).json({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

const deleteMentor: RequestHandler = async (req, res, next) => {
  try {
    await mentor.deleteMentor(req.params.id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (e) {
    next(e);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    await mentor.update(req.body);
    res.status(200).json({ message: "Successfully updated" });
  } catch (err) {
    next(err);
  }
};

export {
  create,
  getAll,
  get,
  deleteMentor,
  update,
  getCaregivers,
  getAssignableCaregivers,
  assignCaregivers,
  unassignCaregivers,
};
