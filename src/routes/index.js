const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const questionController = require("../controllers/questionController")
const answerController = require("../controllers/answerController");
const indexController = require("../controllers/indexController");
const auth = require("../middleware/auth");

/**
 * Index routes
 */
router.get("/", indexController.index);
router.get("/search", indexController.search);


/**
 * Auth route
 */
router.post("/auth", authController.store);


/**
 * User routes
 */
router.post("/user", userController.store);

router.get("/user", userController.getUsers);
router.get("/user/:id", userController.getUser);


/**
 * Question routes
 */

router.post("/question", auth.required, questionController.store);
router.get("/question", questionController.getQuestions);
router.get("/question/:id", questionController.index);
router.delete("/question/:id", auth.required, questionController.delete)


router.put("/question/:id/upvote", auth.required, questionController.upvote);
router.put("/question/:id/downvote", auth.required, questionController.downvote);

router.put("/question/:id/subscribe", auth.required, questionController.subscribe);


/**
 * Answer routes
 */
router.post('/answer', auth.required, answerController.store);
router.get('/answer', answerController.getAnswers);
router.get('/answer/:id', answerController.index);
router.delete('/answer/:id', answerController.delete);

module.exports = router;