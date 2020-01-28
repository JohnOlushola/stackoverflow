process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

let User = require("../src/models/user");

chai.use(chaiHttp);

describe("Auth", () => {
    after(done => {
        User.deleteMany(() => {
            done();
        });
    });
    /**
     * POST /auth
     */
    describe("POST /auth", () => {
        before(done => {
            // create user
            User.create({
                    firstname: "John",
                    lastname: "Doe",
                    email: "johndoe@example.com",
                    password: "johndoe"
                },
                (err, user) => {
                    if (err) throw err;
                    done();
                }
            );
        });

        it("authenticate user", done => {
            // authenticate user
            chai
                .request(server)
                .post("/auth")
                .send({
                    email: "johndoe@example.com",
                    password: "johndoe"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("id");
                    res.body.should.have.property("email");
                    res.body.should.have.property("jwt");
                    done();
                });
        });
    });
});