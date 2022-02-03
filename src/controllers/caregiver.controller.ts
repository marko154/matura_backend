import { RequestHandler } from "express";
import * as caregiver from "../services/caregiver.service";

const create: RequestHandler = async (req, res, next) => {
	console.log(req.body);
	const { email, location, ...rest } = req.body;
	try {
		const response = await caregiver.create({ email }, rest, location);
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

export { create, getAll, get, deleteCaregiver, createAvailibility };
