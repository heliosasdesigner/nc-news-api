const db = require("../db/connection");

exports.fetchAllCommentsByArticleId = (article_id, limit = 5, p = 1) => {
  let queryString = `SELECT comment_id, article_id, author, body, votes, created_at, COUNT(*) OVER()::INT AS total_count FROM comments WHERE article_id = $1 `;
  const queryValue = [article_id];
  const orderOptions = ["created_at"];
  let order = orderOptions[0];
  queryString += `ORDER BY ${order} DESC `;

  limit = parseInt(limit);
  p = parseInt(p);
  let offset = (p - 1) * limit;
  queryValue.push(limit, offset);
  queryString += `LIMIT $${queryValue.length - 1} OFFSET $${queryValue.length}`;

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

exports.updateCommentById = (comment_id, inc_votes) => {
  queryString = `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *`;
  queryValue = [inc_votes, comment_id];
  return db.query(queryString, queryValue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Comment Not Found" });
    }
    return rows[0];
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
