import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/database";
import { sendEmail } from "../utils/email.utils";

const get = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
};

const SALT_ROUNDS = 10;

interface SignupData {
	email: string;
	password: string;
}

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
		const token = jwt.sign(
			user,
			process.env.ACCESS_TOKEN_SECRET as string,
			{
				expiresIn: "1h",
			}
		);
		sendEmail(
			user.email,
			"Email verification",
			`<a href='http://localhost:3001/api/user/verify/${token}'>`
		);
	}

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

const verifyToken = (token: string) => {
	const decoded = jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as string
	);
};

export { register, get, verifyToken };
