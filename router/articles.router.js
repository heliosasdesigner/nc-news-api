const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticleVotesById,
} = require("../controllers/articles.controller");
const {
  getAllCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.patch("/:article_id", patchArticleVotesById);

articlesRouter.get("/:article_id/comments", getAllCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articlesRouter;
