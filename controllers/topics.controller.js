const { fetchAllTopics, insertTopic } = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.postTopic = (req, res, next) => {
  const content = req.body;
  insertTopic(content)
    .then((topic) => {
      const { slug } = topic;
      res.status(201).send({ topic: { slug } });
    })
    .catch((err) => next(err));
};
