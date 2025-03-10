const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const { notFound } = require("./controllers/notfound.controller");
const { psqlError, generalError } = require("./controllers/errors.controller");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controller");
const {
  getAllCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", notFound);

app.use(psqlError);
app.use(generalError);

module.exports = app;
