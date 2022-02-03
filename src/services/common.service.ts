import { prisma } from "../prisma/database";

const createLocation = (location: Location) => {
	const [lat, long] = location.coordinates;
	return prisma.$executeRaw`
		INSERT INTO "Location" 
			(location_id, coordinates, place_name)
			VALUES (
				${location.location_id},
				point(${lat}, ${long}),
				${location.place_name}
			)
	`;
};

// deletes a location if it doesn't have any children
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

export { createLocation, deleteLocationIfNoChild };
