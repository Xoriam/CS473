var main = function () {
	"use strict";

	//This is actually just one string,
	//but I spread it out over two lines
	//to make it readable

	var url = "http://api.flickr.com/services/feeds/photos_public.gne?" + "tags=dogs&format=json&jsoncallback=?";

	$.getJSON(url, function (flickrResponse) {
		//We'll simply print the response to the console
		//for the time being
		console.log(flickrResponse);
	});
};

$(document).ready(main);