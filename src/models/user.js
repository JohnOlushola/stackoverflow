require('dotenv').config();
const mongoose = require('mongoose');
const sha256 = require('sha256')
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: { type: String, required: true, max: 100 },
    lastname: { type: String, required: true, max: 100 },
    email: { type: String, unique: true, required: true, max: 100 },
    password: { type: String, required: true, max: 50 },
    reputation: { type: Number, default: 15 },
    questionsSubscribed: [{
        questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
        answered: { type: Boolean, default: false },
    }],
    timestamps: {
        created_at: { type: Date, default: Date.now(), required: true },
        updated_at: { type: Date, default: Date.now(), required: true }
    }
});

UserSchema.pre('save', function (next) {
    this.password = sha256(this.password);
    next();
}, (err) => {
    return next(err);
});

UserSchema.methods.validatePassword = function (password) {
    return sha256(password) === this.password;
};

UserSchema.methods.generateJWT = function () {
    return jwt.sign({
        email: this.email,
        id: this._id,
        expiresIn: '1d',
    }, process.env.JWT_TOKEN_SECRET)
}

UserSchema.methods.increaseReputation = function (value) {
    return this.reputation += value;
}

UserSchema.methods.decreaseReputation = function (value) {
    return this.reputation -= value;
}

module.exports = mongoose.model('User', UserSchema)