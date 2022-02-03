import { Prisma } from ".prisma/client";
import { prisma } from "../prisma/database";
import { exclude } from "../utils/database.utils";

const create = async (
	userFields: Prisma.UserCreateWithoutUser_typeInput,
	mentorFields: Omit<Prisma.MentorCreateWithoutUserInput, "Caregiver">
) => {
	return await prisma.user.create({
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
		select: { user_id: true },
	});
};

const getAll = async ({ limit, page }: any) => {
	const [total, mentors] = await prisma.$transaction([
		prisma.mentor.count(),
		prisma.mentor.findMany({
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
			take: +limit,
			skip: (page - 1) * limit,
		}),
	]);
	return { total, mentors };
};

const get = async (userId: string) => {
	const mentor = await prisma.user.findUnique({
		where: { user_id: Number(userId) },
		include: { mentor: true },
	});
	// fix never type here
	return exclude(mentor, "password_hash" as never);
};

// mentor record gets deleted due to onDelete cascade option
const deleteMentor = async (userId: string) => {
	await prisma.user.delete({ where: { user_id: Number(userId) } });
};

export { create, getAll, get, deleteMentor };
