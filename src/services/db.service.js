const { Client } = require("pg");
const dbConfig = require("../configs/db.config");

async function executeQuery(query, params = []) {
    const client = new Client(dbConfig);
    await client.connect();
    try {
        const res = await client.query(query, params);
        await client.end();
        return res.rows;
    } catch (err) {
        throw Error(err.code);
    }
}

module.exports = {
    executeQuery,
};
