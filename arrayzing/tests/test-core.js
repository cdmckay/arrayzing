// Unit tests for the core functions.

module("core");

test("Should create Arrayzing objects.", function()
{
    var array = [1, 2, 3];
    equals($a(1, 2, 3).toString(), array.join(), "The arrays should be equal");
    equals($a(array).toString(), array.join(), "The arrays should be equal");
    equals($a(1).toString(), "1", "Should be 1");
    equals($a(array, 4, 5)[0], array, "Should be the sub-array");
});
