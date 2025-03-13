const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  postArticle,
  patchArticleVotesById,
} = require("../controllers/articles.controller");
const {
  getAllCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.get("/", getAllArticles);

// TODO : add the post topic endpoint first, then create the articles before we check the topic, if not exists, create topic
articlesRouter.post("/", postArticle);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.patch("/:article_id", patchArticleVotesById);

articlesRouter.get("/:article_id/comments", getAllCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articlesRouter;
