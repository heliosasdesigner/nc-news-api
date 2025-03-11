const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "No article Found" });
      }
      return rows[0];
    });
};

exports.fetchAllArticles = (sort_by = "created_at", order = "ASC") => {
  const orderOptions = [
    "created_at",
    "author",
    "title",
    "topic",
    "votes",
    "comment_count",
  ];
  let sortedBy = orderOptions.includes(sort_by) ? sort_by : "created_at";

  const orderDirectionOption = ["ASC", "DESC"];
  let direction = orderDirectionOption.includes(order.toUpperCase(order))
    ? order.toUpperCase(order)
    : "ASC";

  let queryString = `SELECT a.author, a.title, a.article_id,a.topic,a.created_at,a.votes,a.article_img_url,count(c.comment_id)::INT as comment_count FROM articles AS a JOIN comments as c ON a.article_id = c.article_id GROUP BY a.author, a.title, a.article_id,a.topic,a.created_at,a.votes,a.article_img_url `;

  if (sortedBy === "comment_count") {
    queryString += `ORDER BY ${sortedBy} ${direction}`;
  } else {
    queryString += `ORDER BY a.${sortedBy} ${direction}`;
  }
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  queryString = `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`;
  queryValue = [inc_votes, article_id];
  return db
    .query(queryString, queryValue)
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      throw err;
    });
};
