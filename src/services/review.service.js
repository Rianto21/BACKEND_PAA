const db = require("./db.service");

async function getReview(product_id) {
    let res;
    try {
        if (product_id !== undefined) {
            let query = "SELECT * FROM reviews WHERE product_id = $1";
            res = await db.executeQuery(query, [product_id]);
        } else {
            let query = "SELECT * FROM reviews";
            res = await db.executeQuery(query);
        }
    } catch (err) {
        throw Error(err.message);
    }
    return res;
}

module.exports = {
    getReview,
};
