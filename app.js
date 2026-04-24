if(process.env.NODE_ENV != "production") {
  require('dotenv').config() 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const userRouter =  require("./routes/user.js");
//  App Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//  Database 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLAS_DBS;


const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
})
store.on("error",(err) => {
  console.log("ERROR IN MONGO SESSION STORE",err);
})

//  Se
// ssion + Flash 
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure:false,
  },
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



async function main() {
  await mongoose.connect(dburl);
}
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//  Error Handling 
app.use((req, res, next) => {
  next(new ExpressErrors(404, "Page not Found !"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/Error.ejs", { message });
});

//  Server 
app.listen(8080, () => {
  console.log("Server running on port 8080");
});