const router = require('express').Router();

const { requireAuthentication } = require('../../utils/auth');
const { ValidationError } = require('../../utils/validation');
const { createConversation, sendMessage } = require('../controllers/conversationController');

exports.router = router;

router.post('/', requireAuthentication, async function(req, res, next) {
    try {
        const conversation = req.body;
        const newConversation = await createConversation(conversation);
        // Successfully created a conversation
        res.status(201).send({
            id: newConversation._id
        });
    } catch(err) {
        if(err.name === 'ValidationError') {
            // Request body doesn't match Conversation schema
            res.status(400).send({
                error: "Request body is not a valid Conversation object"
            });
        } else {
            console.log(err);
            next();
        }
    }
});

router.post('/:conversationId/messages', requireAuthentication, async function(req, res, next) {
    try {
        const conversationId = req.params.conversationId;
        const message = req.body;
        const conversation = await sendMessage(req.userId, conversationId, message);
        console.log(conversation);
        res.status(200).send({success: "Message sent"});
    } catch(err) {
        if(err === ValidationError.SchemaError) {
            // Request body doesn't match Message schema
            res.status(400).send({
                error: "Request body is not a valid Message object"
            });
        } else if(err === ValidationError.ForbidenActionError) {
            // SenderId is not in conversation participantIds
            // OR SenderId is not the same as logged in userId
            res.status(403).send({
                error: "User is forbiden to send message here"
            });
        } else {
            console.log(err);
            next();
        }
    }
});