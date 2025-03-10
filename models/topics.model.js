const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No Topics Found" });
    }
    return rows;
  });
};
