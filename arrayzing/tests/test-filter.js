// Unit tests for the filter() function.

module("filter");

test("Test filter().", function()
{
    var numArray = [1, 2, 3, 4, 5];
    var result;

    result = $a(numArray).filter(/1/);
    equals(result.toString(), "1", "Try filtering using a simple RegExp");

    result = $a(numArray).filter("1");
    equals(result.toString(), "1", "Try filtering using a string");

    result = $a(numArray).filter(1);
    equals(result.toString(), "1", "Try filtering using a number");

    // An array of mixed values.
    var object = new Object();
    object.name = "unique";
    var mixedArray = [12, "foo", object, /regexp/, function() { return 2 }, Number.NaN, [3, "baz"], null, undefined];

    result = $a(mixedArray).filter(/^\w+$/);
    equals(result.toString(), "12,foo,NaN", "Try filtering using a more complex RegExp");

    result = $a(mixedArray).filter(object);
    equals(result[0].name, object.name, "Filter using a random object");

    result = $a(mixedArray).filter(null);
    equals(result[0], null, "Filter using null");

    result = $a(mixedArray).filter(undefined);
    equals(result[0], undefined, "Filter using undefined");

    result = $a(mixedArray).filter(Number.NaN);
    ok(isNaN(result[0]), "Filter using NaN");
});

test("Test only().", function()
{
    // Testing the only method, as well as numbers and strings aliases.
    var fn  = function(){return 2};
    var fn2 = function(){return 3};
    var testArray = [12, "hi", fn, new Object(), null, undefined, "foo", 99, 5, "bar", true, false];

    var result = $a(testArray).numbers();
    equals(result.toString(), "12,99,5", "Filter out by Number")

    result = $a(testArray).strings();
    equals(result.toString(), "hi,foo,bar", "Filter out by String");

    result = $a(testArray).only(Function)
    equals(result[0], fn, "Filter by Function");

    result = $a(testArray).only(Boolean);
    equals(result.toString(), "true,false", "Filter by Boolean");

    result = $a(testArray).only(fn2);
    equals(result.toString(), "", "Filter by function that doesn't exist");
});

