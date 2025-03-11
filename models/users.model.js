const db = require("../db/connection");

exports.fetchUserByUsername = (username) => {
  console.log(username);
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      console.log(rows, "<<<< from authors ");
      return rows[0];
    });
};

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
