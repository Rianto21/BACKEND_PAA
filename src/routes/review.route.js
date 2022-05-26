const express = require("express");
const router = express.Router();
const multer = require("../configs/multer.config");
const reviewController = require("../controllers/review.controller");

router.get("/", reviewController.get);
router.post("/", multer.imageUpload, reviewController.create);
router.put("/:id", reviewController.update);
router.delete("/:id", reviewController.remove);

module.exports = router;
