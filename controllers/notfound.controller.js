exports.notFound = (req, res, next) => {
  res.status(404).send({ msg: "Page Not Found" });
};
