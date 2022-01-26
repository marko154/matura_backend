import { Prisma } from ".prisma/client";
import { prisma } from "../prisma/database";

const create = async (
	userFields: Prisma.UserCreateWithoutUser_typeInput,
	rest: any
) => {
	await prisma.user.create({
		data: {
			...userFields,
			user_type: {
				connect: { user_type_id: 2 },
			},
			mentor: {
				create: {
					...rest,
					date_of_birth: new Date(rest.date_of_birth),
				} as Prisma.MentorCreateWithoutUserInput,
			},
		},
	});
};

export { create };
