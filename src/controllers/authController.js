const User = require("../models/user");
const jwt = require("jsonwebtoken");

class AuthController {
    // auth user
    async store(req, res, next) {
        let {
            email,
            password
        } = req.body;

        User.findOne({
                email: email
            },
            (err, user) => {
                if (err) {
                    return next(err);
                }

                if (user) {
                    if (user.validatePassword(password)) {
                        let token = user.generateJWT();
                        res.setHeader("Authorization", "Bearer " + token);
                        return res.status(200).json({
                            id: user._id,
                            email: user.email,
                            jwt: token
                        });
                    } else {
                        res.status(401).json({
                            error: {
                                message: "Incorrect password"
                            }
                        });
                    }
                } else {
                    res.status(404).json({
                        error: {
                            message: "User does not exist"
                        }
                    });
                }
            }
        );
    }
}

module.exports = new AuthController();