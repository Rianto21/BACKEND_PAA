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

async function insertRPhoto(src) {
    const url = await upload(src);
    const query = "INSERT INTO rphotos(url) VALUES($1) RETURNING *";
    const res = await db.executeQuery(query, [url]);
    // Delete the temporary file
    fs.unlinkSync(src);
    return res[0].rphoto_id;
}

module.exports = {
    insertRPhoto,
};
