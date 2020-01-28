require('dotenv').config();
let jwt = require('jsonwebtoken');
let User = require('../models/user');

const auth = {
    required: (req, res, next) => {
        if (req.header('Authorization')) {
            const token = req.header('Authorization').replace('Bearer ', '')
            jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.status(401).json({
                        error: {
                            message: "Invalid token, failed to authenticate"
                        }
                    })
                }
                // find User
                User.findById(data.id, (err, user) => {
                    if(err){
                        res.send(500);
                    }

                    if(!user){
                        return res.status(404).json({
                            error: {
                                title: "User not found",
                                message: "Token verified but cannot find user in database. Try signing in again"
                            }
                        })
                    }
                    req.user = data;
                    next();
                })
            })
        }
        else {
            res.status(401).json({
                message: { 
                    error: "No token provided"
                }
            })
        }
    }
}

module.exports = auth;