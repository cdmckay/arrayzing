// Unit tests for convert functions.

module("convert");

test("Test boolize().", function()
{
    var object1 = new Object();
    object1.toBoolean = function()
    {
        return true;
    };

    var object2 = new Object();
    object2.toBoolean = function()
    {
        return false;
    };

    var array = [1, "str", 0, null, "false", true, false];
    var a = $a(array).boolize(-1);
    var b = $a(array).boolize();
    equals(a.get(-1), false, "See if it converts a single element to a boolean correctly");
    equals(b.join(), "true,true,false,false,true,true,false", "See if it converts all elements to boolean correctly");
    equals($a(object1, object2).boolize().join(), "true,false", "See if the toBoolean is detected and used properly");
});