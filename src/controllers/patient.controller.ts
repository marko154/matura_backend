import { RequestHandler } from "express";
import * as patient from "../services/patient.service";

const create: RequestHandler = async (req, res, next) => {
  const { location, ...rest } = req.body;
  try {
    const response = await patient.create(rest, location);
    res.status(200).json({ status: 200, patient: response[1] });
  } catch (e) {
    next(e);
  }
};

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const data = await patient.getAll(req.query);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const get: RequestHandler = async (req, res, next) => {
  try {
    const mentorData = await patient.get(req.params.id);
    if (!mentorData) {
      res.status(404).json({ status: 404, message: "Not found." });
      return;
    }
    res.status(200).json(mentorData);
  } catch (e) {
    next(e);
  }
};

const getClosestCaregivers: RequestHandler = async (req, res, next) => {
  try {
    const caregivers = await patient.getClosestCaregivers(
      req.params.location_id,
      Number(req.query.offset)
    );
    res.status(200).json(caregivers);
  } catch (e) {
    next(e);
  }
};

const getSessions: RequestHandler = async (req, res, next) => {
  try {
    const sessions = await patient.getSessions(req.params.id);
    res.status(200).json(sessions);
  } catch (e) {
    next(e);
  }
};

const getEmergencyContacts: RequestHandler = async (req, res, next) => {
  try {
    const contacts = await patient.getEmergencyContacts(req.params.id);
    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    await patient.update(req.params.id, req.body);
    res.status(200).json({ message: "Sucessfully updated" });
  } catch (e) {
    next(e);
  }
};

const deletePatient: RequestHandler = async (req, res, next) => {
  try {
    await patient.deletePatient(req.params.id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (e) {
    next(e);
  }
};

const addContacts: RequestHandler = async (req, res, next) => {
  try {
    await patient.addContacts(req.body);
    res.status(200).json({ message: "Success" });
  } catch (e) {
    next(e);
  }
};

const assignCaregiver: RequestHandler = async (req, res, next) => {
  try {
    const session = patient.assignCaregiver(req.body);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

const checkEmsoAvailable: RequestHandler = async (req, res, next) => {
  try {
    const count = await patient.checkEmsoAvailable(req.params.emso);
    res.status(200).json({ available: count === 0 });
  } catch (err) {
    next(err);
  }
};

const getAllSessions: RequestHandler = async (req, res, next) => {
  try {
    const data = await patient.getAllSessions(req.query);
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const createSession: RequestHandler = async (req, res, next) => {
  try {
    await patient.createSession(req.body);
    res.status(200).json({ message: "Success", status: 200 });
  } catch (e) {
    next(e);
  }
};

const getAllLocations: RequestHandler = async (req, res, next) => {
  try {
    const locations = await patient.getAllLocations();
    res.status(200).json(locations);
  } catch (e) {
    next(e);
  }
};

const getLocations: RequestHandler = async (req, res, next) => {
  try {
    const locations = await patient.getLocations();
    res.status(200).json(locations);
  } catch (e) {
    next(e);
  }
};

export {
  create,
  getAll,
  get,
  update,
  deletePatient,
  addContacts,
  assignCaregiver,
  getClosestCaregivers,
  getEmergencyContacts,
  checkEmsoAvailable,
  getSessions,
  getAllSessions,
  createSession,
  getAllLocations,
  getLocations,
};
