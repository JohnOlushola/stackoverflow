process.env.NODE_ENV = "test";

let Question = require("../src/models/question");
let User = require("../src/models/user");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

chai.use(chaiHttp);

describe("Questions", () => {
    let user;
    let token;
    before(done => {
        // create user
        user = new User({
            firstname: "John",
            lastname: "Doe",
            email: "johndoe@example.com",
            password: "johndoe"
        });
        user.save((err, result) => {
            if (err) throw err;
        });

        // authenticate user
        chai
            .request(server)
            .post("/auth")
            .send({
                email: user.email,
                password: user.password
            })
            .end((err, res) => {
                token = res.body.jwt;
                done();
            });
    });

    beforeEach(done => {
        // User.deleteMany();
        Question.deleteMany(() => {
            done();
        });
        
    });

    after(done => {
        User.deleteMany();
        Question.deleteMany(() => {
            done();
        });
        
    });

    /**
     * GET /question
     */
    describe("GET /question", () => {
        it("should GET all questions", done => {
            chai
                .request(server)
                .get("/question")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    /**
     * GET /question/:id
     */
    describe("GET /question/:id", () => {
        it("should GET a question with given id", done => {
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });
            question.save((err, question) => {
                chai
                    .request(server)
                    .get("/question/" + question.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("userId");
                        res.body.should.have.property("title");
                        res.body.should.have.property("body");
                        res.body.should.have.property("answered");
                        res.body.should.have.property("subscribed");
                        res.body.should.have.property("_id").eql(question.id);
                        done();
                    });
            });
        });
    });

    /**
     * POST /question/
     */
    describe("POST /question", () => {
        it("should create question", done => {
            let userId = user.id;
            let question = {
                userId: userId,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            };
            chai
                .request(server)
                .post("/question")
                .set("Authorization", token)
                .send(question)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("userId");
                    res.body.should.have.property("title");
                    res.body.should.have.property("body");
                    res.body.should.have.property("answered");
                    res.body.should.have.property("subscribed");
                    done();
                });
        });

        it("should not create question if unauthenticated", done => {
            // create question
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });

            question.save((err, question) => {
                chai
                    .request(server)
                    .post("/question/")
                    .send(question)
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
    });

    /**
     * PUT /question/:id/upvote
     */
    describe("PUT /question/:id/upvote", () => {
        it("should increase question's vote", done => {
            // create question
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });

            question.save((err, question) => {
                chai
                    .request(server)
                    .put("/question/" + question.id + "/upvote")
                    .set("Authorization", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property("vote").eql(question.vote + 1);
                        done();
                    });
            });
        });

        it("should not upvote if unauthenticated", done => {
            // create question
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });

            question.save((err, question) => {
                chai
                    .request(server)
                    .put("/question/" + question.id + "/upvote")
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
    });

    /**
     * PUT /question/:id/downvote
     */
    describe("PUT /question/:id/downvote", () => {
        it("should decrease question's vote", done => {
            // create question
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });

            question.save((err, question) => {
                chai
                    .request(server)
                    .put("/question/" + question.id + "/downvote")
                    .set("Authorization", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property("vote").eql(question.vote - 1);
                        done();
                    });
            });
        });

        it("should not downvote if unauthenticated", done => {
            // create question
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });

            question.save((err, question) => {
                chai
                    .request(server)
                    .put("/question/" + question.id + "/downvote")
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
    });

    /**
     * PUT /question/:id/subscribe
     */
    describe("PUT /question/:id/subscribe", () => {
        it("subscribe user to question", done => {
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });
            question.save((err, question) => {
                chai
                    .request(server)
                    .put("/question/" + question.id + "/subscribe")
                    .set("Authorization", token)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
        });

        it("should not subscribe user to question if unauthenticated", done => {
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });
            question.save((err, question) => {
                chai
                    .request(server)
                    .put("/question/" + question.id + "/subscribe")
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });

        it("should not subscribe user to question if already subscribed", done => {
            let question = new Question({
                userId: user.id,
                title: "A question",
                body: "This is the body of a question. Hello, world!"
            });
            question.save((err, question) => {
                // subscribe
                chai
                    .request(server)
                    .put("/question/" + question.id + "/subscribe")
                    .end(() => {
                        // subscribe again
                        chai
                            .request(server)
                            .put("/question/" + question.id + "/subscribe")
                            .end((err, res) => {
                                res.should.have.status(401);
                                done();
                            });
                    });
            });
        });
    });
});