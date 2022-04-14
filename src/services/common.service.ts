import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/database";

const createLocation = (location: Location, _prisma: PrismaClient = prisma) => {
  const [lat, long] = location.coordinates;
  return _prisma.$executeRaw`
		INSERT INTO "Location" 
			(location_id, coordinates, place_name)
			VALUES (
				${location.location_id},
				ST_SetSRID(ST_MakePoint(${lat}, ${long}), 4326),
				${location.place_name}
			)
	`;
};

// deletes a location if it no one is connected to it
const deleteLocationIfNoChild = (location: Location) => {
  return prisma.$executeRaw`
		DELETE FROM "Location"
			WHERE
			NOT EXISTS(
                SELECT 1 FROM "Patient" p
                    WHERE p.location_id = ${location.location_id}
                )
            AND NOT EXISTS(
                SELECT 1 FROM "Caregiver" c
                    WHERE c.location_id = ${location.location_id}
            )
	`;
};

export type AvailibilityFields = {
  start_date: string;
  end_date: null | string;
  repeats: number;
  days: {
    times: { from: string; to: string }[];
  }[];
};

const createAvailibilities = (
  caregiver_id: number,
  availibilities: AvailibilityFields[],
  _prisma: PrismaClient = prisma
) => {
  return availibilities.map(({ days, end_date, start_date }) => {
    const data: Prisma.AvailibilityCreateManyTermInput[] = [];
    let i = 0;
    for (const day of days) {
      for (const time of day.times) {
        data.push({
          caregiver_id,
          day_of_week: i++,
          start_time: new Date(`1.1.1970 ${time.from}`),
          end_time: new Date(`1.1.1970 ${time.to}`),
        });
      }
    }
    return _prisma.term.create({
      data: {
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : end_date,
        Availibility: { createMany: { data, skipDuplicates: true } },
      },
    });
  });
};

export { createLocation, deleteLocationIfNoChild, createAvailibilities };
