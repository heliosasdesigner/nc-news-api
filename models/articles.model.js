const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  let queryString = `SELECT a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::INT as comment_count FROM articles AS a LEFT JOIN comments as c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id`;
  const queryValue = [article_id];
  return db.query(queryString, queryValue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No article Found" });
    }
    return rows[0];
  });
};

// a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::INT as comment_count

exports.fetchAllArticles = (topic, sort_by = "created_at", order = "ASC") => {
  let queryValue = [];

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

  let queryString = `
  SELECT
  a.author,
  a.title,
  a.article_id,
  a.topic,
  a.created_at,
  a.votes,
  a.article_img_url,
  COUNT(c.comment_id)::INT as comment_count
  FROM articles AS a LEFT JOIN comments as c
  ON a.article_id = c.article_id `;

  if (topic !== undefined && typeof topic === "string") {
    queryString += `WHERE a.topic = $1 `;
    queryValue.push(topic.toLowerCase());
  }
  queryString += `GROUP BY a.article_id `;

  if (sortedBy === "comment_count") {
    queryString += `ORDER BY ${sortedBy} ${direction}`;
  } else {
    queryString += `ORDER BY a.${sortedBy} ${direction}`;
  }
  return db.query(queryString, queryValue).then(({ rows }) => {
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
