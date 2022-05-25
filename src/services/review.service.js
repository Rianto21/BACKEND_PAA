const db = require("./db.service");

async function getReview(product_id) {
    let res;
    if (product_id !== undefined) {
        let query = "SELECT * FROM reviews WHERE product_id = $1";
        res = await db.executeQuery(query, [product_id]);
    } else {
        let query = "SELECT * FROM reviews";
        res = await db.executeQuery(query);
    }
    return res;
}

module.exports = {
    getReview,
};
