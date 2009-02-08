// Unit tests for the filter() function.

module("filter");

// An array of numbers.
var numArray = [1, 2, 3, 4, 5];

test("Should reduce the array to 1 using a RegExp.", function()
{
    var result = $a(numArray).filter(/1/);
    equals(result.toString(), "1", "Should equal 1");
});

test("Should reduce the array to 1 using a String.", function()
{
    var result = $a(numArray).filter("1");
    equals(result.toString(), "1", "Should equal 1");
});

test("Should reduce the array to to 1 using a Number.", function()
{
    var result = $a(numArray).filter(1);
    equals(result.toString(), "1", "Should equal 1");
});

test("Should reduce the array to 1 using an Object implementing toString().", function()
{
    var object = new Object();
    object.toString = function() { return "1"; };
    var result = $a(numArray).filter(object);
    equals(result.toString(), "1", "Should equal 1");
});

// An array of mixed values.
var mixedArray = [12, "foo", "bar", /regexp/, function() { return 2 + 2}, [3, "baz"]];

test("Should reduce the array to only strings and numbers.", function()
{
    var result = $a(mixedArray).filter(/^\w+$/);
    equals(result.toString(), "12,foo,bar", "Should contain only strings and numbers");
});

