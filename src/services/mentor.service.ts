import { Prisma } from ".prisma/client";
import { prisma } from "../prisma/database";
import { exclude } from "../utils/database.utils";
import { sendRegistrationInviteEmail } from "../utils/email.utils";
import jwt from "jsonwebtoken";

const create = async (
  userFields: Prisma.UserCreateWithoutUser_typeInput,
  mentorFields: Omit<Prisma.MentorCreateWithoutUserInput, "Caregiver">
) => {
  const user = await prisma.user.create({
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
    select: {
      mentor: {
        select: {
          mentor_id: true,
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
  const token = jwt.sign(user.mentor!.user!, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  sendRegistrationInviteEmail(userFields.email, token);
  return user;
};

const getAll = async ({ limit, page, search }: any) => {
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
      where: {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          {
            user: {
              email: { contains: search, mode: "insensitive" },
            },
          },
        ],
      },
    }),
  ]);
  return { total, mentors };
};

const get = async (mentorId: string) => {
  const mentor = await prisma.mentor.findUnique({
    where: { mentor_id: Number(mentorId) },
    include: { user: true },
  });
  // fix never type here
  return exclude(mentor, "user.password_hash" as never);
};

const getCaregivers = async (id: string) => {
  return await prisma.caregiver.findMany({
    where: { mentor_id: Number(id) },
    include: { user: true },
  });
};

// caregivers that are not assigned or are assigned to another mentor
const getAssignableCaregivers = async (query: {
  id: string;
  type: "all" | "unassigned";
  search: string;
  skip: number;
  take: number;
}) => {
  return await prisma.caregiver.findMany({
    where: {
      mentor_id: query.type === "all" ? { not: Number(query.id) } : null,
      OR: [
        {
          user: {
            email: { contains: query.search, mode: "insensitive" },
          },
        },
        { first_name: { contains: query.search, mode: "insensitive" } },
        { last_name: { contains: query.search, mode: "insensitive" } },
      ],
    },
    include: { user: true },
    skip: Number(query.skip),
    take: Number(query.take),
  });
};

const assignCaregivers = async (id: string, data: { caregivers: number[] }) => {
  return await prisma.$transaction(
    data.caregivers.map((caregiver_id) =>
      prisma.caregiver.update({
        where: { caregiver_id },
        data: { mentor_id: Number(id) },
      })
    )
  );
};

const unassignCaregivers = async (id: string, data: { caregivers: number[] }) => {
  return await prisma.$transaction(
    data.caregivers.map((caregiver_id) =>
      prisma.caregiver.update({
        where: { caregiver_id },
        data: { mentor_id: null },
      })
    )
  );
};

// mentor record gets deleted due to onDelete cascade option
const deleteMentor = async (userId: string) => {
  await prisma.user.delete({ where: { user_id: Number(userId) } });
};

const update = async (data: {
  mentor_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
}) => {
  await prisma.mentor.update({
    where: { mentor_id: data.mentor_id },
    data: exclude(data, "mentor_id"),
  });
};

export {
  create,
  getAll,
  get,
  deleteMentor,
  update,
  getCaregivers,
  getAssignableCaregivers,
  assignCaregivers,
  unassignCaregivers,
};
