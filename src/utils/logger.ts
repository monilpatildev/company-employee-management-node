import { createLogger, format, transports, Logger } from "winston";

const logger: Logger = createLogger({
  transports: [
    new transports.File({
      filename: "src/logs/server.log",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${info.timestamp}: ${info.message}`
        )
      ),
    }),
  ],
});


export default logger;
