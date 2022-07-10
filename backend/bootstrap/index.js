const colors = require("colors");
const express = require("express");
const winston = require("winston");
const configurations = require("../config");
const database = require("../database");

const preloader = async () =>
  new Promise((resolve, reject) => {
    console.log(colors.green(`✔︎ Starting in ${process.env.NODE_ENV} Mode`));
    console.log(colors.green("✔︎ Initializing Preloader"));
    resolve();
  });

const initApplication = async () =>
  new Promise((resolve, reject) => {
    console.log(colors.green("✔︎ Initializing Application"));
    const app = express();
    // Set Logger
    app.set(
      "logger",
      winston.createLogger({
        level: "info",
        format: winston.format.json(),
        defaultMeta: {
          service: "application",
          application_start_date_time: new Date(),
        },
        transports: [
          //
          // - Write to all logs with level `info` and below to `combined.log`
          // - Write all logs error (and below) to `error.log`.
          //
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({ filename: "logs/combined.log" }),
        ],
      })
    );
    resolve(app);
  });

const loadConfiguration = async (app) =>
  new Promise((resolve, reject) => {
    console.log(colors.green("✔︎ Configurations Loaded"));
    app.locals.configurations = configurations;
    resolve(app);
  });

const loadDatabase = async (app) =>
  new Promise((resolve, reject) => {
    const logger = app.get("logger");
    database.connect(app.locals.configurations["database"]).then(
      (client) => {
        app.set("database", client);
        console.log(colors.green(`✔︎ MongoDb Connected : ${client.host}`));
        resolve(client);
      },
      (err) => {
        logger.error(err.message);
        console.log(colors.red("X︎ " + err.message));
        reject(err);
      }
    );
  });

const listen = async (app) =>
  new Promise((resolve, reject) => {
    const configurations = app.locals.configurations;
    const PORT = configurations["application"]["port"];
    const logger = app.get("logger");

    app
      .listen(PORT, () => {
        logger.info("Application started on port " + PORT);
        console.log(colors.green("✔︎ Application started on port " + PORT));
        resolve(app);
      })
      .on("error", (err) => {
        logger.error(err.message);
        console.log(colors.red("X︎ " + err.message));
        reject(err);
      });
  });
module.exports = {
  preloader,
  initApplication,
  loadConfiguration,
  loadDatabase,
  listen
};
