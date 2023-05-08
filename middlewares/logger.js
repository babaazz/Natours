const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const { v4 } = require("uuid");
const uuid = v4;
const fsPromises = fs.promises;

const logEvents = async (message, logFile) => {
  const time = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${time}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      logItem
    );
  } catch (error) {
    console.log(error.message);
  }
};

const logger = (req, res, next) => {
  const logMessage = `${req.method}\t${req.headers.origin}\t${req.url}`;
  logEvents(logMessage, "reqLog.txt");
  next();
};

module.exports = { logEvents, logger };
