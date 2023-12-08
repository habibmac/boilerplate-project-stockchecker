const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    // Test for viewing one stock
    test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices/")
            .query({ stock: "GOOG" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, "stockData");
                assert.equal(res.body.stockData.stock, "GOOG");
                assert.property(res.body.stockData, "price");
                done();
            });
    });

    // Test for liking a stock
    test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices/")
            .query({ stock: "GOOG", like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, "stockData");
                assert.property(res.body.stockData, "likes");
                done();
            });
    });

    // Test for viewing two stocks
    test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices/")
            .query({ stock: ["GOOG", "MSFT"] })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body.stockData);
                assert.equal(res.body.stockData.length, 2);
                done();
            });
    });

    // Test for liking two stocks
    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices/")
            .query({ stock: ["GOOG", "MSFT"], like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body.stockData);
                assert.equal(res.body.stockData.length, 2);
                assert.property(res.body.stockData[0], "rel_likes");
                assert.property(res.body.stockData[1], "rel_likes");
                done();
            });
    });

    // Test for viewing the same stock and liking it again
    test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices/")
            .query({ stock: "GOOG", like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, "stockData");
                assert.equal(res.body.stockData.stock, "GOOG");
                assert.property(res.body.stockData, "likes");

                // Call the endpoint again to simulate liking the stock again
                chai.request(server)
                    .get("/api/stock-prices/")
                    .query({ stock: "GOOG", like: true })
                    .end(function (err2, res2) {
                        assert.equal(res2.status, 200);
                        assert.property(res2.body, "stockData");
                        assert.equal(res2.body.stockData.stock, "GOOG");
                        assert.property(res2.body.stockData, "likes");

                        // Check that the number of likes did not increase
                        assert.equal(
                            res2.body.stockData.likes,
                            res.body.stockData.likes
                        );
                        done();
                    });
            });
    });
});
