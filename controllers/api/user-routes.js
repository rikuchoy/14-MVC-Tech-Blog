const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get all users
router.get('/', (req, res) => {
    //access our User model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData)) //return the data as JSON formatted
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get a single user by id
router.get('/:id', (req, res) => {
    //access our User model and run .findOne() method
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id //use id as the parameter for the request
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at'] //only return these attributes
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post, //include the Post model
                    attributes: ['title'] //only return the title attribute
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Comment,
                as: 'commented_posts'
            }
        ]
    })
        .then(dbUserData => {
            //if no user is found, return an error
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            //otherwise, return the data for the requested user
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create a new user
router.post('/', (req, res) => {
    //access our User model and run .create() method
    User.create({
        username: req.body.username,
        password: req.body.password
    })
        .then(dbUserData => {
            //save user data to session
            req.session.save(() => {
                //declare session variables
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                //return user data and session variables
                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// login route
router.post('/login', (req, res) => {
    //access our User model and run .findOne() method
    User.findOne({
        where: {
            username: req.body.username //use username as the parameter for the request
        }
    }).then(dbUserData => {
        //if no user is found, return an error
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username!' });
            return;
        }

        //otherwise, verify user
        //call the instance method as defined in the User model
        const validPassword = dbUserData.checkPassword(req.body.password);

        //if password is invalid (method returns false), return an error
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        //otherwise, save user data to session and declare session variables
        req.session.save(() => {
            //declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            //return user data and session variables
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// logout route
router.post('/logout', (req, res) => {
    //when the user logs out, the session is destroyed
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            //204 status is that a request has succeeded, but client does not need to go to a different page
            res.status(204).end();
        });
    }
    else {
        //if there is no session, then the logout request will send back a no resource found status
        res.status(404).end();
    }
});

module.exports = router;