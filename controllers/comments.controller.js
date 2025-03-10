const { fetchArticleById } = require("../models/articles.model");
const {
  fetchAllCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments.model");
const { getUsernameByUsername } = require("./authors.controller");

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    fetchAllCommentsByArticleId(article_id),
    fetchArticleById(article_id),
  ];
  Promise.all(promises)
    .then(([comments, _]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const content = req.body;
  const promises = [
    insertCommentByArticleId(article_id, content),
    fetchArticleById(article_id),
  ];
  Promise.all(promises)
    .then(([comment, _]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
