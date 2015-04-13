/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
// Client-side code
$(document).ready(function(){
    "use strict";
    var searchKey ;
    $("#submit").click(function(){
        console.log("click");
        $("#results").empty();
        searchKey = $("#key").val();
        var myApi = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + searchKey + "&callback=searchTerm";
        $(function () {
            $.ajax({
                url: myApi,
                type: "GET",
                dataType: "jsonp",
                jsonp: "searchTerm",
                async: "true",
                success: function () {
                    alert("success");
                }
            });
        });
    });
});
function searchTerm(data) {
    "use strict";
    $("#results").append("<ul class='list-group'>");
    $.each(data.responseData.results, function(i, rows) {
        $("#results").append("<li class='list-group-info'>"+rows.title + "<br>" +"<a href='"+rows.url+"' >"+rows.url+"</a>"+"</br></li>");
    });
    $("#results").append("</ul>");
}