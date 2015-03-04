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
		console.log("FizzBuzz 1:");
		for(var i = 1; i <= 100; i++) {
			$verify(i);
		}
	};

	$fizzbuzz_2 = function (start, end) {
		console.log("FizzBuzz 2:");
		for (var i = start; i <= end; i++) {
			$verify(i);
		}
	};

	$fizzbuzz_3 = function (arr) {
		console.log("Fizzbuzz 3:");
		arr.forEach(function (value) {
			$verify(value);
		});
	}




	//$fizzbuzz_1();
	//$fizzbuzz_2(200,300);
	$fizzbuzz_3([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115]);
};

$(document).ready(main);