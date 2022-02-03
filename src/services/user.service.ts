import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../prisma/database";
import {
	sendVerificationEmail,
	sendPasswordResetEmail,
} from "../utils/email.utils";

const get = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
		select: {
			user_id: true,
			avatar_url: true,
			display_name: true,
			email_validated: true,
			email: true,
			locale: true,
			user_type_id: true,
		},
	});
};

const SALT_ROUNDS = 10;

interface SignupData {
	email: string;
	password: string;
}

const login = async (data: any) => {
	const { email, password } = data;
	const user = await prisma.user.findUnique({
		where: { email },
		select: { password_hash: true, user_id: true, email: true },
	});

	if (!user || !user.password_hash) {
		throw { status: 404, message: "E-mail address does not exist." };
	}

	const valid = await bcrypt.compare(password, user.password_hash);
	if (!valid) {
		throw { status: 403, message: "Invalid credentials." };
	}

	const token = jwt.sign(
		{
			user_id: user.user_id,
			email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "3d",
		}
	);

	return { token };
};

// a user can register if the administrator has created en email input in the users table
const register = async (data: any) => {
	const { email, password } = data;
	const hash = await bcrypt.hash(password, SALT_ROUNDS);

	const { count } = await prisma.user.updateMany({
		data: { password_hash: hash },
		where: {
			email,
			external_id: null,
			password_hash: null,
		},
	});

	// handle case where:
	// - the user with the given email already has a password or an external id
	// - there is no such user in the database

	const user = await get(data.email);

	if (user && count > 0) {
		const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "1h",
		});
		sendVerificationEmail(user, token);
	}
	// fix sending too much info with user
	return {
		user,
		message:
			count > 0
				? "Success"
				: user === null
				? "Invalid email address. Ask your admin."
				: "A user with that email is already registered.",
	};
};

const verifyToken = async (token: string) => {
	const decoded = jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET
	) as jwt.JwtPayload;

	await prisma.user.update({
		data: {
			email_validated: true,
		},
		where: { user_id: decoded.user_id },
	});
};

const requestPasswordReset = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: { email },
		select: { password_hash: true },
	});

	if (!user || !user.password_hash) {
		throw Error("No users with that email exist.");
	}
	// use a part of a hashed password hash to make sure that the reset token can only be used once
	const key = crypto
		.createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
		.update(user.password_hash)
		.digest("hex")
		.slice(0, 20);

	const token = jwt.sign({ email, key }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "30min",
	});

	await sendPasswordResetEmail(email, token);
};

const resetPassword = async (token: string, newPassword: string) => {
	const decoded = jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET
	) as jwt.JwtPayload;

	const user = await prisma.user.findUnique({
		where: { email: decoded.email },
		select: { password_hash: true },
	});

	if (!user || !user.password_hash) {
		throw Error("No users with that email exist.");
	}

	const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
	const key = crypto
		.createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
		.update(user.password_hash)
		.digest("hex")
		.slice(0, 20);
	if (key !== decoded.key) {
		throw Error("Invalid token.");
	}

	await prisma.user.update({
		data: { password_hash: hash },
		where: { email: decoded.email },
	});
};

const setAvatarPhoto = async (user_id: number, imageURL: string) => {
	await prisma.user.update({
		data: { avatar_url: imageURL },
		where: { user_id },
	});
};

export {
	login,
	register,
	get,
	verifyToken,
	requestPasswordReset,
	resetPassword,
	setAvatarPhoto,
};
