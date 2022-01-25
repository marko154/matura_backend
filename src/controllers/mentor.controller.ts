import { RequestHandler } from "express";
import mentor from "../services/mentor.service";

const create: RequestHandler = async (req, res) => {
	const { email, ...rest } = req.body;
	try {
		await mentor.create({ email }, rest);
		res.sendStatus(200);
	} catch (e) {
		res.statusCode = 400;
		res.json(e);
	}
};

export { create };
