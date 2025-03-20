import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { configDotenv } from "dotenv";

configDotenv();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Listenme API Documentation",
    version: "1.0.0",
    description: "This is the API documentation for my project",
  },
  component:{
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ["./routes/*.ts"], // Make sure this matches your route folder
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`✅ Swagger docs available at http://localhost:${process.env.PORT}/api-docs`);

};
