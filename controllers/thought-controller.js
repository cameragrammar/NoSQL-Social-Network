const { User, Thought } = require("../models");

const thoughtController = {
  //Get All Thoughts
  getAllThought(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(400).json(err));
  },

  //Get One Thought (ID)
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought with this ID." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  //Create a New Thought
  createThought(req, res) {
    const reaction = req.body.reaction
      ? {
          reactionBody: req.body.reactionBody,
          username: req.body.reaction.username,
        }
      : undefined;
    if (reaction) {
      req.body.reaction = [reaction];
    }

    User.findById(req.body.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        return Thought.create(req.body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res
                .status(404)
                .json({ message: "Thought created but no user with this id!" });
            }

            res.json({ message: "Thought created!" });
          })
          .catch((err) => res.json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

  //Update a Thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought with this id." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //Delete a Thought (ID)
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No user found with this id." });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.Id } },
          { new: true }
        );
      })
      .catch((err) => res.status(500).json(err));
  },

  //Add a Reaction
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought with this id." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //Delete a Reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
