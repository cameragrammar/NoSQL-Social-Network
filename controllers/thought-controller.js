const { Thought, User } = require("../models");

const thoughtController = {

    //Get One Thought (ID)
    getThoughtById({params}, res) {
        Thought.findOne({
            _id: params.id
        })
        .select('-__v')
        .sort({
            _id: -1
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought found by ID"
                });
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Get All Thoughts
    getAllThought(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('__v')
            .sort({ _id: -1})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    

    //Create a New Thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({_id }) => {
                return User.findOneAndUpdate(
                {
                    _id: body.userId 
                },
                { 
                    $push: { thoughts: _id } 
                },
                { 
                    new: true 
                }
                );      
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res
                        .status(404)
                        .json({message: "Thought created but no user with this id!"});
                }

                res.json({message: "Thought created!"});
            })
            .catch((err) => res.json(err));
    },

    //Update a Thought
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({message: "No thought with this id." });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err));
    },

    //Delete a Thought (ID)
    deleteThought({ params }, res) {
        Thought.findoneAndDelete({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({message: "No user found with this id." });
                    return;
                }
                return User.findOneAndUpdate(
                    {
                        _id: params.userId
                    },
                    {
                        $pull: { thoughts: params.Id }
                    },
                    {
                        new: true
                    }
                )
            })
            .catch(err => res.json(err));
    },

    //Add a Reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            {
                _id: req.params.thoughtId
            },
            {
                $addToSet: { reactions: req.body }
            },
            {
                new: true, runValidators: true 
            }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({message: "No thought with this id."});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err));    
    },

    //Delete a Reaction
    removeReaction({ params}, res) {
        Thought.findOneAndUpdate(
            { 
                _id: params.thoughtId 
            },
            {
                $pull: {reactions: {reactionId: params.reactionId } }
            },
            {
                new: true 
            }
        )
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;