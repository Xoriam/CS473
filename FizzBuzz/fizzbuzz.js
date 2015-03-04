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

	$fizzbuzz_4 = function (obj) {
		console.log("Fizzbuzz 4:");
		for (var i = 1; i <= 100; i++) {
			if (i % 3 === 0 && i % 5 === 0) {
				console.log(obj.divisibleByThree + obj.divisibleByFive);
			} else if (i % 3 === 0) {
				console.log(obj.divisibleByThree);
			} else if(i % 5 === 0) {
				console.log(obj.divisibleByFive);
			} else {
				console.log(i);
			}
		}
	}

	$fizzbuzz_5 = function (arr, obj) {
		console.log("FizzBuzz 5:");
		arr.forEach(function (value) {
			if (value % 3 === 0 && value % 5 === 0) {
				console.log(obj.divisibleByThree + obj.divisibleByFive);
			} else if (value % 3 === 0) {
				console.log(obj.divisibleByThree);
			} else if(value % 5 === 0) {
				console.log(obj.divisibleByFive);
			} else {
				console.log(value);
			}
		});
	}

	$fizzbuzz_1();
	//$fizzbuzz_2(200,300);
	//$fizzbuzz_3([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115]);
	//$fizzbuzz_4({divisibleByThree: "foo", divisibleByFive: "bar"});
	//$fizzbuzz_5([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115],{divisibleByThree: "foo", divisibleByFive: "bar"});
};

$(document).ready(main);