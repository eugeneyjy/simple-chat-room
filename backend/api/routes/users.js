const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { createUser, getUserByUsername } = require('../controllers/userController');

exports.router = router;

function isCredentialFieldsExist(body) {
    if(body && body.username && body.password) {
        return true;
    } else {
        return false;
    }
}

router.post('/', async function(req, res, next) {
    try {
        const user = req.body;
        const newUser = await createUser(user);
        // Successfully created a user
        res.status(201).json({
            id: newUser._id
        });
    } catch(err) {
        if(err.name === 'ValidationError') {
            // Request body doesn't match User schema
            res.status(400).send({
                error: "Request body is not a valid User object"
            });
        } else if(err.name === 'MongoServerError') {
            // Return error for duplicated username on creation
            if(err.keyPattern['username'] === 1) {
                res.status(403).send({
                    error: "Username already exists",
                });
            // Return error for duplicated email on creation
            } else if(err.keyPattern['email'] === 1) {
                res.status(403).send({
                    error: "Email already used",
                });
            } else {
                next();
            }
        } else {
            next();
        }
    }
});

router.post('/login', async function(req, res, next) {
    const credentials = req.body
    if(isCredentialFieldsExist(credentials)) {
            const user = await getUserByUsername(credentials.username, true);
            // Check if user with the specific username exists
            // geteUserByUsername will return null if user with the specific username doesn't exist
            // If it does, check if password entered correctly
            const authenticated = user && await bcrypt.compare(credentials.password, user.password);
            if(authenticated) {
                res.status(200).send({});
            // Return error when user entered wrong password
            } else {
                res.status(401).send({
                    error: "Invalid credentials"
                });
            }
    } else {
        res.status(400).send({
            error: "Request body must include username and password"
        });
    }
});