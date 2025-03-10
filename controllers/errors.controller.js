exports.psqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err, "<<<<< error");
    res.status(400).send({ msg: "Database request failed" });
  }
  next(err);
};

exports.generalError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};
