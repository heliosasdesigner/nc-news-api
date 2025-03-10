const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controller");
const { getAlltopics } = require("./controllers/topics.controller");
const { notFound } = require("./controllers/notfound.controller");
const { psqlError, generalError } = require("./controllers/errors.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAlltopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", notFound);

app.use(psqlError);
app.use(generalError);

module.exports = app;
