const sign = require("jwt-encode");
const secret = "secret";
const data = {
    user_id: 1,
};
const jwt = sign(data, secret);
console.log(jwt);
