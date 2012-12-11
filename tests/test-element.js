// Unit tests for the element functions.

module("element");

test("Test the prechop() function.", function()
{
    var object = new Object();
    object[0] = "hi";
    object[1] = "ho";
    object.length = 2;
    object.toString = function() { return Array.prototype.join.call(this); }

    var array = _(22, object, "string", [1, 2], _(3, 4));

    equals(array.prechop().str(), "22,ho,tring,2,4", "Test prechop under normal circumstances, default arguments");
    equals(array.prechop(2).str(), "22,,ring,,", "Test prechop under normal circumstances, different argument");
    equals(_().prechop().length, 0, "Test it on an empty zing");
});

test("Test the chop() function.", function()
{
    var object = new Object();
    object[0] = "hi";
    object[1] = "ho";
    object.length = 2;
    object.toString = function() { return Array.prototype.join.call(this); }

    var array = _(22, object, "string", [1, 2], _(3, 4));

    equals(array.chop().str(), "22,hi,strin,1,3", "Test chop under normal circumstances, default arguments");
    equals(array.chop(2).str(), "22,,stri,,", "Test chop under normal circumstances, different argument");
    equals(_().chop().length, 0, "Test it on an empty zing");
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

test("Test the prefix() function.", function()
{
   ok( _("a", "b").prefix("a").equals( _("aa", "ab") ),
        "Try prefixing strings" );

   ok( _( [1,2], [3] ).prefix(1).equals( _( [1,1,2], [1,3] ) ),
        "Try prefixing arrays" );

   ok( _( _(1,2), _(3) ).prefix(1).equals( _( _(1,1,2), _(1,3) ) ) ,
        "Try prefixing zings");

   var t = function() { };
   t.prototype.length = 0;
   var o = new t();
   o[0] = "foo";
   o[1] = "bar";
   o.length = 2;

   equals( _( o, 2 ).prefix(1)[0][0], 1, "Try prefixing an array-like" );

});