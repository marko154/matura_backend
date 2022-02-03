import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const auth: RequestHandler = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		res.status(401).json({
			status: 401,
			message: "Token was not provided",
		});
		return;
	}
	const token = authorization.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = decoded;
		// console.log(req.user);
		next();
	} catch (err) {
		res.status(401).json({
			status: 401,
			message: "Invalid access token.",
		});
	}
};

export { auth };
