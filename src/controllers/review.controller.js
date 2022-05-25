const review = require("../services/review.service");

async function get(req, res, next) {
    try {
        res.json(await review.getReview(req.params.id));
    } catch (err) {
        console.error("Error at review.controller.js GET", err.message);
    }
}

async function create(req, res, next) {
    try {
        res.json({});
    } catch (err) {
        console.error("Error at review.controller.js GET", err.message);
    }
}

async function update(req, res, next) {
    try {
        res.json({});
    } catch (err) {
        console.error("Error at review.controller.js GET", err.message);
    }
}

async function remove(req, res, next) {
    try {
        res.json({});
    } catch (err) {
        console.error("Error at review.controller.js GET", err.message);
    }
}

module.exports = {
    get,
    create,
    update,
    remove,
};
