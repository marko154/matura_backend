import { RequestHandler } from "express";
import * as userService from "../services/user.service";

const register: RequestHandler = async (req, res, next) => {
	try {
		const data = await userService.register(req.body);
		res.status(200).json(data);
	} catch (e) {
		next(e);
	}
};

const get: RequestHandler = async (req, res, next) => {
	try {
		const userData = await userService.get(req.body.email);
		res.json(userData);
	} catch (e) {
		next(e);
	}
};

const verify: RequestHandler = async (req, res, next) => {
	try {
		userService.verifyToken(req.params.token);
	} catch {}
};

export { register, get, verify };
