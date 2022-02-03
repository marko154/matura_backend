declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			NODE_ENV: "development" | "production";
			DATABASE_URL: string;
			ACCESS_TOKEN_SECRET: string;
			EMAIL_USER: string;
			EMAIL_PASSWORD: string;
			EMAIL_SERVICE: string;
			SOLID_APP_URL: string;
			MAPBOX_API_KEY: string;
		}
	}

	interface Location {
		location_id: string;
		coordinates: [number, number];
		place_name: string;
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
