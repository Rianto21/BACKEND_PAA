const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const reviewRouter = require("./routes/review.route");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use((req, res, next) => {
    console.log(res.end);
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use("/review", reviewRouter);

/* Error handler middleware */
// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     console.error(err.message, err.stack);
//     res.status(statusCode).json({ message: err.message });

//     return;
// });

app.listen(port, "0.0.0.0", () => {
    console.log(`App listening at http://localhost:${port}`);
});
