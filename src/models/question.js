const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: false },
    title: { type: String, required: true, max: 100 },
    body: { type: String, required: true, max: 800 },
    vote: { type: Number, required: false, default: 0 },
    answered: { type: Boolean, required: false, default: false },
    subscribed: [{
        userId: { type: String, required: false, unique: true },
        email: { type: String, required: false }
    }],
    timestamps: {
        created_at: { type: Date, default: Date.now(), required: true },
        updated_at: { type: Date, default: Date.now(), required: true }
    }
})

QuestionSchema.methods.upvote = function () {
    return this.vote += 1;
}

QuestionSchema.methods.downvote = function () {
    return this.vote -= 1;
}

QuestionSchema.methods.subscribe = function (user) {
    return this.subscribed.push({
        userId: user.id,
        email: user.email
    })
}

module.exports = mongoose.model('Question', QuestionSchema);