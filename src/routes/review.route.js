const express = require("express");
const router = express.Router();
const multer = require("../configs/multer.config");
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", reviewController.get);
router.post("/", [authMiddleware, multer.imageUpload], reviewController.create);
router.put("/:id", authMiddleware, reviewController.update);
router.delete("/:id", authMiddleware, reviewController.remove);

module.exports = router;
