// Unit tests for the filter() function.

module("filter");

test("Test filter().", function()
{
    var numArray = [1, 2, 3, 4, 5];
    var result;

    result = _(numArray).filter(/1/);
    equals(result.toString(), "1", "Try filtering using a simple RegExp");

    result = _(numArray).filter("1");
    equals(result.toString(), "1", "Try filtering using a string");

    result = _(numArray).filter(1);
    equals(result.toString(), "1", "Try filtering using a number");

    // An array of mixed values.
    var object = new Object();
    object.name = "unique";
    var mixedArray = [12, "foo", object, /regexp/, function() { return 2 }, Number.NaN, [3, "baz"], null, undefined];

    result = _(mixedArray).filter(/^\w+$/);
    equals(result.toString(), "12,foo,NaN", "Try filtering using a more complex RegExp");

    result = _(mixedArray).filter(object);
    equals(result[0].name, object.name, "Filter using a random object");

    result = _(mixedArray).filter(null);
    equals(result[0], null, "Filter using null");

    result = _(mixedArray).filter(undefined);
    equals(result[0], undefined, "Filter using undefined");
	
    var fn = function(item) { return item == 12 || item == "foo"; };
    result = _(mixedArray).filter(fn);
    equals(result.length, 2, "Filter using a function, make sure length is right");
    equals(result.str(), "12,foo", "Filter using a function, make sure elements are right");

    result = _(mixedArray).filter(isNaN);
    ok(isNaN(result[0]), "Filter using NaN");
});

test("Test remove().", function()
{
    var numArray = [1, 2, 3, 4, 5];
    var result;

    result = _(numArray).remove(/1/);
    equals(result.str(), "2,3,4,5", "Try removing using a simple RegExp");

    result = _(numArray).remove("1");
    equals(result.str(), "2,3,4,5", "Try removing using a string");

    result = _(numArray).remove(1);
    equals(result.str(), "2,3,4,5", "Try removing using a number");

    // An array of mixed values.
    var object = new Object();
    object.name = "unique";
    var mixedArray = [12, "foo", object, /regexp/, function() { return 2 },
        Number.NaN, [3, "baz"], null, undefined];

    result = _(mixedArray).remove(object);
    ok(!result.contains(object), "Remove using a random object");

    result = _(mixedArray).remove(null);
    ok(!result.contains(null), "Remove using null");

    result = _(mixedArray).remove(undefined);
    ok(!result.contains(undefined), "Remove using undefined");

    var fn = function(item) { return item == 12 || item == "foo"; };
    result = _(mixedArray).remove(fn);
    ok(!result.contains(12) || result.contains("foo"),
        "Remove using a function, make sure length is right");

    result = _(mixedArray).remove(isNaN);
    ok(!result.contains(isNaN), "Remove using NaN");
});

test("Test compare(), gt(), lt(), etc. functions.", function()
{
    var $num = _(214, 12, 12311, 0);
    var $str = _("a", "b", "ccc", "cookie", "");
    var $arr = _([1, 2, 3], [3], [], [4]);
    var $mixed = $num.addAll($str).addAll($arr);

    equals($num.eq(12)[0], 12, "Test equals on a number zing");
    equals($num.gt(12).join(), "214,12311", "Test gt on a number zing");
    equals($num.gteq(12).join(), "214,12,12311", "Test gteq on a number zing");
    equals($num.lt(14).join(), "12,0", "Test lt on a number zing");
    equals($num.lteq(12).join(), "12,0", "Test lteq on a number zing");

    equals($str.ofLength(3)[0], "ccc", "Test ofLength on a string zing");
    equals($str.gt(1).join(), "ccc,cookie", "Test gt on a string zing");
    equals($str.gteq(1).join(), "a,b,ccc,cookie", "Test gteq on a string zing");
    equals($str.lt(3).join(), "a,b,", "Test lt on a string zing");
    equals($str.lteq(3).join(), "a,b,ccc,", "Test lteq on a string zing");

    equals($arr.ofLength(3)[0].join(), "1,2,3", "Test ofLength on an array zing");
    equals($arr.gt(1)[0].join(), "1,2,3", "Test gt on an array zing");
    equals($arr.gteq(1).length, 3, "Test gteq on an array zing");
    equals($arr.lt(3).length, 3, "Test lt on an array zing");
    equals($arr.lteq(3).length, 4, "Test lteq on an array zing");

    equals($mixed.ofLength(3).length, 2, "Test ofLength on a mixed zing");
    equals($mixed.gt(1).length, 6, "Test gt on a mixed zing");
    equals($mixed.gteq(1).length, 10, "Test gteq on a mixed zing");
    equals($mixed.lt(3).length, 7, "Test lt on a mixed zing");
    equals($mixed.lteq(3).length, 9, "Test lteq on a mixed zing");
});

