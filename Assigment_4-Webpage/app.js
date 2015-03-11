/* References: Student - Christopher Danan
	Online - http://stackoverflow.com/questions/6266223/calling-imdbapi-com-with-jquery
*/

var main = function () {
	"use strict";

	var $movieDB, $url, $t, $type;

	$(".movieButton").on("click", function () {
		$url = "http://www.imdbapi.com/?t=";
		$t = $(".movieName").val();
		$t = $t.replace(/ /gi, "+");

		console.log($t);

		$.ajax ({
			url: $url + $t, 

			datatype: "json",

			success: function (movie) {
				movie = JSON.parse(movie);
				console.log(movie.Poster);

				var $title = $("<a>");
				var $img = $("<img>").hide();

				$title.attr("href", movie.Poster);

				$img.attr("src", movie.Poster);
				$(".imdbapi").append($title);
				$(".imdbapi").append($img);
				$img.fadeIn();
			},

			fail: function (response) {
				console.log("fail");
			}
		});
	})
};

$(document).ready(main);