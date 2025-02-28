const db = require("../connection");
const createTopicsTable = () => {
  return db.query(
    `CREATE TABLE topics (slug VARCHAR(255) PRIMARY KEY, 
    description VARCHAR(1000), 
    img_url VARCHAR(1000))`
  );
};

const createUsersTable = () => {
  return db.query(
    `CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    avatar_url VARCHAR(1000))`
  );
};

const createArticlesTable = () => {
  return db.query(
    `CREATE TABLE articles (article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) NOT NULL,
      CONSTRAINT fk_topic FOREIGN KEY(topic) REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR(255) NOT NULL,
      CONSTRAINT fk_author FOREIGN KEY(author) REFERENCES users(username) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at timestamp NOT NULL,
      votes INT NOT NULL DEFAULT 0,
      article_img_url VARCHAR(1000)
      )`
  );
};

const createCommentsTable = () => {
  return db.query(
    `CREATE TABLE comments (comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL,
      CONSTRAINT fk_article FOREIGN KEY(article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      votes INT NOT NULL DEFAULT 0,
      author VARCHAR(255) NOT NULL,
      CONSTRAINT fk_author FOREIGN KEY(author) REFERENCES users(username) ON DELETE CASCADE,
      created_at timestamp NOT NULL
      )`
  );
};

module.exports = {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
};
