const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotesById,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  console.log(article_id, inc_votes, "<<<< from controller");
  promises = [
    fetchArticleById(article_id),
    updateArticleVotesById(article_id, inc_votes),
  ];
  Promise.all(promises)
    .then(([_, article]) => {
      res.status(202).send({ article });
    })
    .catch((err) => next(err));
};
