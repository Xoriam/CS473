/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var BSON = require("mongodb").BSONPure,
    tableName = "likes";

exports.add = function (db) {
    "use strict";
    return function (req, res) {

        var userInfo = {
                username: req.session.currentUser.username,
                _id: req.session.currentUser._id
            },
            like = {
                "userRec": userInfo,
                "category": req.body.category,
                "name": req.body.name,
                "Description": req.body.description,
                "SBN": req.body.sbn,
                "rank": 1,
                "EnteredOn": new Date(),
                "CreatedBy": userInfo
            };

        console.log("like\n", like);
        var collection = db.get(tableName);
        collection.insert(like, function (err, doc) {
            if (err) {
                res.send("There is no database!");
            }
            else {
                console.log("Project inserted successful");
                res.location("likeStuff");
                res.redirect("likeStuff");
            }

        });
    };
};

exports.edit = function (db) {
    "use strict";
    return function (req, res) {
        var collection = db.get(tableName);
        if (req.body["delete"] === "") {
            var like = {_id: BSON.ObjectID.createFromHexString(req.query._id)};
            collection.remove(like, function (err, doc) {
                if (err) {
                    res.send("Psh what database");
                }
                else {
                    console.log("Record deleted successful");
                    res.location("likeStuff");
                    res.redirect("likeStuff");
                }

            });
        } else if (req.body.edit === "") {
            var filter = {_id: BSON.ObjectID.createFromHexString(req.query._id)};
            console.log("req.sessions.oldValues\n", req.session.oldValues);
            console.log("req.session.req.body\n", req.body);
            var oldRecord = req.session.oldValues[0];
            var updateList = {};
            if (oldRecord.name !== req.body.name) {
                updateList.name = req.body.name;
            }
            if (oldRecord.Description !== req.body.description) {
                updateList.Description = req.body.description;
            }
            if (oldRecord.SBN !== req.body.sbn) {
                updateList.SBN = req.body.sbn;
            }
            if (oldRecord.category !== req.body.caegory) {
                updateList.category = req.body.category;
            }
            console.log("here are the changes\n", updateList);
            collection.update(filter, {$set: updateList}, {}, function (err, doc) {
                if (err) {
                    res.send("No database!");
                }
                else {
                    console.log("Record updated successful");
                    res.location("likeStuff");
                    res.redirect("likeStuff");
                }
            });
        } else {
            console.log("exports.like", req.query._id !== null ? req.query._id : "no value");
            console.log("req.body\n", req.body);
            var p_id = BSON.ObjectID.createFromHexString(req.query._id);
            var collection1 = db.get("Tasks");
            var collection2 = db.get("timesheets");
            var collection3 = db.get("accounts");
            if (req.body.enabler === "") {
                console.log("Enabled");
                console.log(req.session.curRecord);
            }
            collection.find({_id: p_id}, {}, function (e, like) {
                collection1.find({Project: req.query._id}, {}, function (e, task) {
                    var filter = [];
                    for (var t in task) {
                        filter.push(task[t]._id);
                    }
                    console.log("task filter", filter);
                    collection2.find({Task: {$in: filter}}, {}, function (e, timesheet) {
                        filter = [];
                        for (var t in timesheet) {
                            filter.push(BSON.ObjectID.createFromHexString(timesheet[t].user));
                        }
                        console.log("user filter", filter);
                        collection3.find({_id: {$in: filter}}, {}, function (e, account) {
                            res.render("viewlike", {
                                "projectlist": like,
                                "userlist": account,
                                "tasklist": task,
                                "timesheetlist": timesheet,
                                "currentUser": req.session.currentUser
                            });
                        });
                    });
                });
            });
        }
    };
};

exports.list = function (db) {
    "use strict";
    return function (req, res) {
        var collection = db.get(tableName),
            collection1 = db.get("accounts"),
            collection2 = db.get("Tasks"),
            collection3 = db.get("Timesheets");

        collection.find({}, {}, function (e, proj) {
            collection1.find({}, {}, function (e, account) {
                collection2.find({}, {}, function (e, task) {
                    collection3.find({}, {}, function (e, timesheet) {
                        res.render("projects", {
                            "projectlist": proj,
                            "userlist": account,
                            "tasklist": task,
                            "timesheetlist": timesheet,
                            "currentUser": req.session.currentUser
                        });
                    });
                });
            });
        });
    };
};

exports.callNew = function (req, res) {
    "use strict";
    res.render("newlike",
        {
            title: "Add a New Like",
            "currentUser": req.session.currentUser
        }
    );
};

exports.record = function (db) {
    "use strict";
    return function (req, res) {
        console.log("likes.record", req.query._id);
        var p_id = BSON.ObjectID.createFromHexString(req.query._id),
            collection = db.get(tableName),
            collection1 = db.get("Tasks"),
            collection2 = db.get("Timesheets"),
            collection3 = db.get("accounts");
        collection.find({_id: p_id}, {}, function (e, like) {
            collection1.find({"Project._id": req.query._id}, {}, function (e, task) {
                var filter = [];
                for (var t in task) {
                    filter.push(task[t]._id);
                }
                console.log("filter tasks", filter);
                collection2.find({Task: {$in: filter}}, {}, function (e, timesheet) {
                    filter = [];
                    for (var t in timesheet) {
                        filter.push(BSON.ObjectID.createFromHexString(timesheet[t].user));
                    }
                    collection3.find({_id: {$in: filter}}, {}, function (e, account) {
                        req.session.oldValues = like;
                        req.session.curRecord = {"table": tableName, "Record": like};
                        console.log("req.session.curRecord\n", req.session.curRecord);
                        res.render("viewlike", {
                            "projectlist": like,
                            "tasklist": task,
                            "timesheetlist": timesheet,
                            "userlist": account,
                            "IsEnabled": false,
                            "currentUser": req.session.currentUser
                        });
                    });
                });
            });
        });
    };
};