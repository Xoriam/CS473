var main = function () {
	"use strict";

	var $fizzbuzz_1 = function () {
		console.log("FizzBuzz 1:\n");
		for(var i = 1; i <= 100; i++) {
			if (i % 3 === 0 && i % 5 === 0) {
				console.log("FizzBuzz");
			} else if (i % 3 === 0) {
				console.log("Fizz");
			} else if(i % 5 === 0) {
				console.log("Buzz");
			} else {
				console.log(i);
			}
		}
	};

	$fizzbuzz_1();
};

$(document).ready(main);