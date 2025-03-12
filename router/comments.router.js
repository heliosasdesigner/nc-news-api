const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.controller");

commentsRouter.patch("/:comment_id", patchCommentById);

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
