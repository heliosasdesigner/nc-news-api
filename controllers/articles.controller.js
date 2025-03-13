const {
  insertArticle,
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotesById,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;

  fetchAllArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const content = req.body;

  promises = [insertArticle(content)];
  Promise.all(promises)
    .then(([article]) => {
      const { article_id, votes, created_at, comment_count } = article;
      res
        .status(201)
        .send({ article: { article_id, votes, created_at, comment_count: 0 } });
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
