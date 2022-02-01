import { RequestHandler } from "express";
import * as mentor from "../services/mentor.service";

const create: RequestHandler = async (req, res, next) => {
	const { email, ...rest } = req.body;
	try {
		await mentor.create({ email }, rest);
		res.status(200).json({ status: 200, message: "Success" });
	} catch (e) {
		next(e);
	}
};

const getAll: RequestHandler = async (req, res, next) => {
	try {
		const mentors = await mentor.getAll();
		res.status(200).json({ data: mentors });
	} catch (err) {
		next(err);
	}
};

export { create, getAll };
