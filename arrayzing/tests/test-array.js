// Unit tests for the array functions.

module("array");

test("Test concat.", function()
{
    var array1 = [1, 2, 3];
    var array2 = [4, 5, 6];
    var result1 = $a(array1).concat(array2); // Try concatting a normal array.
    var result2 = $a(array1).concat($a(array2)); // ...and an Arrayzing.
    equals(result1.toString(), "1,2,3,4,5,6", "Should equal the two arrays concatted");
    equals(result2.toString(), "1,2,3,4,5,6", "Should equal the two arrays concatted");
});

test("Test join.", function()
{
    var array = [1, 2, "bloo"];
    var result1 = $a(array).join();
    var result2 = $a(array).join(";");
    equals(result1.toString(), "1,2,bloo", "Should equal the contents of the array joined with a comma");
    equals(result2.toString(), "1;2;bloo", "Should equal the contents of the array joined with a semi-colon");       
});

test("Test pop.", function()
{    
    var array = [1, 2, "bloo"];

    equals($a(array).pop()[0], "bloo", "Should equal the last element (bloo)");
    equals($a().pop().length, 0, "Should equal 0");
});

test("Test push.", function()
{
    // Test push.
    var empty = [];
    var array = ["a", "b", 3];

    equals($a(empty).push(4).get(-1), 4, "Should equal 4");
    equals($a(array).push(4).join(), "a,b,3,4", "Should equal 4");
    var $array = $a(empty).push("x");
    equals($array.length, 1, "Should be 1");
    equals($array.get().join(), "x", "Should be x");
});

test("Test reverse.", function()
{
    var empty = [];
    var array = [1, 2, 3];
    var $empty = $a(empty);
    var $array = $a(array);

    equals($empty.reverse().length, $empty.length, "Should have the same length");
    equals($array.reverse().length, $array.length, "Should have the same length");
    equals($array.reverse().get(0), $array.get(-1), "Should be the same");
});

test("Test shift.", function()
{
    var array = ["a", "b", 3];
    var $array = $a(array);

    equals($array.shift().get(0), "a", "Should equal the first element (3)");
    equals($array.shift().length, 1, "Should be 1");
    equals($a().shift().length, 0, "Should equal 0");
});

test("Test sort.", function()
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

test("Test splice.", function()
{

});

test("Test unshift.", function()
{

});
