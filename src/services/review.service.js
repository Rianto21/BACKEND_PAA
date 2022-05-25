const db = require("./db.service");

async function getReview(product_id) {
    const rows = await db.executeQuery(
        "SELECT * FROM reviews WHERE product_id = $1",
        [product_id]
    );
    return rows;
}

module.exports = {
    getReview,
};
