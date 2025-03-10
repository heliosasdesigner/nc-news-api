const endpoints = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  try {
    if (!endpoints) {
      throw new Error("Endpoints not found");
    }
    res.status(200).send({ endpoints });
  } catch (e) {
    next(e);
  }
};
