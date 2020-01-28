const Answer = require("../models/answer");
const Question = require("../models/question");
const User = require("../models/user");

class AnswerController {
    index(req, res) {
        let { id } = req.params;
        Answer.findById(id, (err, answer) => {
            if(err){
                return res.status(500).json({
                    message: { 
                        error: "Could not retrieve answer"
                    }
                })
            }

            if(!answer){
                return res.status(404).json({
                    message: {
                        error: "Answer not found"
                    }
                })
            }

            res.status(200).send(answer);
        })
    }

    getAnswers(req, res) {
        let {
            limit
        } = req.query;

        Answer.find()
            .limit(parseInt(limit) || 10)
            .exec((err, answers) => {
                if (err) {
                    return res.status(500);
                }

                if (!answers) {
                    return res.status(404).json({
                        error: {
                            message: "No answer found"
                        }
                    });
                }

                res.status(200).send(answers);
            });
    }

    store(req, res) {
        let {questionId, body} = req.body;
        Answer.create({userId: req.user.id, questionId: questionId, body: body}, (err, answer) => {
            if(err){
                return res.status(500).json({
                    error: { 
                        title: "Could not create answer.",
                        details: err
                    }
                })
            }

            // get question
            Question.findById(questionId, (err, question) => {
                // set question to answered
                question.answered = true;

                // get subscribers
                let subscribers = [];
                for(let index in question.subscribed){
                    subscribers.push(question.subscribed[index].userId);
                }

                // notify subscribers
                subscribers.forEach((subscriber) => {
                    User.findById(subscriber, (err, user) => {
                        for(let index in user.questionsSubscribed){
                            if(user.questionsSubscribed[index].questionId == questionId){
                                user.questionsSubscribed[index].answered = true;
                                user.questionsSubscribed[index].answerId = answer.id;
    
                                user.save();
                            }
                        }
                        
                    })
                })

                question.save();
            })

            res.status(201).send(answer);
        })
    }

    delete(req, res) {
        let {answerId} = req.params;
        Answer.findByIdAndDelete(answerId, (err, answer) => {
            if(err){
                res.status(500).json({
                    error: {
                        message: "Could not delete answer"
                    }
                })
            }

            if(!answer){
                return res.status(404).json({
                    error: {
                        message: "Answer not found"
                    }
                })
            }

            res.status(204).send(answer);
        })
    }
}

module.exports = new AnswerController(); 