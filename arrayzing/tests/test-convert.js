// Unit tests for convert functions.

module("convert");

test("Test boolize().", function()
{    
    var object1 =
    {
        toBoolean: function() { return true; },
        toNumber:  function() { return 1; },
        toString:  function() { return "object1"; }
    }

    var object2 =
    {
        toBoolean: function() { return false; },
        toNumber:  function() { return 2; },
        toString:  function() { return "object2"; }
    }

    var array = [1, "str", 0, null, "false", true, false];
    var overload = [object1, object2];
    var a = $a(array).boolize(-1);
    var b = $a(array).boolize();
    equals(a.get(-1), false, "See if it converts a single element to a boolean correctly");
    equals(b.join(), "true,true,false,false,true,true,false", "See if it converts all elements to boolean correctly");
    equals($a(overload).boolize().join(), "true,false", "See if the toBoolean is detected and used properly");
});

test("Test numberize().", function()
{
    var object1 =
    {
        toBoolean: function() { return true; },
        toNumber:  function() { return 1; },
        toString:  function() { return "object1"; }
    }

    var object2 =
    {
        toBoolean: function() { return false; },
        toNumber:  function() { return 2; },
        toString:  function() { return "object2"; }
    }

    var array = [1, "str", 0, null, "false", "$2", true];
    var a = $a(array).numberize(-1);    
    var b = $a(array).numberize();
    equals(a.get(-1), 1, "See if it converts a single element to number correctly");
    equals(b.join(), "1,NaN,0,0,NaN,NaN,1", "See if it converts all elements to numbers correctly");
});