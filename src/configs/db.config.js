const env = process.env;
const db = {
    connectionString: env.DBSTRING,
    ssl: {
        rejectUnauthorized: false,
    },
};

module.exports = db;
