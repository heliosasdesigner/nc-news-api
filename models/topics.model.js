const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchTopicBySlug = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertTopic = (content) => {
  const { slug, description } = content;
  const img_url = "";
  let queryString = `
    INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3) RETURNING *`;

  const queryValue = [slug, description, img_url];
  return db
    .query(queryString, queryValue)
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      throw err;
    });
};
