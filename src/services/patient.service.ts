import { Prisma } from ".prisma/client";
import { Contact, Session, PrismaPromise } from "@prisma/client";
import { prisma } from "../prisma/database";
import { createLocation } from "./common.service";

const create = async (patientFields: Prisma.PatientCreateInput, location: Location) => {
  const createPatient = prisma.patient.create({
    data: {
      ...patientFields,
      date_of_birth: new Date(patientFields.date_of_birth),
      location: { connect: { location_id: location.location_id } },
    },
  });

  return await prisma.$transaction([createLocation(location), createPatient]);
};

const getAll = async ({ limit, page, search }: any) => {
  const [total, patients] = await prisma.$transaction([
    prisma.patient.count({ where: { email: { contains: search } } }),
    prisma.patient.findMany({
      take: +limit,
      skip: (page - 1) * limit,
      where: {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
        ],
      },
    }),
  ]);
  return { total, patients };
};

const get = async (patientID: string) => {
  const [patient, coords] = await prisma.$transaction([
    prisma.patient.findUnique({
      where: { patient_id: Number(patientID) },
      include: { location: true },
    }),
    prisma.$queryRaw`
    SELECT ST_X(coordinates) as long, ST_Y(coordinates) as lat FROM "Location" 
      INNER JOIN "Patient" USING (location_id)
      WHERE patient_id = ${Number(patientID)};
      `,
  ]);
  if (!patient) {
    throw { status: 404, message: "Patient not found" };
  }
  return {
    ...patient,
    location: { ...patient.location, coordinates: [coords[0].long, coords[0].lat] },
  };
};

const getClosestCaregivers = async (location_id: string, offset: number = 0) => {
  return await prisma.$transaction(async (prisma) => {
    const caregivers: any[] = await prisma.$queryRaw`
    SELECT 
    "Caregiver".*, 
    place_name, 
      ST_X(coordinates) as long, 
      ST_Y(coordinates) as lat,
      (SELECT coordinates FROM "Location" WHERE location_id = ${location_id}) <-> "Location".coordinates as distance
      FROM "Caregiver" INNER JOIN "Location" USING (location_id)
      ORDER BY distance
      LIMIT 10
      OFFSET ${offset}
      `;
    const availibilities = await Promise.all(
      caregivers.map(({ caregiver_id }) =>
        prisma.availibility.findMany({
          where: {
            caregiver_id,
          },
          include: { term: true },
        })
      )
    );
    for (let i = 0; i < caregivers.length; i++) {
      caregivers[i].availibilities = availibilities[i];
    }
    return caregivers;
  });
};

const getSessions = async (patient_id: string) => {
  return await prisma.session.findMany({
    where: { patient_id: Number(patient_id) },
    include: { caregiver: { include: { user: true } } },
  });
};

const getEmergencyContacts = async (patient_id: string) => {
  return await prisma.contact.findMany({ where: { patient_id: Number(patient_id) } });
};

const update = async (patient_id: string, fields: any) => {
  const { location } = fields;
  delete fields.location;
  const transactions: PrismaPromise<any>[] = [];
  // delete the previous location if necessary
  if (location) {
    transactions.push(createLocation(location));
    fields.location_id = location.location_id;
  }
  transactions.push(
    prisma.patient.update({ where: { patient_id: Number(patient_id) }, data: fields })
  );
  return prisma.$transaction(transactions);
};

const deletePatient = async (patientID: string) => {
  await prisma.patient.delete({ where: { patient_id: Number(patientID) } });
  // should also delete location if necessary
};

const addContacts = async (contacts: Contact[]) => {
  await prisma.contact.createMany({ data: contacts });
};

const assignCaregiver = async (data: Session) => {
  return await prisma.session.create({
    data,
  });
};

const checkEmsoAvailable = async (emso: string) => {
  return await prisma.patient.count({ where: { emso } });
};

// maybe move this later
const getAllSessions = async ({ limit, page, search, from, to }: any) => {
  const additionalParams: any = {};
  if (from || to) {
    additionalParams.start_time = {};
    if (from) additionalParams.start_time.gte = new Date(from);
    if (to) additionalParams.start_time.lte = new Date(to);
  }
  console.log(additionalParams, from, to);
  const [total, sessions] = await prisma.$transaction([
    prisma.session.count({
      where: {
        OR: [
          { patient: { first_name: { contains: search, mode: "insensitive" } } },
          { patient: { last_name: { contains: search, mode: "insensitive" } } },
          { caregiver: { first_name: { contains: search, mode: "insensitive" } } },
          { caregiver: { last_name: { contains: search, mode: "insensitive" } } },
        ],
        ...additionalParams,
      },
    }),
    prisma.session.findMany({
      take: +limit,
      skip: (page - 1) * limit,
      include: { caregiver: true, patient: true },
      where: {
        OR: [
          { patient: { first_name: { contains: search, mode: "insensitive" } } },
          { patient: { last_name: { contains: search, mode: "insensitive" } } },
          { caregiver: { first_name: { contains: search, mode: "insensitive" } } },
          { caregiver: { last_name: { contains: search, mode: "insensitive" } } },
        ],
        ...additionalParams,
      },
    }),
  ]);
  return { total, sessions };
};

const createSession = async (data: {
  notes: string;
  patient_id: number;
  caregiver_id: number;
}) => {
  return await prisma.session.create({ data });
};

const getLocations = async () => {
  return await prisma.$queryRaw`
  SELECT "Patient".patient_id, ST_X(coordinates) AS long, ST_Y(coordinates) AS lat FROM "Patient"
      INNER JOIN "Location" USING (location_id)
  `;
};

// maybe move this to it's own file
const getAllLocations = async () => {
  return await prisma.$queryRaw`
    SELECT "Patient".patient_id, NULL as caregiver_id, ST_X(coordinates) AS long, ST_Y(coordinates) AS lat FROM "Patient"
      INNER JOIN "Location" USING (location_id)
    UNION ALL
    SELECT NULL as patient_id, "Caregiver".caregiver_id, ST_X(coordinates) AS long, ST_Y(coordinates) AS lat FROM "Caregiver"
      INNER JOIN "Location" USING (location_id)
  `;
};

export {
  create,
  getAll,
  get,
  update,
  deletePatient,
  addContacts,
  assignCaregiver,
  getClosestCaregivers,
  getEmergencyContacts,
  checkEmsoAvailable,
  getSessions,
  getAllSessions,
  createSession,
  getAllLocations,
  getLocations,
};
