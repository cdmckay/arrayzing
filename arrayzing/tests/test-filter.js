// Unit tests for the filter() function.

module("filter");

test("Test filter", function()
{
    var numArray = [1, 2, 3, 4, 5];
    var result;

    result = $a(numArray).filter(/1/);
    equals(result.toString(), "1", "Try filtering using a simple RegExp");

    result = $a(numArray).filter("1");
    equals(result.toString(), "1", "Try filtering usign a string");

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

