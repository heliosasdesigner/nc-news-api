const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");
const {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
} = require("../seeds/seeding-func");
const seed = ({ topicData, userData, articleData, commentData }) => {
  return db

    .query("DROP TABLE IF EXISTS comments;")
    .catch((err) => {
      console.error("Error dropping comments:", err);
      throw err;
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .catch((err) => {
      console.error("Error dropping articles:", err);
      throw err;
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return createTopicsTable();
    })
    .then(() => {
      return createUsersTable();
    })
    .then(() => {
      return createArticlesTable();
    })
    .then(() => {
      return createCommentsTable();
    })
    .then(() => {
      return insertTopicsData(topicData);
    })
    .then(() => {
      return insertUSersData(userData);
    })
    .then(() => {
      return insertArticlesData(articleData);
    })
    .then(() => {
      return insertCommentsData(commentData);
    });
};
module.exports = seed;

const insertTopicsData = async (topicData) => {
  //console.log(topicData, "<<<<");
  const formattedString = topicData.map((obj) => Object.values(obj));
  //console.log(formattedString, "<<<< formattedString");
  const sqlQuery = format(
    "INSERT INTO topics (description, slug,  img_url) VALUES %L RETURNING *;",
    formattedString
  );
  //console.log(sqlQuery, "<<<<<< sqlQuery");
  return await db.query(sqlQuery);
};

const insertUSersData = async (userData) => {
  //console.log(userData, "<<<<");
  const formattedString = userData.map((obj) => Object.values(obj));
  //console.log(formattedString, "<<<< formattedString");
  const sqlQuery = format(
    "INSERT INTO users (username, name,  avatar_url) VALUES %L RETURNING *;",
    formattedString
  );
  //console.log(sqlQuery, "<<<<<< sqlQuery");
  return await db.query(sqlQuery);
};

const insertArticlesData = async (articleData) => {
  //console.log(articleData, "<<<<");
  const formattedValue = articleData.map(
    ({ title, topic, author, body, created_at, article_img_url }) => [
      title,
      topic,
      author,
      body,
      convertTimestampToDate({ created_at }).created_at,
      article_img_url,
    ]
  );
  //console.log(formattedValue, "<<<< formattedString");
  const authorsList = articleData.map(({ author }) => author);
  //console.log(authorsList, " <<<< authorlist");
  const topicsList = articleData.map(({ topic }) => topic);
  //console.log(topicsList, " <<<< topiclist");
  const sqlQuery = format(
    // `WITH all_authors AS (SELECT * from authors)), all_topics AS (SELECT * FROM topics)
    // INSERT INTO articles (title, topic, author, body, created_at, article_img_url)
    // SELECT title, t.slug, a.username, body, created_at, article_img_url
    // FROM (VALUES %L )
    // AS new_articles(title, topic, author,  body, created_at, article_img_url)
    // JOIN all_authors a ON new_articles.author = a.username
    // JOIN all_topics t ON new_articles.topic = t.slug
    // RETURNING *`
    `
    WITH all_authors AS (
      SELECT username FROM users WHERE username IN (%L)
      ),
      all_topics AS (
          SELECT slug FROM topics WHERE slug IN (%L)
      )
      INSERT INTO articles (title, topic, author, body, created_at, article_img_url)
      SELECT title, t.slug, a.username, body, created_at::TIMESTAMP, article_img_url
      FROM (VALUES %L)
      AS new_articles(title, topic, author, body, created_at, article_img_url)
      JOIN all_authors a ON new_articles.author = a.username
      JOIN all_topics t ON new_articles.topic = t.slug
      RETURNING *;`,
    authorsList,
    topicsList,
    formattedValue
  );
  //console.log(sqlQuery, "<<<<<< sqlQuery");
  return await db.query(sqlQuery);
};

const insertCommentsData = async (commentData) => {
  //console.log(commentData, "<<<<");
  const formattedValue = commentData.map(
    ({ article_title, body, votes, author, created_at }) => [
      article_title,
      body,
      votes,
      author,
      convertTimestampToDate({ created_at }).created_at,
    ]
  );
  //console.log(formattedValue, "<<<< formattedString");
  const authorsList = commentData.map(({ author }) => author);
  //console.log(authorsList, " <<<< authorlist");
  const articleTitleList = commentData.map(
    ({ article_title }) => article_title
  );
  //console.log(articleTitleList, " <<<< articleTitleList");
  const sqlQuery = format(
    `
    WITH
    all_authors AS (
    SELECT username FROM users WHERE username IN (%L)
    ),
    all_articles AS (
    SELECT title, article_id FROM articles WHERE title IN (%L)
    )
    INSERT INTO comments (article_id, body, votes, author, created_at)
    SELECT b.article_id, body, votes::INT, a.username, created_at::TIMESTAMP 
    FROM (VALUES %L)
    AS new_comments(article_title, body, votes, author, created_at)
    JOIN all_authors a ON new_comments.author = a.username
    JOIN all_articles b ON new_comments.article_title = b.title
    RETURNING *;`,
    authorsList,
    articleTitleList,
    formattedValue
  );
  //console.log(sqlQuery, "<<<<<< sqlQuery");
  return await db.query(sqlQuery);
};
