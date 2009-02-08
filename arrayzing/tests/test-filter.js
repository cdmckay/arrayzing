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

// An array of mixed values.
var object = new Object();
object.name = "unique";
var mixedArray = [12, "foo", object, /regexp/, function() { return 2 }, NaN, [3, "baz"], null, undefined];

test("Should reduce the array to only strings and numbers.", function()
{
    var result = $a(mixedArray).filter(/^\w+$/);
    equals(result.toString(), "12,foo,NaN", "Should contain only strings and numbers");
});

test("Should filter out everything except a particular object.", function()
{
    var result = $a(mixedArray).filter(object);
    equals(result[0].name, object.name, "Should be the same object");
});

test("Should return null when passed null if a null is in the array.", function()
{
    var result = $a(mixedArray).filter(null);
    equals(result[0], null, "Should be null");
});

test("Should return any undefineds it finds in the array.", function()
{
    var result = $a(mixedArray).filter(undefined);
    equals(result[0], undefined, "Should return undefined");
});

test("Should return any NaNs it finds in the array.", function()
{
    var result = $a(mixedArray).filter(NaN);
    ok(isNaN(result[0]), "Should return true");
});

