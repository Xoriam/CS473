/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
/**
 * Module dependencies.
 */

var express = require("express");
var routes = require("./routes");
var user = require("./routes/user");
var like = require("./routes/likes");
var mail = require("./routes/mail");
var friend = require("./routes/friend");

var http = require("http");
var path = require("path");
var validator = require("express-validator");
var app = express();

//db aacess
var monk = require("monk");
var db = monk("localhost:27017/proj1");

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("your secret here"));
app.use(express.session());
app.use(validator());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" === app.get("env")) {
    app.locals.pretty = true;
    app.use(express.errorHandler());
}

// Asynchronous
/* Leftover testing authentication function from pre-DB development
 var auth = express.basicAuth(function (user, pass, callback) {
 "use strict";
 var result = (user === "testUser" && pass === "testPass");
 callback(null, result);
 });
 */

app.get("/", routes.index);
//user pages
app.get("/users", user.list(db));
app.get("/newuser", user.callNew);   //trying to get autehntication working
app.get("/viewuser", user.record(db));
app.get("/viewotheruser", user.otherrecord(db));
//like pages
app.get("/newlike", like.callNew);
app.post("/addlike", like.add(db));
app.get("/viewlike", like.record(db));

app.get("/likeStuff", routes.likeStuff(db));
app.get("/help", routes.help(db));
app.get("/aboutUs", routes.aboutUs(db));
app.get("/friends", routes.friends(db));

/* Eric Start */
app.all("/friend/api/:action", friend.api(db));
app.get("/friend/list", friend.list);
app.get("/friend/find", friend.find);
app.get("/friend/discover", friend.discover);
app.get("/friend/pending", friend.pending);
/* Eric End */

app.get("/mail", mail.list(db));
app.get("/compose", mail.compose);
app.get("/respond", mail.record(db));

app.get("/login", user.login);
app.get("/logout", function (req, res) {
    "use strict";
    delete req.session.authStatus;
    delete req.session.currentUser;
    res.send([
        "You are now logged out. <a href=\"/login\">Click here to log in again.</a>"
    ].join(""));
});

app.post("/adduser", user.add(db));
app.post("/login", user.checklogin(db));
app.post("/edituser", user.edit(db));
app.post("/editlike", like.edit(db));
//app.post("/query_mail", mail.query); goes unused, test route
app.post("/addmail", mail.add(db));
http.createServer(app).listen(app.get("port"), function () {
    "use strict";
    console.log("Express server listening on port " + app.get("port"));
});
