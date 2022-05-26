const db = require("./src/services/db.service");

async function test() {
    let query = "SELECT * FROM review_rphotos";
    query = "SELECT created_at FROM reviews";
    const res = await db.executeQuery(query);
    console.log(res);
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
