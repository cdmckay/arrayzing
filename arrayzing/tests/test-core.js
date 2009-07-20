// Unit tests for the core functions.

module("core");

test("Test Arrayzing constructor.", function()
{
    var array = [1, 2, 3];
    equals(_(1, 2, 3).toString(), array.join(), "The arrays should be equal");
    equals(_(array).toString(), array.join(), "The arrays should be equal");
    equals(_(array, "str").length, 2, "Test array as first argument and then something else");
    equals(_(1).toString(), "1", "Should be 1");
    equals(_(array, 4, 5)[0], array, "Should be the sub-array");
    equals(_().length, 0, "Should equal 0")

    // Test using an Arguments object as a single argument.
    var arguments = (function() { return arguments; })("x", "y", 1, 2);
    equals(_(arguments).length, 4, "Test length that results from using Arguments as the argument");

    // Make sure the constructor does not mistake a string for an array-like object.
    equals(_("string").length, 1, "Make sure constructor does not mistake String for array-like object")

    var $array = _(array);
    var $$array = _($array);
    equals($array.length, $$array.length, "Should be the same size");
});

test("Test the contains() function.", function()
{
    var object = new Object();
    var $arr = _(1, 2, 3, object, "string");

    equals($arr.contains(1), true, "See if it contains a number it should");
    equals($arr.contains("string"), true, "See if it contains a string it should");
    equals($arr.contains(object), true, "See if it contains an object it should")
    equals($arr.contains("anything"), false, "See if it contains something it shouldn't");
    equals(_().contains("anything"), false, "See if an empty array contains something it shouldn't");
});

test("Test the hasKey() function.", function()
{
    var object = new Object();
    var $arr = _(1, 2, 3, object, "string");

    equals($arr.hasKey(1), true, "See if it has a key it should");
    equals($arr.hasKey(200), false, "See if it has a key it shouldn't");   
});

test("Test get() and set() functions.", function()
{    
    var $array = _(1, 2, 3);
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
   equals(_().length, 0, "Test length of empty 'zing");
   equals(_(array).length, 3, "Test length of full 'zing");
   equals(_(array).length, _(array).size(), "Make sure length and size() are the same");
});

test("Test removeAt() function.", function()
{
   var array = [1, 2, 3, 4, 5];
   var $array = _(array);
   equals($array.removeAt(2).get(2), 4, "Try removing an element from the middle (positive)");
   equals($array.removeAt(2, 2).get(2), 5, "Try removing 2 elements from the middle (positive)");
   equals($array.removeAt(-3).get(2), 4, "Try removing an element from the middle (negative)");
   equals($array.removeAt(-3, 2).get(2), 5, "Try removing 2 element from the middle (negative)");
   equals($array.removeAt(1000).str(), "1,2,3,4,5", "Try removing a non existent index (positive)");
   equals($array.removeAt(1000, 2).str(), "1,2,3,4,5", "Try removing multiple non existent indices (positive)");
   equals($array.removeAt(-1000).str(), "1,2,3,4,5", "Try removing a non existent index (negative)");
   equals(_().removeAt(0).length, 0, "Try removing index 0 when there are no elements");
   equals(_().removeAt(0, 2).length, 0, "Try removing index 0 and 1 when there are no elements");

   // Test merge.
   equals(_(array).map(function(x) { return x * x; }).removeAt$(1).merge().str(),
     "1,2,9,16,25", "Test merge()");
});

test("Test insertAt() function.", function()
{
   var array = [1, 2, 3, 4, 5];
   var $array = _(array);
   equals($array.insertAt(1, 1.5).str(), "1,1.5,2,3,4,5", "Try inserting element in middle (positive)");
   equals($array.insertAt(1, 1.3, 1.7).str(), "1,1.3,1.7,2,3,4,5", "Try inserting 2 elements in middle (positive)");
   equals($array.insertAt(-1, 4.5).str(), "1,2,3,4,4.5,5", "Try inserting element in middle (negative)");
   equals($array.insertAt(-1, 4.3, 4.7).str(), "1,2,3,4,4.3,4.7,5", "Try inserting 2 elements in middle (negative)");
   equals($array.insertAt(1000, 6).str(), "1,2,3,4,5,6", "Try inserting at non-existent index (positive)");
   equals($array.insertAt(1000, 6, 7).str(), "1,2,3,4,5,6,7", "Try inserting 2 elements at non-existent index (positive)");
});
