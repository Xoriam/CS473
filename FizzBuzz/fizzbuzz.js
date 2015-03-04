var main = function () {
	"use strict";

	var $fizzbuzz_1, $fizzbuzz_2, $fizzbuzz_3, $fizzbuzz_4, $fizzbuzz_5, $verify;

	$verify = function (number) {
		if (number % 3 === 0 && number % 5 === 0) {
			console.log("FizzBuzz");
		} else if (number % 3 === 0) {
			console.log("Fizz");
		} else if(number % 5 === 0) {
			console.log("Buzz");
		} else {
			console.log(number);
		}
	};

	$fizzbuzz_1 = function () {
		console.log("FizzBuzz 1:\n");
		for(var i = 1; i <= 100; i++) {
			$verify(i);
		}
	};

	$fizzbuzz_2 = function(start, end) {
		console.log("FizzBuzz 2:\n");
		for (var i = start; i <= end; i++) {
			$verify(i);
		}
	};

	$fizzbuzz_3 = function




	$fizzbuzz_1();
	$fizzbuzz_2(200,300);
};

$(document).ready(main);