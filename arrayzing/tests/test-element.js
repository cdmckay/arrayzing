// Unit tests for the element functions.

module("element");

test("Test the prechop() function.", function()
{
    var object = new Object();
    object[0] = "hi";
    object[1] = "ho";
    object.length = 2;
    object.toString = function() { return Array.prototype.join.call(this); }

    var $arr = $a(22, object, "string", [1, 2], $a(3, 4));

    equals($arr.prechop().str(), "22,ho,tring,2,4", "Test prechop under normal circumstances, default arguments");
    equals($arr.prechop(2).str(), "22,,ring,,", "Test prechop under normal circumstances, different argument");
    equals($a().prechop().length, 0, "Test it on an empty zing");
});