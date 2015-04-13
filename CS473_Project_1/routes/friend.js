/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
/**
 * Created by Eric on 3/21/15.
 * References:
 * * https://github.com/Automattic/monk
 * * http://docs.mongodb.org/manual/
 * * http://expressjs.com/3x/api.html
 * * http://underscorejs.org/
 */
var BSON = require("mongodb").BSONPure;
var _ = require("underscore");

/* The ServerSide API connection to get appropriate data for all the below chunks */
exports.api = function (db) {
    "use strict";
    return function (req, res) {
        // Check if valid session, error if not
        if (typeof req.session.currentUser === "undefined") {
            res.json({
                error: "No session"
            });
        } else {
            // Database connections to their appropriate collections
            var users = db.get("accounts");
            var likes = db.get("likes");

            // Object with core functionality. Organized as object so that each function may be checked for and executed
            //  using reply[variable] functionality.
            var reply = {
                existingfriends: function (userid) {
                    // Get list of friend objects
                    var p_id = BSON.ObjectID.createFromHexString(userid);

                    // Find the first entry in the users collection matching a users _id. Only return their friends list as we
                    //  don't need more than that at this point
                    users.findOne({
                        "_id": {$in: [p_id]}
                    }, "friends", function (err, friendslists) { // Get logged in user's friends
                        var friends = [];
                        if (typeof friendslists.friends !== "undefined") {
                            _.each(friendslists.friends, function (friendid) {
                                friends.push(BSON.ObjectID.createFromHexString(friendid)); // Convert all friend strings to hex items for _id matching
                            });
                        }
                        // Query mongo for all users from logged in user's friends list and that have that user in their friends list
                        users.find({
                            "_id": {$in: _.uniq(friends, false)},
                            "friends": p_id.toString()
                        }, "username", function (err, userfriends) { // Now get all friends usernames
                            // Have list of users, plus logged in user. Now get all relevent user's likes
                            if (typeof userfriends !== "undefined" && userfriends.length > 0) {
                                var everyone = friendslists.friends;
                                everyone.push(p_id.toString()); // Create object of all friends plus logged in user to search with
                                // Pull all the possible likes from the likes collection that were created by the listed users
                                likes.find(
                                    {"userRec._id": {$in: everyone}},
                                    "category name userRec._id",
                                    function (err, alllikes) {
                                        // Have all match'd likes
                                        var organizedLikes = {};
                                        var organizedOutput = [];
                                        // reorganize and filter the likes to be easier to compare
                                        _.each(alllikes, function (entry) {
                                            if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                                                organizedLikes[entry.userRec._id] = {};
                                            }
                                            if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                                                organizedLikes[entry.userRec._id][entry.category] = [];
                                            }
                                            organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                                        });
                                        // Cycle through the friends to compare their like percentages
                                        _.each(userfriends, function (entry) {
                                            organizedOutput.push({
                                                _id: entry._id,
                                                username: entry.username,
                                                match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                                            });
                                        });
                                        res.json(organizedOutput);
                                        // In preperation to add some sort of pagination system
                                        //res.json(organizedOutput.slice(offset, offset + limit));
                                    });
                            } else {
                                res.json([{
                                    _id: "error",
                                    username: "This is awkward... Make some friends."
                                }]);
                            }
                        });
                    });
                },

                friendspending: function (userid) {
                    // Get list of friend requests for the logged in user
                    var p_id = BSON.ObjectID.createFromHexString(userid);
                    users.findOne({
                        "_id": {$in: [p_id]}
                    }, "friendspending", function (err, friendslists) { // Get logged in user's friend requests
                        var friendspending = [];
                        if (typeof friendslists.friendspending !== "undefined") {
                            _.each(friendslists.friendspending, function (friendid) {
                                // Convert all friend strings to hex items
                                friendspending.push(BSON.ObjectID.createFromHexString(friendid));
                            });
                        }
                        // Get all usernames for users matching the friendspending list
                        users.find({
                            "_id": {$in: _.uniq(friendspending, false)}
                        }, "username", function (err, userfriends) {
                            // Have list of users, plus logged in user. Get all relevent user's likes
                            if (userfriends.length) {
                                var everyone = friendslists.friendspending;
                                // Create object of all friends plus logged in user to search with
                                everyone.push(p_id.toString());
                                // Get all listed users likes
                                likes.find(
                                    {"userRec._id": {$in: everyone}},
                                    "category name userRec._id",
                                    function (err, alllikes) {
                                        // Have all matched likes
                                        var organizedLikes = {};
                                        var organizedOutput = [];
                                        // reorganize and filter the results to be easier to compare
                                        _.each(alllikes, function (entry) {
                                            if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                                                organizedLikes[entry.userRec._id] = {};
                                            }
                                            if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                                                organizedLikes[entry.userRec._id][entry.category] = [];
                                            }
                                            organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                                        });
                                        // Cycle through the friends to compare their like rankings
                                        _.each(userfriends, function (entry) {
                                            organizedOutput.push({
                                                _id: entry._id,
                                                username: entry.username,
                                                match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                                            });
                                        });
                                        res.json(organizedOutput);
                                        // In preperation to add some sort of pagination system
                                        //res.json(organizedOutput.slice(offset, offset + limit));
                                    });
                            } else {
                                res.json([{
                                    _id: "error",
                                    username: "Well... This is awkward too, maybe someone will eventually ask to be your friend?"
                                }]);
                            }
                        });
                    });
                },

                findfriends: function (username) {
                    // Get list of users related to username
                    var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
                    users.find(
                        {"_id": {$nin: [p_id]}, username: {$regex: new RegExp(username.toLowerCase(), "i")}},
                        "username", function (err, matches) {
                            // Have list of users, plus logged in user.
                            if (matches.length) {
                                var everyone = [p_id.toString()];
                                _.each(matches, function (entry) {
                                    everyone.push(entry._id.toString());
                                });
                                likes.find( // Get all users likes
                                    {"userRec._id": {$in: everyone}},
                                    "category name userRec._id",
                                    function (err, alllikes) {
                                        // Have all matches's likes
                                        var organizedLikes = {};
                                        var organizedOutput = [];
                                        // reorganize and filter the likes to be easier to compare
                                        _.each(alllikes, function (entry) {
                                            if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                                                organizedLikes[entry.userRec._id] = {};
                                            }
                                            if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                                                organizedLikes[entry.userRec._id][entry.category] = [];
                                            }
                                            organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                                        });
                                        // Cycle through the friends to compare their like rankings
                                        _.each(matches, function (entry) {
                                            organizedOutput.push({
                                                _id: entry._id,
                                                username: entry.username,
                                                match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                                            });
                                        });
                                        res.json(organizedOutput);
                                        // In preperation to add some sort of pagination system
                                        //res.json(organizedOutput.slice(offset, offset + limit));
                                    });
                            } else {
                                res.json([{
                                    _id: "error",
                                    username: "No matches found."
                                }]);
                            }
                        });
                },

                discoverfriends: function (userid) {
                    // List of users should have high similarity rankings to logged in user... not sure on how to do that yet
                    // Get list of users
                    var p_id = BSON.ObjectID.createFromHexString(userid);
                    users.findOne(
                        {"_id": {$in: [p_id]}},
                        "friends friendspending", function (err, friendslists) {
                            var friends = [p_id];
                            if (typeof friendslists.friends !== "undefined") {
                                _.each(friendslists.friends, function (friendid) {
                                    friends.push(BSON.ObjectID.createFromHexString(friendid));
                                });
                            }
                            // Now pull all non-friend users
                            users.find(
                                {"_id": {$nin: _.uniq(friends, false)}},
                                "username", function (err, newpeople) {
                                    // Have list of users, plus logged in user.
                                    if (newpeople.length) {
                                        var everyone = [p_id.toString()];
                                        _.each(newpeople, function (entry) {
                                            everyone.push(entry._id.toString());
                                        });
                                        likes.find( // Get all users likes
                                            {"userRec._id": {$in: everyone}},
                                            "category name userRec._id",
                                            function (err, alllikes) {
                                                // Have all matches's likes
                                                var organizedLikes = {};
                                                var organizedOutput = [];
                                                // reorganize and filter the likes to be easier to compare
                                                _.each(alllikes, function (entry) {
                                                    if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                                                        organizedLikes[entry.userRec._id] = {};
                                                    }
                                                    if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                                                        organizedLikes[entry.userRec._id][entry.category] = [];
                                                    }
                                                    organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                                                });
                                                // Cycle through the friends to compare their like rankings
                                                _.each(newpeople, function (entry) {
                                                    organizedOutput.push({
                                                        _id: entry._id,
                                                        username: entry.username,
                                                        match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                                                    });
                                                });
                                                res.json(organizedOutput);
                                                // In preperation to add some sort of pagination system
                                                //res.json(organizedOutput.slice(offset, offset + limit));
                                            });
                                    } else {
                                        res.json([{
                                            _id: "error",
                                            username: "You're friends with everyone already"
                                        }]);
                                    }
                                });
                        });
                },

                deletefriend: function (friendid) {
                    // remove relationship between logged in user and the friendid in friends and frendspending,
                    //  this is annoyingly easier than adding a friend
                    var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
                    var f_id = BSON.ObjectID.createFromHexString(friendid);

                    users.update(
                        {"_id": {$in: [p_id, f_id]}},
                        {
                            $pullAll: {
                                friends: [p_id.toString(), f_id.toString()],
                                friendspending: [p_id.toString(), f_id.toString()]
                            }
                        },
                        {
                            upsert: false,
                            multi: true
                        });
                    // Poor error checking, but not yet sure how to handle verifying both of the above steps before returning a value in async
                    return {
                        result: "deleted",
                        error: "none"
                    };
                },
                addfriend: function (friendid) {
                    // Create relationship between logged in user and the friendid
                    var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
                    var f_id = BSON.ObjectID.createFromHexString(friendid);
                    // Find logged in user, add friendID to friends
                    users.findAndModify(
                        {"_id": {$in: [p_id]}},
                        {$addToSet: {friends: f_id.toString()}},
                        {upsert: false}
                    );
                    // Find friend user, add logged in user's ID to pending list
                    users.update(
                        {"_id": {$in: [f_id]}},
                        {$addToSet: {friendspending: p_id.toString()}},
                        {upsert: false}
                    );
                    // Check if both users have "approved" or "added" one another
                    // If they have, remove from friendspending list. We confirm that friendid is part of the friends list just incase of bazaar errors(since it wouldn't have matched otherwise)
                    users.update( // Add friend to logged in user if other user has logged in user as friend
                        {
                            "_id": {$in: [p_id]},
                            "friends": {$in: [f_id.toString()]},
                            "friendspending": {$in: [f_id.toString()]}
                        },
                        {
                            $pullAll: {friendspending: [p_id.toString(), f_id.toString()]},
                            $addToSet: {friends: f_id.toString()}
                        },
                        {upsert: false, multi: true}
                    );
                    users.update( // Inverse of above
                        {
                            "_id": {$in: [f_id]},
                            "friends": {$in: [p_id.toString()]},
                            "friendspending": {$in: [p_id.toString()]}
                        },
                        {
                            $pullAll: {friendspending: [p_id.toString(), f_id.toString()]},
                            $addToSet: {friends: p_id.toString()}
                        },
                        {upsert: false, multi: true}
                    );
                    // Poor error checking, but not yet sure how to handle verifying both of the above steps before returning a value in async
                    return {
                        result: "added",
                        error: "none"
                    };
                }
            };

            var utility = {
                // Compare 2 lists of likes, split into their categories
                compareLikes: function (data, data2) {
                    // data and data2 are all the likes of two users, it's assumed data is logged in user,
                    //  but doesn't exactly matter since both users would see the same % responses anyhow
                    // Assumed organized as data[cateogory] = [item,item,item]
                    var categories = [];
                    var replydata = {};
                    if (typeof data === "undefined") {
                        data = {};
                    }
                    if (typeof data2 === "undefined") {
                        data2 = {};
                    }

                    // Get category labels from both lists
                    _.each(Object.keys(data), function (entry) {
                        categories.push(entry);
                    });
                    _.each(Object.keys(data2), function (entry) {
                        categories.push(entry);
                    });
                    categories.sort();
                    categories = _.uniq(categories, true); // Use underscore to ensure that we only have unique entries
                    _.each(categories, function (entry) { // Cycle through each category
                        // Obtain the intersection of likes for each category in both lists
                        if (typeof data[entry] === "undefined") {
                            data[entry] = {};
                        }
                        if (typeof data2[entry] === "undefined") {
                            data2[entry] = {};
                        }
                        var common = _.intersection(data[entry], data2[entry]);
                        if (data[entry].length > 0 && data2[entry].length > 0) {
                            var tempsize = 0;
                            // use size of largest list as divisor, this ensures both users see same %
                            if (data[entry].length >= data2[entry].length) {
                                tempsize = data[entry].length;
                            } else {
                                tempsize = data2[entry].length;
                            }
                            replydata[entry] = Math.round((common.length / tempsize) * 100);
                        } else {
                            if (data[entry].length > 0) {
                                replydata[entry] = Math.round((common.length / data[entry].length) * 100);
                            } else if (data2[entry].length > 0) {
                                replydata[entry] = Math.round((common.length / data2[entry].length) * 100);
                            } else {
                                replydata[entry] = 0;
                            }
                        }
                    });
                    return replydata;
                }
            };

            var action = req.params.action.toLowerCase();
            if (typeof reply[action] !== "undefined") {
                // Get logged in user's #id number
                var extra = req.session.currentUser._id;
                // If API passsed an "extra" param, means that we need to search something specific
                if (typeof req.body.extra !== "undefined") {
                    /* for existingfriends and discoverfriends, extra should be logged in user, but for searches in findfriends, extra should be set parameter */
                    extra = req.body.extra;
                }
                if (reply[req.params.action.toLowerCase()].length === 1) {
                    var temp = reply[req.params.action.toLowerCase()](extra);

                    // In preperation to add some sort of pagination system
                    //var temp = reply[req.params.action.toLowerCase()](extra, req.body.offset, req.body.limit);

                    // if temp returns an object, means the function didn't do anything on res
                    if (typeof temp === "object") {
                        res.json(temp);
                    }
                } else {
                    res.json({
                        error: "Invalid request"
                    });
                }
            } else { // api function doesn't exist
                res.json({
                    error: "Invalid request"
                });
            }
        }
    };
};

/* List user's current friends */
exports.list = function (req, res) {
    "use strict";
    if (typeof req.session.currentUser === "undefined") {
        res.redirect(307, "/login");
    } else {
        res.render("friend/list", {
            title: "List of friends",
            currentUser: req.session.currentUser
        });
    }
};
/* List friend requests */
exports.pending = function (req, res) {
    "use strict";
    if (typeof req.session.currentUser === "undefined") {
        res.redirect(307, "/login");
    } else {
        res.render("friend/pending", {
            title: "Friend Requests",
            currentUser: req.session.currentUser
        });
    }
};
/* Display the find-people screen */
exports.find = function (req, res) {
    "use strict";
    if (typeof req.session.currentUser === "undefined") {
        res.redirect(307, "/login");
    } else {
        res.render("friend/find", {
            title: "Friend search prompt and results",
            currentUser: req.session.currentUser
        });
    }
};
/* Display recommended friends */
exports.discover = function (req, res) {
    "use strict";
    if (typeof req.session.currentUser === "undefined") {
        res.redirect(307, "/login");
    } else {
        res.render("friend/discover", {
            title: "Recommended friends/Discover friends",
            currentUser: req.session.currentUser
        });
    }
};
