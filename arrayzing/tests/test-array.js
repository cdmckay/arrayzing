// Unit tests for the array functions.

module("array");

test("Should concat an array or an Arrayzing.", function()
{
    var array1 = [1, 2, 3];
    var array2 = [4, 5, 6];
    var result1 = $a(array1).concat(array2); // Try concatting a normal array.
    var result2 = $a(array1).concat($a(array2)); // ...and an Arrayzing.
    equals(result1.toString(), "1,2,3,4,5,6", "Should equal the two arrays concatted");
    equals(result2.toString(), "1,2,3,4,5,6", "Should equal the two arrays concatted");
});

test("Should join an array using a string.", function()
{
    var array = [1, 2, "bloo"];
    var result1 = $a(array).join();
    var result2 = $a(array).join(";");
    equals(result1.toString(), "1,2,bloo", "Should equal the contents of the array joined with a comma");
    equals(result2.toString(), "1;2;bloo", "Should equal the contents of the array joined with a semi-colon");
});

