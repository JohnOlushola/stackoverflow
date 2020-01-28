const User = require("../models/user");
const { check, validationResult } = require('express-validator');

class UserController {
    // get all users
    getUsers(req, res) {
        User.find((err, users) => {
            res.status(200).json(users)
        }).select("-password");
    }

    // get user
    getUser(req, res) {
        let { id } = req.params;
        User.findById(id, (err, user) => {
            if(!user){
                res.status(404).json({
                    error: {
                        message: "User not found"
                    }
                })
            }
            res.status(200).send(user)
        }).select("-password");
    }

    // create user
    store(req, res) {
        let { firstname, lastname, email, password, cpassword } = req.body;
        if (email && password) {
            // check if user already exists
            User.findOne({ email: email }, (err, user) => {
                if (!user) {
                    User.create({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password
                    }).then((user) => {
                        res.status(201).send(user);
                    });
                }
                else {
                    res.status(403).json({
                        error: {
                            message: "User already exist"
                        }
                    })
                }
            });
        }
        else{
            res.status(400).json({
                error: {
                    message: "Request body incomplete."
                }
            })
        }
    }

    // delete user
    delete(req, res) {
        res.send("NOT IMPLEMENTED");
    }
}

module.exports = new UserController();