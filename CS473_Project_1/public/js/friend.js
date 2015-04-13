/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
/*
 * References:
 * * https://api.jquery.com/
 * * http://getbootstrap.com/
 */
var friend = function () {
    "use strict";

    /* Buttons/action functions */
    var action = {
        /* Forwards to the sendmail url */
        sendmail: function (userid) {
            window.location.href = "/compose?_id=" + userid;
        },
        /* Runs API call to add userid to friends list */
        addfriend: function (userid) {
            var payload = {
                extra: userid
            };
            $.post("/friend/api/addfriend", payload, function () {
                if ($("input#searchName").val() === undefined) {
                    loadData(0, 4);
                } else {
                    action.search();
                }
            }, "json");
        },
        /* Runs API call to remove userid from friends list */
        deletefriend: function (userid) {
            var payload = {extra: userid};
            $.post("/friend/api/deletefriend", payload, function () {
                loadData(0, 4);
            }, "json");
        },
        /* Runs API calls to get next set of users, and pass that data back to the output functions */
        /* TODO: pagination is incomplete */
        next: function () {
            var limit = 4;
            var last = $("div.existingfriends .col-md-3, div.discoverfriends .col-md-3, div.findfriends .col-md-3")
                .last();
            last = last.attr("id").split("-");
            loadData(last[1], limit);
        },
        prev: function () {
            var limit = -4;
            var last = $("div.existingfriends .col-md-3, div.discoverfriends .col-md-3, div.findfriends .col-md-3")
                .first();
            last = last.attr("id").split("-");
            loadData(last[1], limit);
        },
        search: function () {
            var limit = 4;
            var name = $("input#searchName").val();
            loadData(0, limit, name);
        }
    };

    /* Click hooks for all the friends pages */
    var registerClickhooks = function () {
        $("a.sendmail, a.addfriend, a.deletefriend")
            .click(function (event) {
                event.preventDefault();
                var arr = $(this)
                    .attr("href")
                    .replace("#", "")
                    .split("-");
                action[arr[0]](arr[1]);
            });
        $("a#prev,a#next")
            .click(function (event) {
                event.preventDefault();
                var arr = $(this)
                    .attr("id");
                action[arr]();
                // getJSON update screen
            });
        $("form#searchForm button")
            .click(function (event) {
                event.preventDefault();
                action.search();
                //$("input#searchName").val(""); // Resets the search field
            });
    };

    /* Misc functions */
    var renderMatches = function (data) { // Expected match: [{Key:Val}]
        var progressCluster = $("<div/>", {
            class: "match"
        });
        if (typeof data.match !== "undefined") {
            $.each(data.match, function (key, val) {
                progressCluster.append(
                    //                    $("<a/>", {href: "/user/" + data.id + "/" + key.toLocaleLowerCase()}).text(key)
                    $("<a/>", {
                        href: "#"
                    })
                        .text(key)
                )
                    .append(
                    $("<div/>", {
                        class: "progress"
                    })
                        .append(
                        $("<div/>", {
                            class: "progress-bar",
                            role: "progressbar",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            "aria-valuenow": val,
                            style: "width: " + val + "%"
                        })
                            .text(val + "%")
                    )
                );
            });
        }
        return progressCluster;
    };

    /* display/output functions */
    /* TODO: needs to be reorganized to come up with and maintain some sort of numerical index instead of id numbers.
     * TODO: Pagination is still incomplete */
    var output = {
        // existingfriends "users" expects : [{id:"#",name:"Name",img:"url?",match:{Category:30}}]
        existingfriends: function (users) {
            var userData = $("<div/>", {
                class: "row existingfriends"
            });
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {
                        class: "col-md-3",
                        id: "userid-" + val._id
                    })
                        .append(
                        $("<div/>", {
                            class: "thumbnail"
                        })
                            .append(
                            // TODO: Swap with user image
                            $("<img/>", {
                                src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="
                            })
                        )
                            .append(
                            $("<div/>", {
                                class: "caption"
                            })
                                .append(
                                // Swap with user profile URL TODO: DOUBLE CHECK THIS
                                $("<a/>", {
                                    href: "/viewotheruser?_id=" + val._id
                                })
                                    .append(
                                    // Replace with user's display name
                                    $("<h3/>")
                                        .text(val.username)
                                )
                            )
                                .append(
                                renderMatches(val)
                            )
                                .append(
                                $("<div/>", {
                                    class: "actions"
                                })
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default sendmail",
                                        href: "#sendmail-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-envelope",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default deletefriend",
                                        href: "#deletefriend-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-trash",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.existingfriends")
                .replaceWith(userData);
        },
        friendspending: function (users) {
            var userData = $("<div/>", {
                class: "row friendspending"
            });
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {
                        class: "col-md-3",
                        id: "userid-" + val._id
                    })
                        .append(
                        $("<div/>", {
                            class: "thumbnail"
                        })
                            .append(
                            // TODO:Swap with user image
                            $("<img/>", {
                                src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="
                            })
                        )
                            .append(
                            $("<div/>", {
                                class: "caption"
                            })
                                .append(
                                // Swap with user profile URL TODO: DOUBLE CHECK THIS
                                $("<a/>", {
                                    href: "/viewotheruser?_id=" + val._id
                                })
                                    .append(
                                    // Replace with user's display name
                                    $("<h3/>")
                                        .text(val.username)
                                )
                            )
                                .append(
                                renderMatches(val)
                            )
                                .append(
                                $("<div/>", {
                                    class: "actions"
                                })
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default sendmail",
                                        href: "#sendmail-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-envelope",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default addfriend",
                                        href: "#addfriend-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-plus",
                                            "aria-hidden": "true"
                                        })
                                    )
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-user",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default deletefriend",
                                        href: "#deletefriend-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-minus",
                                            "aria-hidden": "true"
                                        })
                                    )
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-user",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.friendspending")
                .replaceWith(userData);
        },
        findfriends: function (users) {
            var userData = $("<div/>", {
                class: "row findfriends"
            });
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {
                        class: "col-md-3",
                        id: "userid-" + val._id
                    })
                        .append(
                        $("<div/>", {
                            class: "thumbnail"
                        })
                            .append(
                            // Swap with user image
                            $("<img/>", {
                                src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="
                            })
                        )
                            .append(
                            $("<div/>", {
                                class: "caption"
                            })
                                .append(
                                // Swap with user profile URL
                                //$("<a/>", {href: "/user/" + val._id}).append(
                                $("<a/>", {
                                    href: "/viewotheruser?_id=" + val._id
                                })
                                    .append(
                                    // Replace with user's display name
                                    $("<h3/>")
                                        .text(val.username)
                                )
                            )
                                .append(
                                // Create a progress bar generator here
                                renderMatches(val)
                            )
                                .append(
                                $("<div/>", {
                                    class: "actions"
                                })
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default sendmail",
                                        href: "#sendmail-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-envelope",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default addfriend",
                                        href: "#addfriend-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-plus",
                                            "aria-hidden": "true"
                                        })
                                    )
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-user",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.findfriends")
                .replaceWith(userData);
        },
        discoverfriends: function (users) {
            var userData = $("<div/>", {
                class: "row discoverfriends"
            });
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {
                        class: "col-md-3",
                        id: "userid-" + val._id
                    })
                        .append(
                        $("<div/>", {
                            class: "thumbnail"
                        })
                            .append(
                            // Swap with user image
                            $("<img/>", {
                                src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="
                            })
                        )
                            .append(
                            $("<div/>", {
                                class: "caption"
                            })
                                .append(
                                // Swap with user profile URL
                                //$("<a/>", {href: "/user/" + val._id}).append(
                                $("<a/>", {
                                    href: "/viewotheruser?_id=" + val._id
                                })
                                    .append(
                                    // Replace with user's display name
                                    $("<h3/>")
                                        .text(val.username)
                                )
                            )
                                .append(
                                // Create a progress bar generator here
                                renderMatches(val)
                            )
                                .append(
                                $("<div/>", {
                                    class: "actions"
                                })
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default sendmail",
                                        href: "#sendmail-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-envelope",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                                    .append(
                                    $("<a/>", {
                                        class: "btn btn-default addfriend",
                                        href: "#addfriend-" + val._id
                                    })
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-plus",
                                            "aria-hidden": "true"
                                        })
                                    )
                                        .append(
                                        $("<span/>", {
                                            class: "glyphicon glyphicon-user",
                                            "aria-hidden": "true"
                                        })
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.discoverfriends")
                .replaceWith(userData);
        }
    };

    /* Page specific logic on pageload */
    var loadData = function (offset, limit, extra) {
        var mainElement = $("div.existingfriends, div.discoverfriends, div.findfriends, div.friendspending");
        if (mainElement.length) {
            mainElement = mainElement[0].classList[1];
            switch (mainElement) {
                case "discoverfriends":
                case "findfriends":
                case "friendspending":
                case "existingfriends":
                    var payload = {
                        offset: offset,
                        limit: limit
                    };
                    if (typeof extra !== "undefined") {
                        payload.extra = extra;
                    }
                    $.post("/friend/api/" + mainElement, payload, function (response) {
                        output[mainElement](response);
                        registerClickhooks();
                    }, "json");
                    break;
                default:
                    break;
            }
        }
    };
    loadData(0, 4);
};
$(document).ready(friend);