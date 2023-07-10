const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all comments
router.get('/', (req, res) => {
    Comment.findAll({})
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

// create a comment
router.post('/', withAuth, (req, res) => {
    // check the session
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            // use the id from the session
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    }
});

// delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => {
            // if no comment found
            if (!dbCommentData) {
                res.status(404).json({ message: 'No comment found with this id' });
                return;
            }
            // otherwise, return the data for the requested comment
            res.json(dbCommentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

module.exports = router;