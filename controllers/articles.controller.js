const {
  insertArticle,
  fetchArticleById,
  fetchAllArticles,
  removeArticleById,
  updateArticleVotesById,
} = require("../models/articles.model");
const { fetchTopicBySlug, insertTopic } = require("../models/topics.model");

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;

  fetchAllArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body, article_img_url } = req.body;

  fetchTopicBySlug(topic)
    .then((topicData) => {
      let promises;

      if (topic !== undefined && topicData.length === 0) {
        const topicObj = { slug: topic, description: "" };

        return insertTopic(topicObj).then((data) => {
          //console.log(`New topic created: ${data.slug}`);
          return insertArticle(
            title,
            topic,
            author,
            body,
            article_img_url
          ).then((article) => [article, null]);
        });
      } else {
        promises = [
          insertArticle(title, topic, author, body, article_img_url),
          fetchTopicBySlug(topic),
        ];
        return Promise.all(promises);
      }
    })
    .then(([article, _]) => {
      const { article_id, votes, created_at } = article;
      res.status(201).send({
        article: { article_id, votes, created_at, comment_count: 0 },
      });
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

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
