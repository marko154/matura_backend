import { Prisma } from ".prisma/client";
import { PrismaPromise } from "@prisma/client";
import { prisma } from "../prisma/database";
import { exclude } from "../utils/database.utils";
import {
  AvailibilityFields,
  createAvailibilities,
  createLocation,
} from "./common.service";
import { Caregiver } from "@prisma/client";
import { sendRegistrationInviteEmail } from "../utils/email.utils";
import jwt from "jsonwebtoken";

const create = async (
  userFields: Prisma.UserCreateWithoutUser_typeInput,
  caregiverFields: Caregiver,
  location: Location,
  availibilities: AvailibilityFields[]
) => {
  return await prisma.$transaction(async (prisma) => {
    await createLocation(location, prisma as any);
    const { caregiver } = await prisma.user.create({
      data: {
        ...userFields,
        user_type: {
          connect: { user_type_id: 3 },
        },
        caregiver: {
          create: {
            ...caregiverFields,
            date_of_birth: new Date(caregiverFields.date_of_birth),
            location_id: location.location_id,
          },
        },
      },
      select: {
        caregiver: {
          select: {
            caregiver_id: true,
            user: {
              select: {
                user_id: true,
                email: true,
                email_validated: true,
                user_type_id: true,
              },
            },
          },
        },
      },
    });
    if (!caregiver) {
      throw { message: "Error when creating caregiver" };
    }
    await Promise.all(
      createAvailibilities(caregiver.caregiver_id, availibilities, prisma as any)
    );
    const token = jwt.sign(caregiver.user!, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    sendRegistrationInviteEmail(caregiver.user?.email!, token);
    return { message: "Sucess", caregiver_id: caregiver.caregiver_id };
  });
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

const get = async (caregiverId: string) => {
  const [caregiver, coords] = await prisma.$transaction([
    prisma.caregiver.findUnique({
      where: { caregiver_id: Number(caregiverId) },
      include: { user: true, mentor: true, location: true },
    }),
    prisma.$queryRaw`
    SELECT ST_X(coordinates) as long, ST_Y(coordinates) as lat FROM "Location" 
      INNER JOIN "Caregiver" USING (location_id)
      WHERE caregiver_id = ${Number(caregiverId)};
      `,
  ]);

  if (!caregiver) throw { status: 404, message: "Not found" };
  // fix never type here
  return {
    ...exclude(caregiver, "user.password_hash" as never),
    location: { ...caregiver.location, coordinates: [coords[0].long, coords[0].lat] },
  };
};

const getSessions = async (caregiverId: string) => {
  return await prisma.session.findMany({
    where: { caregiver_id: Number(caregiverId) },
    include: { patient: true },
  });
};

const getAvailibilities = async (caregiverId: string) => {
  return await prisma.term.findMany({
    include: { Availibility: { where: { caregiver_id: Number(caregiverId) } } },
    where: { Availibility: { some: { caregiver_id: Number(caregiverId) } } },
  });
};

const update = async (
  caregiver_id: string,
  fields: {
    caregiver_id?: number;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    phone_number?: string;
    location?: any;
    location_id?: string;
  }
) => {
  const { location } = fields;
  delete fields.location;
  const transactions: PrismaPromise<any>[] = [];
  // delete the previous location if necessary
  if (location) {
    transactions.push(createLocation(location));
    fields.location_id = location.location_id;
  }
  transactions.push(
    prisma.caregiver.update({
      where: { caregiver_id: Number(caregiver_id) },
      data: exclude(fields, "caregiver_id"),
    })
  );
  return prisma.$transaction(transactions);
};

const deleteCaregiver = async (userId: string) => {
  return await prisma.user.delete({ where: { user_id: Number(userId) } });
};

const createAvailibility = async (data: any) => {
  await prisma.term.create({ data });
};

const checkEmsoAvailable = async (emso: string) => {
  return await prisma.caregiver.count({ where: { emso } });
};

export {
  create,
  getAll,
  get,
  getSessions,
  update,
  deleteCaregiver,
  createAvailibility,
  checkEmsoAvailable,
  getAvailibilities,
};
