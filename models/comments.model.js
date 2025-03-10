const db = require("../db/connection");

exports.fetchAllCommentsByArticleId = (article_id) => {
  let queryString = `SELECT * FROM comments WHERE article_id = $1 `;
  const queryValue = [article_id];
  const orderOptions = ["created_at"];
  let order = orderOptions[0];
  queryString += `ORDER BY ${order} DESC`;

  return db.query(queryString, queryValue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No comment Found" });
    }
    return rows;
  });
};
