import { RequestHandler } from "express";
import * as patient from "../services/patient.service";

const create: RequestHandler = async (req, res, next) => {
	const { location, ...rest } = req.body;
	console.log(req.body);
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

const deletePatient: RequestHandler = async (req, res, next) => {
	try {
		await patient.deletePatient(req.params.id);
		res.status(200).json({ message: "Successfully deleted" });
	} catch (e) {
		next(e);
	}
};

const addContact: RequestHandler = async (req, res, next) => {
	try {
		await patient.addContact(req.body);
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

export { create, getAll, get, deletePatient, addContact, assignCaregiver };
