const env = process.env;
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const db = {
    connectionString: env.DBSTRING,
    ssl: {
        rejectUnauthorized: false,
    },
};

module.exports = db;
