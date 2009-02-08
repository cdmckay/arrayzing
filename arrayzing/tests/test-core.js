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
   equals($a(array).length, 3, "Should be 3");
   equals($a(array).size(), 3, "Should be 3");
   equals($a(array).length, $a(array).size(), "Should be equal");
});
