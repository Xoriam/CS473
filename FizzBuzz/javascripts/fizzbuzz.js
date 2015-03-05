var main = function () {
	"use strict";

	var $fizzbuzz_1, $fizzbuzz_2, $fizzbuzz_3, $fizzbuzz_4, $fizzbuzz_5, $verify, $content;

	$verify = function (number) {
		if (number % 3 === 0 && number % 5 === 0) {
			return "FizzBuzz";
		} else if (number % 3 === 0) {
			return "Fizz";
		} else if(number % 5 === 0) {
			return "Buzz";
		} else {
			return number;
		}
	};

	$fizzbuzz_1 = function () {
		$content = $("<ul>");
		for(var i = 1; i <= 100; i++) {
			$content.append($("<li>").text($verify(i)));
		}
		$(".fizzbuzz-1").append($content);
	};

	$fizzbuzz_2 = function (start, end) {
		$content = $("<ul>");
		for (var i = start; i <= end; i++) {
			$content.append($("<li>").text($verify(i)));
		}
		$(".fizzbuzz-2").append($content);
	};

	$fizzbuzz_3 = function (arr) {
		$content = $("<ul>");
		arr.forEach(function (value) {
			$content.append($("<li>").text($verify(value)));
		});
		$(".fizzbuzz-3").append($content);
	}

	$fizzbuzz_4 = function (obj) {
		$content = $("<ul>");
		for (var i = 1; i <= 100; i++) {
			if (i % 3 === 0 && i % 5 === 0) {
				$content.append($("<li>").text(obj.divisibleByThree + obj.divisibleByFive));
			} else if (i % 3 === 0) {
				$content.append($("<li>").text(obj.divisibleByThree));
			} else if(i % 5 === 0) {
				$content.append($("<li>").text(obj.divisibleByFive));
			} else {
				$content.append($("<li>").text(i));
			}
		}
		$(".fizzbuzz-4").append($content);
	}

	$fizzbuzz_5 = function (arr, obj) {
		$content = $("<ul>");
		arr.forEach(function (value) {
			if (value % 3 === 0 && value % 5 === 0) {
				$content.append($("<li>").text(obj.divisibleByThree + obj.divisibleByFive));
			} else if (value % 3 === 0) {
				$content.append($("<li>").text(obj.divisibleByThree));
			} else if(value % 5 === 0) {
				$content.append($("<li>").text(obj.divisibleByFive));
			} else {
				$content.append($("<li>").text(value));
			}
		});
		$(".fizzbuzz-5").append($content);
	}

	$fizzbuzz_1();
	$fizzbuzz_2(200,300);
	$fizzbuzz_3([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115]);
	$fizzbuzz_4({divisibleByThree: "foo", divisibleByFive: "bar"});
	$fizzbuzz_5([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115],{divisibleByThree: "foo", divisibleByFive: "bar"});
};

$(document).ready(main);