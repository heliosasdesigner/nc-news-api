const db = require("../db/connection");

exports.fetchAllCommentsByArticleId = (article_id) => {
  let queryString = `SELECT * FROM comments WHERE article_id = $1 `;
  const queryValue = [article_id];
  const orderOptions = ["created_at"];
  let order = orderOptions[0];
  queryString += `ORDER BY ${order} DESC`;

  return db.query(queryString, queryValue).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentByArticleId = (article_id, content) => {
  const { username, body } = content;
  let createDate = new Date();
  let queryString = `
    INSERT INTO comments (article_id, body, votes, author, created_at)
    VALUES ($1, $2, 0, $3, $4)
    RETURNING *;`;
  const queryValue = [article_id, body, username, createDate];
  return db
    .query(queryString, queryValue)
    .then(({ rows }) => {
      return rows[0].body;
    })
    .catch((err) => {
      throw err;
    });
};

exports.removeCommentById = (comment_id) => {
  let queryString = `
    DELETE FROM comments WHERE comment_id = $1
    RETURNING *;`;
  const queryValue = [comment_id];

  return db.query(queryString, queryValue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Comment Not Found" });
    }

    return rows[0];
  });
};