test("Test just() function.", function()
{
    var $zing = _(1, 2, 3);

    equals($zing.just(0), 1, "Try reducing to an element (positive)");
    equals($zing.just(-1), 3, "Try reducing to an element (negative)");
    equals($zing.just(0).length, 1, "Make sure length is right!");
    equals($zing.just(1000).length, 0, "Try reducing to an non-existant element");
    equals($zing.just([0, 1]).str(), "1,2", "Try reducing to the first two elements");
    equals($zing.just([0, 2]).str(), "1,3", "Try reducing to the first and third elements");
});

test("Test only().", function()
{
    // Testing the only method, as well as numbers and strings aliases.
    var fn  = function(){return 2};
    var fn2 = function(){return 3};
    var arr = [12, "hi", fn, new Object(), null, undefined, "foo", 99, 5, "bar", true, false];

    var result1 = _(arr).numbers();
    var result2 = _(arr).numbers$();
    equals(result1.toString(), "12,99,5", "Filter out by Number")
    equals(result2.toString(), "12,99,5", "Filter out by Number (mutator)")

    result1 = _(arr).strings();
    result2 = _(arr).strings$();
    equals(result1.toString(), "hi,foo,bar", "Filter out by String");
    equals(result2.toString(), "hi,foo,bar", "Filter out by String (mutator)");

    result1 = _(arr).only(Function)
    equals(result1[0], fn, "Filter by Function");

    result1 = _(arr).only(Boolean);
    equals(result1.toString(), "true,false", "Filter by Boolean");

    result1 = _(arr).only(fn2);
    equals(result1.toString(), "", "Filter by function that doesn't exist");
});

test("Test tighten().", function()
{
    var $list = _("a", "", [], [1, 2], undefined, 9, null, NaN);

    equals(_().tighten().length, 0, "Try tighten on an empty zing");
    equals($list.tighten().length, 3, "Make sure tighten produces the correct array length");
    equals($list.tighten().str(), "a,1,2,9", "Make sure tighten produces the correct array elements");

    equals($list.tighten().undo().length, 8, "Test tighten with undo (non-mutator)");
    equals($list.add("").tighten$().undo().length, 8, "Test tighten with undo (mutator)");

    var $num = _(4, 9, "", NaN, 16);
    equals($num.add(4).tighten$().map$(Math.sqrt).merge().str(), "2,3,,NaN,4,2",
        "Test tighten() with merge()");
});

test("Test undo().", function()
{
    var arr = [1, 2, 3];
    var $arr = _(arr);

    equals($arr.add(4, 5, 6).undo(), $arr, "Test basic undo behaviour");
    equals($arr.add(4).add(5).undo().length, 4, "Test a little bit more complicated stuff");
    equals($arr.undo().undo().undo().length, 0, "Test calling end repeatedly, even if there are no previous sets");

    // Test with array functions.

    // set()
    $arr = _(arr);
    equals($arr.set(0, 5).undo(), $arr, "set: Make sure undo works with non-mutator");
    equals($arr.set$(0, 5).undo().str(), "", "set$: Make sure undo works with mutator");

    // add()
    $arr = _(arr);
    equals($arr.add(4).undo(), $arr, "add: Make sure undo works with non-mutator");
    equals($arr.add$(4).undo().str(), "", "add$: Make sure undo works with mutator");

    // reverse()
    $arr = _(arr);
    equals($arr.reverse().undo(), $arr, "reverse: Make sure undo works with non-mutator");
    equals($arr.reverse$().undo().length, 0, "reverse$: Make sure undo works with mutator");

    // addAll()
    $arr = _(arr);
    equals($arr.add(4).addAll([5,6]).undo().str(), "1,2,3,4", "addAll: Make sure undo works with non-mutator");

    // prechop()
    $arr = _("lol", "olo");
    equals($arr.prechop().prechop().undo().str(), "ol,lo", "prechop: Make sure undo works with non-mutator");
    equals($arr.add("foo").prechop$().undo().str(), "lol,olo", "prechop: Make sure undo works with mutator");

    // Test with many different functions.
    equals($arr.clear().undo(), $arr, "Make sure clear works with undo");
});

test("Test andSelf().", function()
{
    var $arr = _("str", function() { return 42; }, false, 4);
});
