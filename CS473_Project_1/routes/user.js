/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
/*
 * GET users records.
 */
var BSON = require("mongodb").BSONPure,
    tableName = "accounts";

exports.list = function (db) {
    "use strict";
    return function (req, res) {
        var collection = db.get(tableName);

        collection.find({}, {}, function (e, account) {
            res.render("users", {
                "users": account,
                "currentUser": req.session.currentUser
            });
        });
    };
};


exports.record = function (db) {
    "use strict";
    return function (req, res) {
        var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
            collection = db.get(tableName);
        collection.find({_id: obj_id}, {}, function (e, account) {
            console.log("account search for:", req.query._id);
            req.session.curRecord = {"table": tableName, Record: account};
            req.session.oldValues = account;
            res.render("viewuser", {
                "userlist": account,
                "IsEnabled": false,
                "currentUser": req.session.currentUser
            });
        });
    };
};

exports.otherrecord = function (db) {
    "use strict";
    return function (req, res) {
        var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
            collection = db.get(tableName);
        collection.find({_id: obj_id}, {}, function (e, account) {
            res.render("viewotheruser", {
                "userlist": account,
                "IsEnabled": false,
                "currentUser": req.session.currentUser
            });
        });
    };
};

exports.add = function (db) {
    "use strict";
    return function (req, res) {
        //req.assert("userName", "User Name is  required").notEmpty();
        //req.assert("userEmail", "User Email is required").notEmpty();
        //req.assert("userPassword", "Password is required").notEmpty();

        //var errors = req.validationErrors();
        //console.log(errors);
        //if( !errors) {   //Display errors to
        //	res.render("newuser", { errors: errors, messges:errors });
        //} else {
        console.log(req.session.currentUser);
        var collection = db.get(tableName);

        //var thisUser = {
        //		"_id": req.session.currentUser._id,
        //		"username": req.session.currentUser.username
        //	},
        var record = {
            "username": req.body.username,
            "email": req.body.useremail,
            "password": req.body.userpassword,
            "status": req.body.status,
            "Role": req.body.role,
            "EnteredOn": new Date(),
            //"CreatedBy": thisUser
        };
        collection.insert(record, function (err, doc) {
            if (err) {
                res.send("No Database!!");
            }
            else {
                if (req.session.currentUser && req.session.currentUser.length > 0) {
                    res.render("home",
                        {
                            title: req.session.currentUser.username,
                            "currentUser": req.session.currentUser
                        }
                    );
                } else {
                    res.render("login", {title: "Login Successfully created for " + record.username});
                }
            }
        });
    };
};

exports.edit = function (db) {
    "use strict";
    return function (req, res) {
        console.log("exports.edit");
        var collection = db.get(tableName);
        if (req.body["delete"] === "") {
            console.log("going to delete");
            var project = {_id: BSON.ObjectID.createFromHexString(req.query._id)};
            collection.remove(project, function (err, doc) {
                if (err) {
                    res.send("There is no database!");
                }
                else {
                    console.log("Record deleted successful");
                    res.location("/");
                    res.redirect("/");
                }
            });
        } else if (req.body.edit === "") {
            var filter = {_id: BSON.ObjectID.createFromHexString(req.query._id)};
            console.log("req.sessions.oldValues\n", req.session.oldValues);
            console.log("req.session.req.body\n", req.body);
            var oldRecord = req.session.oldValues[0],
                updateList = {};
            if (oldRecord.username !== req.body.username) {
                updateList.username = req.body.username;
            }
            if (oldRecord.email !== req.body.useremail) {
                updateList.email = req.body.useremail;
            }
            if (oldRecord.password !== req.body.userpassword) {
                updateList.password = req.body.userpassword;
            }
            if (oldRecord.status !== req.body.status) {
                updateList.status = req.body.status;
            }
            if (oldRecord.Role !== req.body.role) {
                updateList.Role = req.body.role;
            }
            console.log("updateList\n", updateList);
            collection.update(filter, {$set: updateList}, {}, function (err, doc) {
                if (err) {
                    res.send("Psh what database");
                }
                else {
                    console.log("Record updated successful");
                    res.location("/");
                    res.redirect("/");
                }
            });
        } else {

            console.log("exports.edit", req.query._id !== null ? req.query._id : "no value");
            var obj_id = BSON.ObjectID.createFromHexString(req.query._id);
            var IsEnabled = "Disabled";
            if (req.body.enabler === "") {
                console.log("Enabled");
                IsEnabled = true;
            } else {
                console.log("Not Enabled");
                IsEnabled = "Disabled";
            }
            console.log("IsEnabled", IsEnabled);
            collection.find({_id: obj_id}, {}, function (e, account) {
                res.render("viewuser", {
                    "userlist": account,
                    "IsEnabled": IsEnabled,
                    "currentUser": req.session.currentUser
                });
            });
        }
    };
};
exports.callNew = function (req, res) {
    "use strict";
    res.render("newuser",
        {
            title: "Add a New User",
            "currentUser": req.session.currentUser
        }
    );
};

exports.login = function (req, res) {
    "use strict";
    res.render("login", {title: "User Login"});
};

exports.checklogin = function (db, next) {
    "use strict";
    return function (req, res, next) {
        console.log("checklogin");
        var userName = req.body.username;
        var userPassword = req.body.userpassword;
        var collection = db.get(tableName);
        console.log(collection);
        var currentUser = {
            "username": userName,
            "password": userPassword
        };
        collection.findOne(currentUser, function (err, doc) {
            if (err) {
                console.log(err);
                res.send("No database!");
            } else if (doc === null) {
                console.log("User name and password not found");
                res.render("login", {
                        title: "Incorrect Login",
                        reason: "No account matched credentials entered.  Try again."
                    }
                );
            } else {
                console.log("user record found\n", doc);
                req.session.currentUser = doc;
                res.render("home",
                    {
                        title: currentUser.username,
                        "currentUser": req.session.currentUser
                    }
                );
            }

        });
    };
};
