const router = require("express").Router();

const {
  getAllThought,
  createThought,
  getThoughtById,
  updateThought,
  deleteThought,
  createReaction,
  removeReaction,
} = require("../../controllers/thought-controller.js");

router.route("/").get(getAllThought).post(createThought);

router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router
  .route("/:thoughtId/reactions")
  .post(createReaction)
  .delete(removeReaction);

module.exports = router;
