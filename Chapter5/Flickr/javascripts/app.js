var main = function () {
	"use strict";

	//This is actually just one string,
	//but I spread it out over two lines
	//to make it readable

	var url = "http://api.flickr.com/services/feeds/photos_public.gne?" + "tags=dogs&format=json&jsoncallback=?";

	$.getJSON(url, function (flickrResponse) {
		console.log(flickrResponse);
		flickrResponse.items.forEach(function (photo) {
			//Create a new jQuery element to hold the image
			//but hide it so we can fade it in
			var $img = $("<img>").hide();

			//set the attribute to the url
			//contained in the response
			$img.attr("src", photo.media.m);

			//attach the img tag to the main
			//photo element
			$("main .photos").append($img);
			$img.fadeIn();
		});
	});
};

$(document).ready(main);