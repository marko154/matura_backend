import { Prisma } from ".prisma/client";
import { prisma } from "../prisma/database";
import { createLocation } from "./common.service";

const create = async (
	patientFields: Prisma.PatientCreateInput,
	location: Location
) => {
	const createPatient = prisma.patient.create({
		data: {
			...patientFields,
			date_of_birth: new Date(patientFields.date_of_birth),
			location: { connect: { location_id: location.location_id } },
		},
	});

	return await prisma.$transaction([createLocation(location), createPatient]);
};

const getAll = async ({ limit, page }: any) => {
	const [total, patients] = await prisma.$transaction([
		prisma.patient.count(),
		prisma.patient.findMany({
			take: +limit,
			skip: (page - 1) * limit,
		}),
	]);
	return { total, patients };
};

const get = async (patientID: string) => {
	const patient = await prisma.patient.findUnique({
		where: { patient_id: Number(patientID) },
		include: { location: true },
	});

	return patient;
};

const deletePatient = async (patientID: string) => {
	await prisma.patient.delete({ where: { patient_id: Number(patientID) } });
	// should also delete location if necessary
};

const addContact = async (contact: Prisma.ContactCreateInput) => {
	await prisma.contact.create({ data: contact });
};

export { create, getAll, get, deletePatient, addContact };
