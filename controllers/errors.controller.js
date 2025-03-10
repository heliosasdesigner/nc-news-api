exports.psqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(404).send({ msg: "Database Error", err });
  }
  next(err);
};

exports.generalError = (err, req, res, next) => {
  //console.log(error, "<<<< error from error controller");
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};
