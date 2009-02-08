// Unit tests for the filter() function.

module("sum");

// An array of numbers.
var numArray = [1, 2, 3, 4, 5];

test("Should sum up an array of numbers.", function()
{
    var result = $a(numArray).sum();
    equals(result.toString(), "15", "Should equal 15");
});

