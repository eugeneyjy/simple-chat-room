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

exports.getConversationsByUserId = async function(userId) {
    const castedUserId = new mongoose.Types.ObjectId(userId);
    const conversations = await Conversation.aggregate([
        { $match: {
            participantIds: castedUserId
          }
        },
        { $lookup: {
            from: "users",
            let: { participants: "$participantIds" },
            pipeline: [
                { $match:
                    { $expr:
                        { $and:
                            [
                                { $in: ["$_id", "$$participants"] },
                                { $ne: ["$_id", castedUserId] }
                            ]
                        }
                    }
                },
                { $project: { password: 0, email: 0 } }
            ],
            as: "otherParticipants"
          }
        },
        { $project: {
            name: 1,
            lastMessage:{$first: "$messages"},
            otherParticipants: 1
          }
        }
    ]);
    return conversations;
}