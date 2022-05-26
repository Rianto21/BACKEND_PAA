const review = require("../services/review.service");

async function get(req, res, next) {
    try {
        res.json({
            status: true,
            message: "ok",
            result: await review.getReview(req.query.productId),
        });
    } catch (err) {
        console.error("Error at review.controller.js GET", err.message);
        res.json({ status: false, mesage: err.message, result: [] });
    }
}

async function create(req, res, next) {
    try {
        res.json({
            status: true,
            message: "ok",
            result: await review.createReview(req.body, req.files),
        });
    } catch (err) {
        console.error("Error at review.controller.js POST", err.message);
        res.json({ status: false, mesage: err.message, result: [] });
    }
}

async function update(req, res, next) {
    try {
        res.json({});
    } catch (err) {
        console.error("Error at review.controller.js PUT", err.message);
        res.json({ status: false, mesage: err.message, result: [] });
    }
}

async function remove(req, res, next) {
    try {
        res.json({});
    } catch (err) {
        console.error("Error at review.controller.js DELETE", err.message);
        res.json({ status: false, mesage: err.message, result: [] });
    }
}

module.exports = {
    get,
    create,
    update,
    remove,
};
