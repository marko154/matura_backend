import { RequestHandler } from "express";
import * as caregiver from "../services/caregiver.service";

const create: RequestHandler = async (req, res, next) => {
  console.log(req.body);
  const { email, location, availibilities, ...rest } = req.body;
  try {
    const response = await caregiver.create({ email }, rest, location, availibilities);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const data = await caregiver.getAll(req.query);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const get: RequestHandler = async (req, res, next) => {
  try {
    const caregiverData = await caregiver.get(req.params.id);
    res.status(200).json(caregiverData);
  } catch (e) {
    next(e);
  }
};

const getSessions: RequestHandler = async (req, res, next) => {
  try {
    const sessions = await caregiver.getSessions(req.params.id);
    res.status(200).json(sessions);
  } catch (e) {
    next(e);
  }
};

const getAvailibility: RequestHandler = async (req, res, next) => {
  try {
    const availibilities = await caregiver.getAvailibilities(req.params.id);
    res.status(200).json(availibilities);
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const response = await caregiver.update(req.params.id, req.body);
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteCaregiver: RequestHandler = async (req, res, next) => {
  try {
    await caregiver.deleteCaregiver(req.params.id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (e) {
    next(e);
  }
};

const createAvailibility: RequestHandler = async (req, res, next) => {
  try {
    await caregiver.createAvailibility(req.body);
    res.status(200).json({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

const checkEmsoAvailable: RequestHandler = async (req, res, next) => {
  try {
    const count = await caregiver.checkEmsoAvailable(req.params.emso);
    res.status(200).json({ available: count === 0 });
  } catch (err) {
    next(err);
  }
};

export {
  create,
  getAll,
  get,
  getSessions,
  update,
  deleteCaregiver,
  createAvailibility,
  checkEmsoAvailable,
  getAvailibility,
};
