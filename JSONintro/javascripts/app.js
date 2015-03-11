var main = function () {
	"use strict";

	console.log("Hello World!");

	//getJSON even parses the JSON for us, so we don't need to call JSON.parse
	$.getJSON("cards/aceOfSpades.json", function (card) {
		
		//Create an element to hold the card
		var $cardParagraph = $("<p>");

		//Add text to the paragraph element
		$cardParagraph.text(card.rank + " of " + card.suit);

		//Append the card paragraph to main
		$("main").append($cardParagraph);

	});

	$.getJSON("cards/hand.json", function (hand) {
		var $list = $("<ul>");

		//hand is an array, so we can iterate over it using a forEach loop
		hand.forEach(function (card){
			//Create a list item to hold the card
			var $card = $("<li>");
			$card.text(card.rank + " of " + card.suit);
			$list.append($card);
		});

		//append the list to main
		$("main").append($list);
	});
};

$(document).ready(main);