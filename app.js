const express = require("express");
const app = express();
const cors = require("cors");

const articlesRouter = require("./router/articles.router");
const { getApi } = require("./controllers/api.controller");
const { notFound } = require("./controllers/notfound.controller");
const { psqlError, generalError } = require("./controllers/errors.controller");

const commentsRouter = require("./router/comments.router");
const topicsRouter = require("./router/topics.router");
const usersRouter = require("./router/users.router");

app.use(express.json());
app.use(cors());

app.get("/api", getApi);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.all("*", notFound);

app.use(psqlError);
app.use(generalError);

module.exports = app;
