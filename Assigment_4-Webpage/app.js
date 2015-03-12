/* References: Student - Christopher Danan
	Online - http://stackoverflow.com/questions/6266223/calling-imdbapi-com-with-jquery
*/

var main = function () {
	"use strict";

	var $movieDB, $url, $t, $type;

	$(".movieButton").on("click", function () {
		$url = "http://www.omdbapi.com/?t=";
		$t = $(".movieName").val();
		$(".movieName").val("");
		$t = $t.replace(/ /gi, "+");

		console.log($t);

		$.ajax ({
			url: $url + $t, 

			datatype: "json",

			success: function (movie) {
				movie = JSON.parse(movie);
				console.log(movie);

				var $img = $("<img>").hide();

				$img.attr("src", movie.Poster);
				
				$(".omdbapi").append($img);
				$img.fadeIn();
			},

			fail: function (response) {
				console.log("fail");
			}
		});
	})
};

$(document).ready(main);