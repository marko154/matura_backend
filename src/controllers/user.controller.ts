import { RequestHandler } from "express";
import user from "../services/user.service";

const register: RequestHandler = async (req, res) => {
	try {
		await user.register(req.body);
		res.sendStatus(200);
	} catch (e) {
		res.send("some sort of error i guess");
	}
};

const get: RequestHandler = async (req, res, next) => {
	try {
		const userData = await user.get(req.body.email);
		res.json(userData);
	} catch (e) {
		next(e);
	}
};

export { register, get };
