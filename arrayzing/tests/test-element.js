// Unit tests for the element functions.

module("element");

test("Test the prechop() function.", function()
{
    var object = new Object();
    object[0] = "hi";
    object[1] = "ho";
    object.length = 2;
    object.toString = function() { return Array.prototype.join.call(this); }

    var $arr = _(22, object, "string", [1, 2], _(3, 4));

    equals($arr.prechop().str(), "22,ho,tring,2,4", "Test prechop under normal circumstances, default arguments");
    equals($arr.prechop(2).str(), "22,,ring,,", "Test prechop under normal circumstances, different argument");
    equals(_().prechop().length, 0, "Test it on an empty zing");
});

test("Test the replace() function.", function()
{
    var object = {
        toString: function()
        { return "object"; }
    }
    var $arr = _("foo", "bar", 21, object, true);

    equals($arr.replace("foo", "foz").str(), "foz,bar,21,object,true", "Test replace with string literal");
    equals($arr.replace(/[f|b](\w+)/, "$1").str(), "oo,ar,21,object,true", "Test replace with regex");
});