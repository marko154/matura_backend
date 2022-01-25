import { prisma } from "../prisma/database";
import bcrypt from "bcrypt";

const get = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
};

const SALT_ROUNDS = 10;

// a user can register if the administrator has created en email input in the users table
const register = async (data: any) => {
	bcrypt.hash(data.password, SALT_ROUNDS, async (err, hash) => {
		// console.log(err, hash, data);

		const { count } = await prisma.user.updateMany({
			data: { password_hash: "123123" },
			where: {
				email: "marko.gartnar7122@gmail.com",
				external_id: null,
				password_hash: null,
			},
		});

		if (count === 1) return;
		// handle case where:
		// - the user with the given email already has a password or an external id
		// - there is no such user in the database

		const user = await get(data.email);
	});
};

export default {
	register,
	get,
};
