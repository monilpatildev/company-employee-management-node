import express, { Application, NextFunction, Request, Response } from "express";
import { Server } from "http";
import { config } from "dotenv";
import { rateLimit } from "express-rate-limit";
import path from "path";

import MongoDBConnection from "./config/dbConnection";
import InitialRoute from "./config/routes";
import { ResponseHandler } from "./utils/responseHandler";

config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "4000", 10);
const MONGODB_URI = process.env.MONGODB_URI as string;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message:
    "You cannot make more than 100 requests per minute from the same IP.",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use((err: any, request: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.error("Bad JSON syntax:", err);
    console.log(err);
    
    ResponseHandler.error(res, 400, "Invalid JSON syntax");
  } else {
    next();
  }
});

app.use((error: Error, request: Request, res: Response, next: NextFunction) => {
  console.error("An error occurred:", error);
  ResponseHandler.error(res, 500, error.message);
});

const server: Server = app.listen(PORT, async () => {
  MongoDBConnection.connect(MONGODB_URI);
  InitialRoute.routes(app);
  console.log(`Server running on port ${PORT}`);
});

export default app;
