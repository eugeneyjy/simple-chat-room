const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    senderId: { type: mongoose.Types.ObjectId, required: true },
    text: { type: String, required: true },
    timeStamp: { type: Date, required: true }
}, { versionKey: false })

const conversationSchema = new Schema({
    participantIds: { type: [mongoose.Types.ObjectId], validate: v => Array.isArray(v) && v.length >= 2 },
    messages: [messageSchema]
}, { versionKey: false });

module.exports = mongoose.model("Conversation", conversationSchema);
module.exports = mongoose.model("Message", messageSchema);