const db = require("../db/connection");

exports.fetchUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "No User Found" });
      }
      return rows[0];
    });
};

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
