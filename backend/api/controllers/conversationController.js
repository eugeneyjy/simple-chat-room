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
    console.log(validMessage);
    const error = validMessage.validateSync();
    if(error) {
        console.log(error);
        throw ValidationError.SchemaError;
    }
    if(userId !== validMessage.senderId.toString()) {
        throw ValidationError.ForbidenActionError;
    }
    const conversation = await Conversation.findById(conversationId);
    // Make sure senderId is one of the participantId
    if(conversation.participantIds.includes(validMessage.senderId)) {
        conversation.messages.push(validMessage);
        await conversation.save();
        return validMessage;
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
            lastMessage:{$last: "$messages"},
            otherParticipants: 1,
          }
        }
    ]);
    return conversations;
}

exports.getConversationById = async function(id) {
    const conversation = await Conversation.aggregate([
        { $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        { $lookup: {
            from: "users",
            localField: "participantIds",
            foreignField: "_id",
            pipeline: [
                { $project: { password: 0 } }
            ],
            as: "participants"
          }
        }
    ]);
    return conversation;
}