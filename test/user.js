process.env.NODE_ENV = "test";

let User = require("../src/models/user");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

chai.use(chaiHttp);

describe("Users", () => {
    beforeEach(done => {
        User.deleteMany({}, err => {
            done();
        });
    });

    /**
     * Test GET /user
     */
    describe("GET user", err => {
        it("it should get all users", done => {
            chai
                .request(server)
                .get("/user")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    /**
     * Test GET /user/:id
     */
    describe("GET user/:id", err => {
        it("it should get a users with given id", done => {
            let user = new User({
                firstname: "John",
                lastname: "Doe",
                email: "johndoe@example.com",
                password: "johndoe"
            });
            user.save((err, user) => {
                chai
                .request(server)
                .get("/user/" + user.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("firstname");
                    res.body.should.have.property("lastname");
                    res.body.should.have.property("email");
                    res.body.should.have.property("reputation");
                    res.body.should.have.property("timestamps");
                    res.body.should.have.property("_id").eql(user.id);
                    done();
                });
            })
            
        });
    });
    /**
     * Test POST /user
     */
    describe("POST user", err => {
        it("should create a new user", done => {
            let user = {
                firstname: "John",
                lastname: "Doe",
                email: "johndoe@gmail.com",
                password: "johndoe"
            };
            chai
                .request(server)
                .post("/user")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("firstname");
                    res.body.should.have.property("lastname");
                    res.body.should.have.property("email");
                    res.body.should.have.property("reputation");
                    res.body.should.have.property("timestamps");
                    res.body.should.have.property("questionsSubscribed");
                    done();
                });
        });

        it("should not create a new user without email and password", done => {
            let user = {
                firstname: "John",
                lastname: "Doe"
            };
            chai
                .request(server)
                .post("/user")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.property("error");
                    done();
                });
        });
    });
});
