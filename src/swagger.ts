import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Matura API",
      description: "",
      version: "1.0.0",
      license: {
        name: "Apachi 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
      contact: {
        name: "Marko Gartnar",
        email: "marko.gartnar777@gmail.com",
      },
      termsOfService: "http://example.com/terms/",
    },
  },
  apis: ["**/*.yaml", "src/prisma/swagger.types.yaml"], // files containing annotations as above
};

const openapiSpecification = swaggerJSDoc(options);

export const openapidocs = (app: Express) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

  // Make our docs in JSON format available
  app.get("/api/v1/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    // res.setHeader("Content-Type", "text/html");
    res.send(openapiSpecification);
  });
};
