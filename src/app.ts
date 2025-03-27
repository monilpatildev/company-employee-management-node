import express, { Application, NextFunction, Request, Response } from "express";
import { Server } from "http";
import { config } from "dotenv";
import MongoDBConnection from "./config/dbConnection";
import InitialRoute from "./config/routes";
import { ResponseHandler } from "./utils/responseHandler";
config();

const app: Application = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error) {
      ResponseHandler.error(response, 500, error.message);
    } else {
      next();
    }
  }
);

const server: Server = app.listen(PORT, () => {
  InitialRoute.routes(app);
  MongoDBConnection.connect(`${MONGODB_URI}`);
  console.log(`Server running on ${PORT}`);
});
