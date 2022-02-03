import { Prisma } from ".prisma/client";
import { prisma } from "./database";
import casual from "casual";

const userTypes: Prisma.UserTypeCreateInput[] = [
	{
		user_type: "administrator",
		description: "Purpose is to assign caregivers to patients.",
	},
	{
		user_type: "mentor",
		description: "Has access to the caregivers that he mentors.",
	},
	{
		user_type: "caregiver",
		description: "",
	},
];

const getRandomAvatarUrl = () => {
	const random = Math.random().toString(36).substring(7);
	return `https://avatars.dicebear.com/api/adventurer/${random}.svg`;
};

const randomDate = (start: Date, end: Date) => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
};

const getRandomUser = (userTypeID: number): Prisma.UserCreateInput => {
	return {
		email: casual.email,
		display_name: casual.username,
		locale: Math.random() > 0.9 ? "sl" : "en",
		avatar_url: getRandomAvatarUrl(),
		user_type: {
			connect: { user_type_id: userTypeID },
		},
	};
};

// const getRandomLocation = () => {};

const generateCaregivers = (amount: number, numOfMentors: number) => {
	const caregivers: Prisma.CaregiverCreateInput[] = [];
	for (let i = 0; i < amount; i++) {
		caregivers.push({
			user: {
				create: getRandomUser(3),
			},
			first_name: casual.first_name,
			last_name: casual.last_name,
			date_of_birth: randomDate(
				new Date(1970, 0, 1),
				new Date(2003, 0, 1)
			),
			emso: (1101006500027 + 1).toString(),
			phone_number: casual.phone,
			gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
			additional_info: casual.sentences(3),
			mentor: {
				connect: {
					mentor_id: 1 + Math.floor(i / numOfMentors),
				},
			},
			// location: {
			// 	create:
			// }
		});
	}
	return caregivers;
};

const generateMentors = (amount: number) => {
	const mentors: Prisma.UserCreateInput[] = [];

	for (let i = 0; i < amount; i++) {
		mentors.push({
			...getRandomUser(2),
			mentor: {
				create: {
					first_name: casual.first_name,
					last_name: casual.last_name,
					date_of_birth: randomDate(
						new Date(1970, 0, 1),
						new Date(2003, 0, 1)
					),
					emso: (1101006500006 + i).toString(),
					phone_number: casual.phone,
					gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
				},
			},
		});
	}
	return mentors;
};

const seed = async () => {
	// generate mentors
	// for (const mentor of generateMentors(20)) {
	// 	await prisma.user.create({ data: mentor });
	// }
	// console.log(generateCaregivers(100, 10));
	// await prisma.userType.createMany({ data: userTypes });
};

seed();
