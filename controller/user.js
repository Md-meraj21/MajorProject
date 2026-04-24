const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeruser = await User.register(newUser, password);

        req.login(registeruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To wanderlust");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async(req, res) => {
    let { username } = req.body; 
    req.flash("success", `Welcome Back ${username}`);
    let redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Logout Completed !");
        return res.redirect("/listings");
    })

};