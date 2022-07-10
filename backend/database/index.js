// const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

module.exports.connect = async (databaseConfig) =>
  new Promise((resolve, reject) => {
    // MongoClient.connect(databaseConfig.uri, { useUnifiedTopology: true })
    //   .then((client) => {
    //     const db = client.db(databaseConfig.db);
    //     resolve(db);
    //   })
    mongoose
      .connect(databaseConfig.uri, { useUnifiedTopology: true })
      .then((conn) => {
        resolve(conn.connection);
      })
      .catch((error) => {
        reject(error);
      });
  });
