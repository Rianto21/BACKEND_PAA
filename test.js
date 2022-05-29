const db = require("./src/services/db.service");
const rphoto = require("./src/services/rphoto.service");

async function test() {
    let query = "SELECT * FROM review_rphotos";
    query = "DELETE FROM rphotos WHERE rphoto_id = $1 RETURNING *";
    const res = await db.executeQuery(query, [8]);
    console.log(res);
    console.log(res);
}

async function d() {
    await rphoto.remove(
        "https://storage.googleapis.com/download/storage/v1/b/api-review-c9dd4.appspot.com/o/%2Fmy-image.jpg?alt=media"
    );
}

// let awikwok = [
//     {
//       product_id: 2,
//       user_id: 1,
//       category_id: 2,
//       name: 'HP Oddo',
//       description: 'Hp oddo spek gimang. Dota 2 60 fps',
//       price: '2500000',
//       stock: 20,
//       image: '-',
//       createdAt: 2022-05-22T04:25:25.166Z,
//       updatedAt: 2022-05-22T04:25:25.166Z
//     }
//   ]

(async () => {
    await test();
})();
