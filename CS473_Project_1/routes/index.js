/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
/*
 * GET home page.
 */

var BSON = require("mongodb").BSONPure;

exports.index = function (req, res) {
    "use strict";
    req.session.curRecord = {};
    console.log(req.session.currentUser);
    if (req.session.currentUser !== undefined) {
        res.render("home",
            {
                title: " Welcome, " + req.session.currentUser.username + "!",
                currentUser: req.session.currentUser
            }
        );
    } else {
        req.session.currentUser = {};
        res.render("login", {title: "Hangdog Happenstance"});
    }
};

exports.likeStuff = function (db) {
    "use strict";
    return function (req, res) {
        console.log("going into likeStuff");
        req.session.curRecord = {};
        var collection = db.get("accounts");
        var collection1 = db.get("likes");
        var collection2 = db.get("likes");
        var collection3 = db.get("likes");
        console.log(req.query._id);
        var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
        console.log(p_id);
        collection.find({"_id": {$nin: [p_id]}}, {}, function (e, usr) {
            collection1.find({"category": "Books"}, {}, function (e, book) {
                collection2.find({"category": "Movies"}, {}, function (e, movie) {
                    collection3.find({"category": "Searches"}, {}, function (e, search) {
                        console.log(movie);
                        res.render("likeStuff", {
                            "dashboard": usr,
                            "booklist": book,
                            "movielist": movie,
                            "searchlist": search,
                            currentUser: req.session.currentUser,
                            title: "Like Stuff"
                        });
                    });
                });
            });
        });
    };
};

exports.help = function (db) {
    "use strict";
    return function (req, res) {
        console.log("going into help");
        res.render("help", {
            currentUser: req.session.currentUser,
            title: "Help"
        });
    };
};

exports.aboutUs = function (db) {
    "use strict";
    return function (req, res) {
        console.log("going into About Us");
        res.render("aboutUs", {
            currentUser: req.session.currentUser,
            title: "About Us"
        });
    };
};

exports.mail = function (db) {
    "use strict";
    return function (req, res) {
        console.log("going into Mail");
        res.render("mail", {
            currentUser: req.session.currentUser,
            title: "Mail"
        });
    };
};

exports.friends = function (db) {
    "use strict";
    return function (req, res) {
        console.log("going into friends");
        res.render("friends", {
            currentUser: req.session.currentUser,
            title: "Friends"
        });
    };
};