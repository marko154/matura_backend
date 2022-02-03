import { Prisma } from ".prisma/client";
import { prisma } from "../prisma/database";
import { exclude } from "../utils/database.utils";
import { createLocation } from "./common.service";

const create = async (
	userFields: Prisma.UserCreateWithoutUser_typeInput,
	caregiverFields: Omit<Prisma.CaregiverCreateWithoutUserInput, "Mentor">,
	location: Location
) => {
	const createUser = prisma.user.create({
		data: {
			...userFields,
			user_type: {
				connect: { user_type_id: 3 },
			},
			caregiver: {
				create: {
					...caregiverFields,
					date_of_birth: new Date(caregiverFields.date_of_birth),
				},
			},
		},
	});

	return await prisma.$transaction([createLocation(location), createUser]);
};

const getAll = async ({ limit, page }: any) => {
	const [total, caregivers] = await prisma.$transaction([
		prisma.caregiver.count(),
		prisma.caregiver.findMany({
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
	return { total, caregivers };
};

const get = async (userId: string) => {
	const caregiver = await prisma.user.findUnique({
		where: { user_id: Number(userId) },
		include: { caregiver: { include: { mentor: true, location: true } } },
	});
	if (!caregiver) throw { status: 404, message: "Not found" };
	// fix never type here
	return exclude(caregiver, "password_hash" as never);
};

const deleteCaregiver = async (userId: string) => {
	return await prisma.user.delete({ where: { user_id: Number(userId) } });
};

const createAvailibility = async (data: Prisma.TermCreateInput) => {
	await prisma.term.create({ data });
};

export { create, getAll, get, deleteCaregiver, createAvailibility };
