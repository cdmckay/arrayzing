// Unit tests for the core functions.

module("core");

test("Test Arrayzing constructor.", function()
{
    var array = [1, 2, 3];
    equals($a(1, 2, 3).toString(), array.join(), "The arrays should be equal");
    equals($a(array).toString(), array.join(), "The arrays should be equal");
    equals($a(1).toString(), "1", "Should be 1");
    equals($a(array, 4, 5)[0], array, "Should be the sub-array");
    equals($a().length, 0, "Should equal 0")

    var $array = $a(array);
    var $$array = $a($array);
    equals($array.length, $$array.length, "Should be the same size");
});

test("Test get function.", function()
{
    var array = [1, 2, 3];
    var $array = $a(1, 2, 3);
    equals($array.get(0), 1, "Should be 1");
    equals($array.get("0"), 1, "Should be 1");
    equals($array.get(-1), 3, "Should be 3");
    equals($array.get()[0], $array.toArray()[0] , "Should be equal");
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

test("Test just() function.", function()
{

});
