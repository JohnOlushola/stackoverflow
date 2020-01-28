const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

class QuestionController {
    // retrieve question
    index(req, res) {
        let id = req.params.id;
        Question.findById(id, (err, question) => {
            if (err) {
                res.send(404).json({
                    error: {
                        message: "Question not found"
                    }
                });
            }

            res.status(200).send(question);
        });
    }

    // create question
    store(req, res) {
        let {
            title,
            body
        } = req.body;
        let user = {
            id: req.user.id,
            email: req.user.email
        };

        Question.create({
            userId: user.id,
            title: title,
            body: body
        }).then((question) => {
            question.subscribe(user);
            question.save();

            User.findById(user.id, (err, user) => {
                user.questionsSubscribed.push({
                    questionId: question.id
                })
                user.save();
            })
            res.status(201).send(question);
        });
    }

    // get all questions
    getQuestions(req, res) {
        let {
            limit
        } = req.query;

        Question.find()
            .limit(parseInt(limit) || 10)
            .exec((err, questions) => {
                if (err) {
                    return res.status(500);
                }

                if (!questions) {
                    return res.status(404).json({
                        error: {
                            message: "No question found"
                        }
                    });
                }

                res.status(200).send(questions);
            });
    }

    // delete question
    delete(req, res) {
        let id = req.params.id;
        Question.findByIdAndDelete(id, (err, question) => {
            if (err) {
                return res.status(400).json({
                    message: {
                        error: "Could not delete question " + id,

                        err: err
                    }
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: {
                        error: "Question could not be found"
                    }
                });
            }

            res.status(200).end();
        });
    }

    // upvote question
    upvote(req, res) {
        let {
            id
        } = req.params;
        Question.findById(id, async (err, question) => {
            if(err){
                res.status(500)
            }
            if(!question){
                res.status(404).json({
                    error: {
                        message: "Question not found"
                    }
                })
            }
            question.upvote();
            question.save();

            // increase question owner reputation
            User.findById(question.userId, (err, user) => {
                user.increaseReputation(15);
                user.save();
            });
            res.status(200).send({vote: question.vote});
        });
    }

    // downvote question
    downvote(req, res) {
        let {
            id
        } = req.params;
        Question.findById(id, async (err, question) => {
            if(err){
                res.status(500)
            }
            question.downvote();
            question.save();

            // decrease question owner reputation
            User.findById(question.userId, (err, user) => {
                user.decreaseReputation(2);
                user.save();
            });
            res.status(200).send({vote: question.vote});
        });
    }

    // subscribe a user
    subscribe(req, res) {
        // Default: User that asked question is subscribed
        let user = {
            id: req.user.id,
            email: req.user.email
        };
        let {
            id
        } = req.params;

        // find question
        Question.findById(id, (err, question) => {
            if (err) {
                res.status(500).json({
                    error: {
                        message: err.message
                    }
                });
            }
            if (question) {
                // check if question has been subscribed to by any user
                for (let x = 0; x < question.subscribed.length; x++) {
                    if (question.subscribed[x].userId.toString() == user.id) {
                        return res.status(400).json({
                            error: {
                                message: "User already subscribed"
                            }
                        });
                    }
                }
                // subscribe user
                question.subscribe(user);
                question.save();

                // add question to user's subsribed list
                User.findById(user.id, (err, user) => {
                    user.questionsSubscribed.push({
                        questionId: id
                    });
                    user.save();

                    res.status(204).end();
                });
            } else {
                res.status(404).json({
                    error: {
                        message: "Question not found."
                    }
                });
            }
        });
    }
}

module.exports = new QuestionController();