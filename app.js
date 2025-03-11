const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const { notFound } = require("./controllers/notfound.controller");
const { psqlError, generalError } = require("./controllers/errors.controller");
const {
  getArticleById,
  getAllArticles,
  patchArticleVotesById,
} = require("./controllers/articles.controller");
const {
  getAllCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controller");
const { getAllUsers } = require("./controllers/users.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

// /api/articles
app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleVotesById);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// /api/comments
app.delete("/api/comments/:comment_id", deleteCommentById);

// /api/users
app.get("/api/users", getAllUsers);

app.all("*", notFound);

app.use(psqlError);
app.use(generalError);

module.exports = app;
