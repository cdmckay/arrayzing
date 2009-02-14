// Unit tests for the core functions.

module("core");

test("Test Arrayzing constructor.", function()
{
    var array = [1, 2, 3];
    equals($a(1, 2, 3).toString(), array.join(), "The arrays should be equal");
    equals($a(array).toString(), array.join(), "The arrays should be equal");
    equals($a(array, "str").length, 2, "Test array as first argument and then something else");
    equals($a(1).toString(), "1", "Should be 1");
    equals($a(array, 4, 5)[0], array, "Should be the sub-array");
    equals($a().length, 0, "Should equal 0")

    // Test using an Arguments object as a single argument.
    var arguments = (function() { return arguments; })("x", "y", 1, 2);
    equals($a(arguments).length, 4, "Test length that results from using Arguments as the argument");

    // Make sure the constructor does not mistake a string for an array-like object.
    equals($a("string").length, 1, "Make sure constructor does not mistake String for array-like object")

    var $array = $a(array);
    var $$array = $a($array);
    equals($array.length, $$array.length, "Should be the same size");
});

test("Test the has() function.", function()
{
    var object = new Object();
    var $arr = $a(1, 2, 3, object, "string");

    equals($arr.has(1), true, "See if it contains a number it should");
    equals($arr.has("string"), true, "See if it contains a string it should");
    equals($arr.has(object), true, "See if it contains an object it should")
    equals($arr.has("anything"), false, "See if it contains something it shouldn't");
    equals($a().has("anything"), false, "See if an empty array contains something it shouldn't");
});

test("Test the hasKey() function.", function()
{
    var object = new Object();
    var $arr = $a(1, 2, 3, object, "string");

    equals($arr.hasKey(1), true, "See if it has a key it should");
    equals($arr.hasKey(200), false, "See if it has a key it shouldn't");
    equals((function() { var x = false; try { $arr.hasKey("foo"); } catch (error) { return true; }}).call(),
        true, "See if an exception is thrown for invalid input");
});

test("Test get() and set() functions.", function()
{    
    var $array = $a(1, 2, 3);
    equals($array.get(0), 1, "Should be 1");
    equals($array.get("0"), 1, "Should be 1");
    equals($array.get(-1), 3, "Should be 3");
    equals($array.get()[0], $array.toArray()[0] , "Should be equal");
    equals($array.get(-1000), undefined, "See if an non-existant negative index is undefined");

    equals($array.set(0, 0).str(), "0,2,3", "Try set using a positive index")
    equals($array.set(-1, 4).get(-1), 4, "Try set using a negative index");
    equals($array.set(5, 4).str(), "1,2,3,,,4", "Try set an non-existent positive index");
    equals($array.set(-1000, 42).str(), "1,2,3", "See if a non-existant negative index does nothing");
    equals($array.set("0", "bar").str(), "bar,2,3", "Try using a string as an index");
});

test("Test length and size().", function()
{
   var array = ["a", 2, /3/];
   equals($a().length, 0, "Test length of empty 'zing");
   equals($a(array).length, 3, "Test length of full 'zing");
   equals($a(array).length, $a(array).size(), "Make sure length and size() are the same");
});

test("Test remove() function.", function()
{
   var $array = $a(1, 2, 3, 4, 5);
   equals($array.remove(2).get(2), 4, "Try removing an element from the middle (positive)");
   equals($array.remove(-3).get(2), 4, "Try removing an element from the middle (negative)");
   equals($array.remove(1000).get().join(), "1,2,3,4,5", "Try removing a non existent index (positive)");
   equals($array.remove(-1000).get().join(), "1,2,3,4,5", "Try removing a non existent index (negative)");
   equals($a().remove(0).length, 0, "Try removing index 0 when there are no elements")
});
