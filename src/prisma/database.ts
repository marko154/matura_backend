import { PrismaClient } from "@prisma/client";

/**
 * - prisma object manages a connection pool
 * - there should only be one instance of PrismaClient in the application,
 *   multiple objects could exaust the database connection limit
 * - more on connection management:
 * https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#optimizing-the-connection-pool
 */

export const prisma = new PrismaClient({
	log:
		process.env.NODE_ENV === "production"
			? []
			: ["query", "info", "warn", "error"],
	errorFormat: "pretty",
});
