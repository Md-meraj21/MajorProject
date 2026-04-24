const express = require("express");
const router = express.Router({mergeParams:true});
const Wrapasync = require("../utils/Wrapasync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLogin,validateReview, isreviewAuthor } = require("../Middleware.js");
const reviewController = require("../controller/review.js");

//Review
//post Route
router.post("/",isLogin, validateReview, Wrapasync(reviewController.createReview));

//Delete Post Route For Review
router.delete("/:reviewId",isLogin,isreviewAuthor,  Wrapasync(reviewController.destroyReview));

module.exports = router;