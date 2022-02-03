import { RequestHandler } from "express";
import * as mentor from "../services/mentor.service";

const create: RequestHandler = async (req, res, next) => {
	const { email, ...rest } = req.body;
	try {
		const user = await mentor.create({ email }, rest);
		res.status(200).json({ status: 200, message: "Success", user });
	} catch (e) {
		next(e);
	}
};

const getAll: RequestHandler = async (req, res, next) => {
	try {
		const data = await mentor.getAll(req.query);
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
};

const get: RequestHandler = async (req, res, next) => {
	try {
		const mentorData = await mentor.get(req.params.id);
		res.status(200).json(mentorData);
	} catch (e) {
		next(e);
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

export { create, getAll, get, deleteMentor };
