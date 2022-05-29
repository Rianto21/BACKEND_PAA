const db = require("./db.service");
const fs = require("fs");
const path = require("path");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../configs/api-review-c9dd4-firebase-adminsdk-nzv18-a132c6decc.json");
const { v4: uuidv4 } = require("uuid");
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const storageRef = admin.storage().bucket(process.env.BUCKET_URL);

async function upload(src) {
    const storage = await storageRef.upload(src, {
        public: true,
        destination: `/${Date.now() + path.extname(src)}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        },
    });
    return storage[0].metadata.mediaLink;
}

async function remove(url) {
    const filename = url
        .split("/")
        [url.split("/").length - 1].split("?")[0]
        .substr(3);
    await storageRef.file(`/${filename}`).delete();
}

async function insertRPhoto(src) {
    const url = await upload(src);
    const query = "INSERT INTO rphotos(url) VALUES($1) RETURNING *";
    const res = await db.executeQuery(query, [url]);
    // Delete the temporary file
    fs.unlinkSync(src);
    return res[0].rphoto_id;
}

async function deleteRPhoto(review_id) {
    // delete review_rphotos dulu
    const query =
        "DELETE FROM review_rphotos WHERE review_id = $1 RETURNING rphoto_id";
    const res = await db.executeQuery(query, [review_id]);
    const rphoto_ids = res.map((e) => e.rphoto_id);
    let urls = [];
    for (let i = 0; i < rphoto_ids.length; i++) {
        const rphoto_id = rphoto_ids[i];
        const query = "DELETE FROM rphotos WHERE rphoto_id = $1 RETURNING *";
        const res = await db.executeQuery(query, [rphoto_id]);
        const url = res[0].url;
        urls.push(url);
    }

    // Delete from firebase
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        await remove(url);
    }
}

module.exports = {
    insertRPhoto,
    deleteRPhoto,
    remove,
};
