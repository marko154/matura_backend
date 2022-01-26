# matura-backend

# npm scripts

- `npm start` - starts up the server in development mode
- `npm run lint` - runs tslint checking 
- `npm run prettier` - runs prettier formatting on all files in src directory

# Project structure

- `src`
  - `prisma` - prisma schema, prisma client, database seed
  - `routes` - routers
  - `controllers` - route handlers
  - `services` - business logic (database queries...)
  - `utils` - runs prettier formatting on all files in src directory
- `tests`
  - `unit` - dont know yet  
- `requests` - http requests for development (rest client extension)

# Environment variables
  - `DATABASE_URL`
  - `ACCESS_TOKEN_SECRET`
  - `EMAIL_USER`
  - `EMAIL_PASSWORD`
  - `EMAIL_SERVICE`
