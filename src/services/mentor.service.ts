import { Prisma } from ".prisma/client";
import { prisma } from "../prisma/database";

const create = async (
	userFields: Prisma.UserCreateWithoutUser_typeInput,
	mentorFields: Omit<Prisma.MentorCreateWithoutUserInput, "Caregiver">
) => {
	await prisma.user.create({
		data: {
			...userFields,
			user_type: {
				connect: { user_type_id: 2 },
			},
			mentor: {
				create: {
					...mentorFields,
					date_of_birth: new Date(mentorFields.date_of_birth),
				},
			},
		},
	});
};

const getAll = async () => {
	return await prisma.mentor.findMany({
		include: {
			user: {
				select: {
					user_id: true,
					email: true,
					email_validated: true,
					registration_date: true,
					avatar_url: true,
					external_type: true,
					display_name: true,
				},
			},
		},
	});
};

export { create, getAll };
