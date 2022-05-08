const mongoose = require('mongoose');
const { ValidationError } = require('../../utils/validation');
const Conversation = mongoose.model('Conversation');
const Message = mongoose.model('Message');

exports.createConversation = async function(conversation) {
    const newConversation = await Conversation.create(conversation);
    return newConversation;
}

exports.sendMessage = async function(userId, conversationId, message) {
    const validMessage = new Message(message);
    const error = validMessage.validateSync();
    if(error) {
        throw ValidationError.SchemaError;
    }
    if(userId !== message.senderId) {
        throw ValidationError.ForbidenActionError;
    }
    const conversation = await Conversation.findById(conversationId);
    // Make sure senderId is one of the participantId
    if(conversation.participantIds.includes(message.senderId)) {
        conversation.messages.push(message);
        await conversation.save();
        return conversation;
    } else {
        throw ValidationError.ForbidenActionError;
    }
}