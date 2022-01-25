import { RequestHandler } from "express";
import caregiver from "../services/caregiver.service";

const create: RequestHandler = async (req, res) => {
	const { email, ...rest } = req.body;
	try {
		await caregiver.create({ email }, rest);
		res.sendStatus(200);
	} catch (e) {
		res.statusCode = 400;
		res.json(e);
	}
};

export { create };
