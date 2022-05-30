const http = require("http");

function awake() {
    setInterval((e) => {
        http.get("http://paa-review.herokuapp.com/", (res) => {
            console.log("Ping!!");
        });
    }, 1000 * (10 * 60));
}

module.exports = {
    awake,
};
