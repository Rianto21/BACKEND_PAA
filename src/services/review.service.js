const db = require("./db.service");
const rPhoto = require("./rphoto.service");

async function getReview(product_id) {
    let res;
    // if (!Number.isInteger(product_id)) throw Error("product_id NaN");
    try {
        if (product_id !== undefined) {
            let query = "SELECT * FROM reviews WHERE product_id = $1";
            res = await db.executeQuery(query, [product_id]);
            // Get photos
            for (let i = 0; i < res.length; i++) {
                let review = res[i];
                query =
                    "SELECT rp.url FROM rphotos rp JOIN review_rphotos rr ON rp.rphoto_id = rr.rphoto_id WHERE rr.review_id = $1";
                const photos = await db.executeQuery(query, [review.review_id]);
                review.photo = photos.map((photo) => photo.url);
            }
        } else {
            throw Error("missing parameter");
            // let query = "SELECT * FROM reviews";
            // res = await db.executeQuery(query);
        }
    } catch (err) {
        throw Error(err.message);
    }
    return res;
}

async function createReview(body, files = []) {
    const hasPhoto = files.length;

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

    if (!hasPhoto) return review;

    // Upload to firebase & store it to RPhoto
    let rphoto_ids = [];
    for (const file of files) {
        const rphoto_id = await rPhoto.insertRPhoto(file.path);
        rphoto_ids.push(rphoto_id);
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

async function updateReview(review_id, review_body) {
    let review;

    // List of required fields
    const fields = ["rating", "review"];
    let fieldData = {};

    // Cek field dulu
    fields.forEach((field) => {
        if (typeof review_body[field] !== "undefined")
            fieldData[field] = review_body[field];
    });
    if (Object.keys(fieldData).length == 0) throw Error("Missing field");
    // fieldQuery = parameter apa aja yg perlu diupdate + updatedAt
    const fieldQuery = Object.keys(fieldData)
        .map((v, i) => {
            return `${v} = $${i + 1}`;
        })
        .concat(`"updatedAt" = $${Object.keys(fieldData).length + 1}`);
    // fieldData = array isi dari rating / review & review_id
    fieldData = [
        ...Object.keys(fieldData).map((v) => {
            return fieldData[v];
        }),
        "NOW()",
        review_id,
    ];

    try {
        const query = `UPDATE reviews SET ${fieldQuery.join(
            ", "
        )} WHERE review_id = $${fieldQuery.length + 1} RETURNING *`;

        const res = await db.executeQuery(query, fieldData);

        review = res;
    } catch (err) {
        throw Error(err.message);
    }
    return review;
}

async function deleteReview(review_id) {
    let review;
    // Delete rphotos_review, rphotos, and firebase
    await rPhoto.deleteRPhoto(review_id);
    try {
        const query = `DELETE FROM reviews
        WHERE review_id = $1
        RETURNING *;
        `;
        const res = await db.executeQuery(query, [review_id]);
        review = res;
    } catch (error) {
        throw Error(error.message);
    }
    return review;
}

module.exports = {
    getReview,
    createReview,
    updateReview,
    deleteReview,
};
