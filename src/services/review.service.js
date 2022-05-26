const db = require("./db.service");
const rPhoto = require("./rphoto.service");

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

async function createReview(body, files = []) {
    if (!files.length || files === undefined) throw Error("No files");

    // Upload to firebase & store it to RPhoto
    let rphoto_ids = [];
    for (const file of files) {
        const rphoto_id = await rPhoto.insertRPhoto(file.path);
        rphoto_ids.push(rphoto_id);
    }

    // List of required fields
    const fields = ["user_id", "product_id", "rating", "review"];

    // Cek field dulu
    fields.forEach((field) => {
        if (body[field] === undefined || body[field] === null)
            throw Error("Missing field");
    });

    // Insert ke reviews
    let review, review_id;
    try {
        const query = `INSERT INTO reviews(${fields.join(
            ", "
        )}, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const res = await db.executeQuery(query, [
            ...fields.map((field) => body[field]),
            "NOW()",
            "NOW()",
        ]);
        review = res[0];
        review_id = review.review_id;
    } catch (err) {
        throw Error(err.message);
    }

    // Insert ke reviews_rphoto
    try {
        const query = `INSERT INTO review_rphotos(review_id, rphoto_id) VALUES($1, $2)`;
        rphoto_ids.forEach(async (rphoto_id) => {
            const res = await db.executeQuery(query, [review_id, rphoto_id]);
        });
    } catch (err) {
        throw Error(err.message);
    }
    return review;
}

module.exports = {
    getReview,
    createReview,
};
