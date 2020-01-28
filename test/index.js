process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

chai.use(chaiHttp);

describe("Index", () => {
    /**
     * GET /
     * Root index
     */
    describe("GET /", () => {
        it("should be up", done => {
            chai
            .request(server)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
        })
    })

    /**
     * GET /search
     */
    describe("GET /search", () => {
        it("should return search results", done => {
            chai
            .request(server)
            .get("/search")
            .query("hello")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
        })
    })
})