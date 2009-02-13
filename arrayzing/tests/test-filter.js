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

test("Test compare(), moreThan(), lessThan(), etc. functions.", function()
{
    var $num = $a(214, 12, 12311, 0);
    var $str = $a("a", "b", "ccc", "cookie", "");
    var $arr = $a([1, 2, 3], [3], [], [4]);
    var $mixed = $num.concat($str).concat($arr);

    equals($num.equals(12)[0], 12, "Test equals on a number zing");
    equals($num.moreThan(12).join(), "214,12311", "Test moreThan on a number zing");
    equals($num.moreThanEq(12).join(), "214,12,12311", "Test moreThanEq on a number zing");
    equals($num.lessThan(14).join(), "12,0", "Test lessThan on a number zing");
    equals($num.lessThanEq(12).join(), "12,0", "Test lessThanEq on a number zing");

    equals($str.lengthOf(3)[0], "ccc", "Test lengthOf on a string zing");
    equals($str.moreThan(1).join(), "ccc,cookie", "Test moreThan on a string zing");
    equals($str.moreThanEq(1).join(), "a,b,ccc,cookie", "Test moreThanEq on a string zing");
    equals($str.lessThan(3).join(), "a,b,", "Test lessThan on a string zing");
    equals($str.lessThanEq(3).join(), "a,b,ccc,", "Test lessThanEq on a string zing");

    equals($arr.lengthOf(3)[0].join(), "1,2,3", "Test lengthOf on an array zing");
    equals($arr.moreThan(1)[0].join(), "1,2,3", "Test moreThan on an array zing");
    equals($arr.moreThanEq(1).length, 3, "Test moreThanEq on an array zing");
    equals($arr.lessThan(3).length, 3, "Test lessThan on an array zing");
    equals($arr.lessThanEq(3).length, 4, "Test lessThanEq on an array zing");

    equals($mixed.lengthOf(3).length, 2, "Test lengthOf on a mixed zing");
    equals($mixed.moreThan(1).length, 6, "Test moreThan on a mixed zing");
    equals($mixed.moreThanEq(1).length, 10, "Test moreThanEq on a mixed zing");
    equals($mixed.lessThan(3).length, 7, "Test lessThan on a mixed zing");
    equals($mixed.lessThanEq(3).length, 9, "Test lessThanEq on a mixed zing");
});

test("Test just() function.", function()
{
    var $zing = $a(1, 2, 3);

    equals($zing.just(0), 1, "Try reducing to an element (positive)");
    equals($zing.just(-1), 3, "Try reducing to an element (negative)");
    equals($zing.just(0).length, 1, "Make sure length is right");
    equals($zing.just(1000).length, 0, "Try reducing to an non-existant element");
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

