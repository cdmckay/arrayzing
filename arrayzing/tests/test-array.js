// Unit tests for the array functions.

module("array");

test("Test concat().", function()
{
    var array1 = [1, 2, 3];
    var array2 = [4, 5, 6];
    var result1 = $a(array1).concat(array2); // Try concatting a normal array.
    var result2 = $a(array1).concat($a(array2)); // ...and an Arrayzing.
    equals(result1.toString(), "1,2,3,4,5,6", "Try concat on an array");    
    equals(result1.length, 6, "Verify length of concat on an array");
    equals(result2.toString(), "1,2,3,4,5,6", "Try concat on an Arrayzing");
    equals(result2.length, 6, "Try concat on an Arrayzing");
});

test("Test join().", function()
{
    var array = [1, 2, "bloo"];
    var result1 = $a(array).join();
    var result2 = $a(array).join(";");
    equals(result1, "1,2,bloo", "Try joining with default argument");
    equals(result2, "1;2;bloo", "Try joining with semi-colon argument");   
});

test("Test pop().", function()
{    
    var array = [1, 2, "bloo"];

    var a = $a(array);

    equals($a().pop(), undefined, "Try popping off an empty array");
    equals(a.pop(), "bloo", "Try pop() on a mixed array");
    equals(a.str(), $a(array).str(), "Make sure the original array was untouched");
    equals(a.pop$(), "bloo", "Try pop$() on a mixed array");
    equals(a.str(), "1,2", "Make sure it changed it in place");
    
});

test("Test push() and add().", function()
{
    // Test push. 
    var array = ["a", "b", 3];

    equals($a().push(4).get(0), 4, "Try pushing into an empty array");
    equals($a(array).push(4).join(), "a,b,3,4", "Try pushing into a mixed array");
    equals($a(array).push(4, 5).slice(3, 5).get().join(), "4,5", "Try pushing multiple values");
    equals($a(array).push([4, 5]).get(3).join(), "4,5", "Try pushing an array on");
    equals($a(array).push($a(4, 5)).get(3).pop().toString(), "5", "Try pushing an Arrayzing on");

    var a = $a(array);
    a.push$(4);
    equals(a.str(), "a,b,3,4", "Make sure push$ works in-place");

    equals($a().push("hi").add("ho").toString(), $a().add("hi").push("ho").toString(),
            "See if add gives the same answer as push");

    var $array = $a().push("x");
    equals($array.length, 1, "Make sure the length is right");

    // Test merge.
    equals($a(array).add(4).set$(0, 3).merge().str(), "3,b,3,4", "Test merge");
});

test("Test reverse.", function()
{
    var array = [1, 2, 3];
    var $array = $a(array);

    equals($a().reverse().length, $a().length, "Try reversing an empty array");
    equals($array.reverse().length, $array.length, "Make sure the length doesn't change");
    equals($array.reverse().get(0), $array.get(-1), "Make sure it works right on a normal array");
});

test("Test shift().", function()
{
    var array = ["a", "b", 3];
    var $array = $a(array);

    equals($array.shift(), "a", "Try shifting a normal array");
    equals($array.shift().length, 1, "Make sure length is right");
    equals($a().shift(), undefined, "Try shifting an empty array");
});

test("Test slice().", function()
{
    var $zing = $a(1, 2, 3);
    var $ex1 = $zing.slice(0, 1);
    equals($ex1[0], 1, "Try getting a slice (positive)");
    equals($ex1.length, 1, "Make sure the length is right");

    var $ex2 = $zing.slice(0, -1);
    equals($ex2.toString(), "1,2", "Try getting a slice (negative)");
    equals($ex2.length, 2, "Make sure the length is right");
});

test("Test sort().", function()
{
    var $num = $a(3, 20, 1);
    var $alpha = $a("abc", "abb", "aba");

    equals($a().sort().length, 0, "Test sort on empty array");
    equals($num.sort().get().join(), "1,20,3", "On array of numbers");
    equals($alpha.sort().get().join(), "aba,abb,abc", "On array of strings");

    // A custom sort function to sort numerically, leaving all non-numbers
    // at the right end of the list.
    var sortNum = function(a, b)
    {
        if (a.constructor != Number) { a = Number.MAX_VALUE; }
        if (b.constructor != Number) { b = Number.MAX_VALUE; }

        return a - b;
    };

    equals($a(3, 512, "x", 2, "aa").sort(sortNum).get().join(),
            "2,3,512,x,aa", "Sort with custom function on a mixed array");
});

test("Test splice().", function()
{
    var $array = $a(1, 2, 3);
    equals($array.splice(0, 1, 4, 5, 6).get().join(), "4,5,6,2,3", "Try splicing in some numbers");
    equals($array.splice(0, 1, [4, 5, 6]).get().join(), "4,5,6,2,3", "Try splicing in some numbers using an array");
    equals($array.splice(0, 1, $a(4, 5, 6)).get().join(), "4,5,6,2,3", "Try splicing in some numbers using an Arrayzing");
    equals($array.splice(0, 4, 4, 5, 6).get().join(), "4,5,6", "Try splicing the whole array");
    equals($array.splice(0, 0, 4, 5, 6).get().join(), "4,5,6,1,2,3", "Try using splice to unshift");
});

test("Test unshift().", function()
{   
    var array = ["a", "b", 3];

    equals($a().unshift(4).get(-1), 4, "Test unshifting a blank array");
    equals($a(array).unshift(4).join(), "4,a,b,3", "Test unshifting a non-blank array");
    equals($a().push("x").length, 1, "Make sure unshift sets the right length");
});

test("Test map().", function()
{
    var $num = $a(1, 4, 9);
    var $str = $a("cantelope", "octopus", "october", "lopsided");

    var letter1 = function(word) { return word[0]; }

    equals($num.map( Math.sqrt ).toString(), "1,2,3", "Test with sqrt function");
    equals($str.map( letter1 ).join("").toString(), "cool", "Test with string function");
    equals($a().map( letter1 ).length, 0, "Test on an empty zinger");
    equals((function() { var x = false; try { $num.map("foo"); } catch (error) { return true; }}).call(),
        true, "See if an exception is thrown for invalid input");
});

test("Test reduce() family of functions.", function()
{
    var $num = $a(1, 2, 3);
    var $str = $a("a", "b", "c");
    var fn = function(total, element) { return total + element };

    equals($num.reduce(0, fn), 6, "Try some normal operation stuff");
    equals($num.rreduce(0, fn), 6, "Try some normal operation stuff (rreduce)");
    equals($str.reduce("", fn), "abc", "Try some normal operation stuff");
    equals($str.rreduce("", fn), "cba", "Try some normal operation stuff (rreduce)");
    equals($num.sum(), 6, "Test sum under normal circumstances.");
    equals($a().sum(), 0, "Test sum on an empty zing");
    equals($a(1, undefined, function() { return x }, false, "2").sum(), 3, "Test on an array with a bunch of crap");
    //equals($num.product(), 6, "Test product under normal circumstances");
    //equals($a().product(), 1, "Test product on an empty zing");
    //equals($a(1, undefined, function() { return x }, false, "2").product(), 2, "Test on an array with a bunch of crap");
});

test("Test clear().", function()
{
   var $arr = $a("x", "y", "z");

   equals($arr.clear().length, 0, "Test normal operation");
   equals($a().clear().length, 0, "Test on empty zing");   
});
