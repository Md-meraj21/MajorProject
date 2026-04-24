const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Wrapasync = require("../utils/Wrapasync");
const passport = require("passport");
const { saveredirectUrl } = require("../Middleware");
const userController = require("../controller/user");

router.get("/signup", userController.renderSignupForm);
//signup Route
router.post("/signup", Wrapasync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post("/login", saveredirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login', failureFlash: true
    }),
    userController.Login
);

router.get("/logout", userController.Logout);

module.exports = router;

