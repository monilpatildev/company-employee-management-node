import express, { Application, NextFunction, Request, Response } from "express";
import { Server } from "http";
import { config } from "dotenv";
import MongoDBConnection from "./config/dbConnection";
import InitialRoute from "./config/routes";
import { ResponseHandler } from "./utils/responseHandler";
import path from "path";
import { rateLimit } from "express-rate-limit";
config();

const app: Application = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: "You can not make 100+ request from same IP, try again after 1 min.",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

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
