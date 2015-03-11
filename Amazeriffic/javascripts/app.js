var main = function (toDoObjects) {
	"use strict";

	var toDos = toDoObjects.map(function (toDo) {
		return toDo.description;
	}),
	$inputToDo = $("<input type='text' class='inputBox'>"),
	$btn = $("<button class='button'>+</button>"),
	addCommentFromInputBox = function () {
		if ($inputToDo.val() !== "") {
			toDos.push($inputToDo.val());
			$inputToDo.val("");
		}
	};

	$(".tabs a span").toArray().forEach(function (element) {
		//Create a click handler for this event
		$(element).on("click", function () {
			// since we're using the jQuery version of element, 
			// we'll go ahead and create a temporary variable 
			// so we don't need to keep recreating it
			var $element = $(element), 
				$content;

			$(".tabs a span").removeClass("active");
			$(element).addClass("active");
			$("main .content").empty();

			if ($element.parent().is(":nth-child(1)")) {
				$content = $("<ul>");
				for (var i = toDos.length - 1; i >= 0; i--) {
					$content.append($("<li>").text(toDos[i]));
				}
				$("main .content").append($content);
			} else if ($element.parent().is(":nth-child(2)")) {
				$content = $("<ul>");
				toDos.forEach(function (todo) {
					$content.append($("<li>").text(todo));
				});
				$("main .content").append($content);
			} else if ($element.parent().is(":nth-child(3)")) {

				$btn.on("click", function (event) {
					addCommentFromInputBox();
				});

				$inputToDo.on("keypress", function (event) {
					if (event.keyCode === 13) {
						addCommentFromInputBox();
					}
				});

				$("main .content").append($inputToDo);
				$("main .content").append($btn);

			} else if ($element.parent().is(":nth-child(4)")) {
				$("main .content").append($("<h3>").text("Amazeriffic Tabs Screenshots"));
				$("main .content").append($("<div class='gallery'>"));
				$("main .content .gallery").append($("<p><a class = 'pictures' href='images/newestTab.png' title='Ameriffic Main Tab'><img src='images/newestTab.png' alt='Tab shows to do list in order of newest items first' width='1342' height='889' class='screenshot'></a></p>"));

				//$("main .content .gallery").append($("<p><a class = 'pictures' href='../images/oldestTab.png' title='Oldest Items First'><img src='../images/oldestTab.png' alt='Items are placed from eldest to youngest' width='1342' height='889' class='screenshot'></a></p>"));

				//$("main .content .gallery").append($("<p><a class = 'pictures' href='images/addTab.png' title='Adding A New Item'><img src='images/addTab.png' alt='Screenshot 3 of Amazeriffic in action' width='1342' height='889' class='screenshot'></a></p>"));

				$("main .content").append($("</div>"));

				$(".pictures").colorBox();
			}

			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
	$.getJSON("todos.json", function (toDoObjects) {
		//call main with the to-dos as an argument
		main(toDoObjects);
	});
});