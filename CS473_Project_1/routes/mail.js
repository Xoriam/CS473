/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var BSON = require("mongodb").BSONPure,
    tableName = "messages";
/*
 OLD data used to test before mail was connected to the entire project.
 var someMail = [
 {"From": "Chris",
 "Friend_id" : "1234", 
 "To": "Mario Andrade",
 "Subject" : "The Test", 
 "Date" : "04/01/15",
 "Time" : "7:00:00 PM",
 "Body" : [
 {"friend_username" : "You guys totally sucked on that last exam! April Fools!"},
 {"username" : "We did our best D=<br/>That"s not very nice you know."},
 {"friend_username" : "April Fools! We"ll study harder next time, so I can get a 150% on it ;)"}
 ],
 "Read" : false
 },
 {"From": "Sarah", 
 "Friend_id" : "5678",
 "To": "Mario Andrade", 
 "Subject" : "Don"t ask!",
 "Date": "04/01/15",
 "Time" : "6:00:00 PM", 
 "Body" : [
 {"friend_username" : "I need a t-t-time machine!"}
 ],
 "Read" : false
 },
 {"From": "CornflowerBlue",
 "Friend_id" : "1111",
 "To": "Mario Andrade",
 "Subject" : "Why?",
 "Date": "04/01/15",
 "Time" : "5:40:10 PM", 
 "Body": [
 {"friend_username" : "Why do you dislike me so much?"}
 ],
 "Read" : false
 },
 {"From": "Yuri",
 "Friend_id" : "2222", 
 "To": "Mario Andrade",  
 "Date": "04/01/15",
 "Subject" : "Assignment 6",
 "Time" : "5:00:00 PM",
 "Body": [
 {"friend_username" : "I finished assignment 6 on my own. You"re off the group!"}
 ],
 "Read" : true
 },
 {"From": "Luigi",
 "Friend_id" : "9876", 
 "To": "Mario Andrade", 
 "Subject" : "No Worries, Bro",
 "Date": "04/01/15",
 "Time" : "4:00:00 PM",
 "Body": [
 {"friend_username" : "I saved the princess. No need to thank me."}
 ],
 "Read" : true
 }];
 */

//Respond to a GET from the user. We get from the database all the messages and render the mail.jade file.
exports.list = function (db) {
    "use strict";
    return function (req, res) {
        var collection = db.get(tableName);
        collection.find({}, {}, function (e, message) {
            res.render("mail", {
                title: "Mailbox - Responding to message.",
                mail: message,
                currentUser: req.session.currentUser
            });
        });
    };
};

exports.compose = function (req, res) {
    /*var someFriendsList = [
     {"Username": "Chris Danan"}]; unused test data*/
    "use strict";
    res.render("compose", {
        title: "Mailbox - Compose A Message",
        //friends: someFriendsList, unused param
        currentUser: req.session.currentUser
    });
};

/*This route is taken when a user composes a new message with another user.
 A new message object is created and added to the database. Once the response
 is saved in the database, the server redirects the user to mail.jade otherwise
 known as the list of messages.*/
exports.add = function (db) {
    "use strict";
    return function (req, res) {
        var userInfo = {
                username: req.session.currentUser.username,
                _id: req.session.currentUser._id
            },
            message = { //Message Template taken 
                "From": userInfo.username,
                //"Friend_id" : "2222",  This data is used before _id from the db was used.
                "To": req.body.Username,
                "Date": new Date(), //Timestamp, taken in UTC
                "Subject": req.body.Subject,
                "Body": [
                    {"friend_username": req.body.Message}
                ],
                "Read": false,
                "ParentMessage": ""
            };
        var collection = db.get(tableName);
        var collection2 = db.get(tableName);
        if (req.body.respond === "") {
            var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
                filter = {_id: BSON.ObjectID.createFromHexString(req.query._id)},
            //oldRecord = req.session.oldValues[0],
                updateList = {};
            updateList.Read = true;
            message.ParentMessage = obj_id;
            collection.insert(message, function (err, doc) {
                if (err) {
                    res.send("There is no database!");
                }
                else {
                    console.log("Project inserted successful");
                    collection2.update(filter, {$set: updateList}, {}, function (err, upd) {
                        if (err) {
                            res.send("Psh what database");
                        } else {
                            console.log("Parent Record updated successful");
                            res.location("mail");
                            res.redirect("mail");
                        }
                    });
                }
            });
        } else {
            console.log("message\n", message);
            collection.insert(message, function (err, doc) {
                if (err) {
                    res.send("There is no database!");
                }
                else {
                    console.log("Project inserted successful");
                    res.location("mail");
                    res.redirect("mail");
                }
            });
        }

    };
};

/*This route is to update the message that is currently viewed by the user as Read, and then display,
 said message, along with a response page.*/
exports.record = function (db) {
    "use strict";
    return function (req, res) {
        var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
            collection = db.get(tableName);
        collection.update({_id: obj_id}, {$set: {"Read": true}});
        collection.find({_id: obj_id}, {}, function (e, message) {
            console.log(message);
            for (var t in message) {
                console.log(message[t].Body);
            }
            res.render("respond", {
                "mail": message,
                "bod": message[t].Body,
                "IsEnabled": false,
                "currentUser": req.session.currentUser
            });
        });
    };
};
/*
 OLD route that was used to test whether the global data would be able to be returned to client side js which got scrapped.
 exports.query = function(req, res) {
 console.log(req.body);
 var object = someMail.forEach(function (values) {
 if (values.From === req.body.id) {
 return values;
 } else {
 return "Hello World";
 }

 console.log(object);

 //not working
 res.json(object);
 });
 }*/