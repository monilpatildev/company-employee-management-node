import { Application, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import log from "./logger";
import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "REST API Docs",
      version,
    },
  },
  servers: ["http://localhost:3001"],
  apis: ["./src/config/routes.ts", "./src/components/*/**.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
