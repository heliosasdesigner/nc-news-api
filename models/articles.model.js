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

exports.insertArticle = (title, topic, author, body, article_img_url) => {
  let createDate = new Date();
  let queryString = `
    INSERT INTO articles (title, topic, author, body, created_at,votes,article_img_url)
    VALUES ($1, $2, (SELECT username FROM users WHERE name = $3), $4, $5, 0, $6 )
    RETURNING *;`;

  const queryValue = [title, topic, author, body, createDate, article_img_url];
  return db
    .query(queryString, queryValue)
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchAllArticles = (
  topic,
  sort_by = "created_at",
  order = "ASC",
  limit = 10,
  p = 1
) => {
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
  COUNT(*) OVER()::INT AS total_count, 
  COUNT(c.comment_id)::INT as comment_count
  FROM articles AS a LEFT JOIN comments as c
  ON a.article_id = c.article_id `;

  if (topic !== undefined && typeof topic === "string") {
    queryString += `WHERE a.topic = $1 `;
    queryValue.push(topic.toLowerCase());
  }
  queryString += `GROUP BY a.article_id `;

  if (sortedBy === "comment_count") {
    queryString += `ORDER BY ${sortedBy} ${direction} `;
  } else {
    queryString += `ORDER BY a.${sortedBy} ${direction} `;
  }

  limit = parseInt(limit);
  p = parseInt(p);
  let offset = (p - 1) * limit;
  queryValue.push(limit, offset);
  queryString += `LIMIT $${queryValue.length - 1} OFFSET $${queryValue.length}`;

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

exports.removeArticleById = (article_id) => {
  let queryString = `
    DELETE FROM articles WHERE article_id = $1
    RETURNING *;`;
  const queryValue = [article_id];

  return db.query(queryString, queryValue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    }

    return rows[0];
  });
};
