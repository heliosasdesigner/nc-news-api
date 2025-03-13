const { fetchArticleById } = require("../models/articles.model");
const {
  fetchAllCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments.model");

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const promises = [
    fetchAllCommentsByArticleId(article_id, limit, p),
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

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.status(202).send({ comment });
    })
    .catch((err) => next(err));
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
