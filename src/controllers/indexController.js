const User = require("../models/user");
const Question = require("../models/question");
const Answer = require("../models/answer");

class IndexController {
    index(req, res) {
        res.status(200).end();
    }

    async search(req, res) {
        let { query } = req.query;
        
        try {
            let users, questions, answers, results;
            users = await User.find({
                $or: [
                    { lastname: { $regex: ".*" + query + ".*", $options: "si" } },
                    { firstname: { $regex: ".*" + query + ".*", $options: "si" } }
                ]
            }, (err, users) => {
                if (err) {
                    throw new Error(err)
                }
                return users
            }).select("-password")

            questions = await Question.find({ title: { $regex: ".*" + query + ".*", $options: "si" } }, (err, questions) => {
                if (err) {
                    throw new Error(err)
                }

                return questions;
            })

            answers = await Answer.find({ body: { $regex: ".*" + query + ".*", $options: "si" } }, (err, answers) => {
                if (err) {
                    throw new Error(err)
                }

                return answers
            })

            results = {
                users: users,
                questions: questions,
                answers: answers
            };
            res.status(200).send({ results: results });
        }
        catch (err) {
            res.status(500).json({
                message: {
                    error: err.message
                }
            })
        }
    }
}

module.exports = new IndexController();