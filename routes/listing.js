const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema } = require("../schema.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const Wrapasync = require("../utils/Wrapasync.js");
const Listing = require("../models/listing.js");
const { isLogin, validatelisting, isowner } = require("../Middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer = require('multer')
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage })  //Now multer save the file in my cloudinary storage

router
    .route("/")
    .get(Wrapasync(listingcontroller.index))
    .post(isLogin, upload.single('listing[image]'),  Wrapasync(listingcontroller.createListing));

router.get("/new", isLogin, listingcontroller.renderNewForm);

router
    .route("/:id")
    .get(Wrapasync(listingcontroller.showListing))
    .put(isLogin, isowner, validatelisting, Wrapasync(listingcontroller.updateListing))
    .delete(isLogin, isowner, Wrapasync(listingcontroller.destroyListing));

//New Route


//Edit Route
router.get("/:id/edit", isLogin, isowner, Wrapasync(listingcontroller.renderEditForm));

module.exports = router;