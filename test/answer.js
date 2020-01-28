process.env.NODE_ENV = "test";

let Question = require("../src/models/question");
let User = require("../src/models/user");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("Answers", () => {
    let user = {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@gmail.com",
        password: "johndoe"
    }

    after(done => {
        User.deleteMany(() => {
            Question.deleteMany();
            done();
        });
    });

    /**
     * GET /answer
     */
    describe("GET /answer", () => {
        it("should get all answers", done => {
            chai
                .request(server)
                .get("/answer")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });


    /**
     * POST /answer
     */
    describe("POST /answer/:id", () => {
        before(done => {
            User.create(user, (err, user) => {
                done();
            })
        })

        it("should answer a question", done => {
            // authenticate user
            chai
                .request(server)
                .post("/auth")
                .send({
                    email: "johndoe@gmail.com",
                    password: "johndoe"
                })
                .end((err, authenticatedUser) => {
                    // create question
                    chai
                        .request(server)
                        .post("/question")
                        .set('Authorization', authenticatedUser.body.jwt)
                        .send({
                            userId: user.id,
                            title: "A question?",
                            body: "Question body"
                        })
                        .end((err, question) => {
                            // POST answer
                            chai
                                .request(server)
                                .post("/answer")
                                .set("Authorization", authenticatedUser.body.jwt)
                                .send({
                                    questionId: question.body._id,
                                    body: "This is an answer to the question"
                                })
                                .end((err, res) => {
                                    res.should.have.status(201);
                                    done();
                                })

                        })
                })
        })
    });
});