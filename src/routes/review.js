// NPM Package
import express from "express";
const app = express();

// Local Package/Module

app.get('/:productid', getReviewProduct);
app.post('/', postReview);
app.put('/:reviewid', putReview);
app.delete('/:reviewid', deleteReview)

module.exports = app;