const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    body: { type: String, required: true, max: 800 },
    timestamps: {
        created_at: { type: Date, default: Date.now(), required: true },
        updated_at: { type: Date, default: Date.now(), required: true }
    }
})

module.exports = mongoose.model('Answer', AnswerSchema);