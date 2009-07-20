(function(_){
/*
 * Arrayzing Boolean Plugin
 *
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 */

Arrayzing.extend({

    /**
     * Performs a logical and on all elements in the
     * zing and returns the result.
     * @return The logical and of all elements.
     * @type Boolean
     */
    andAll: function()
    {
        return this.boolize$().reduce(function(total, item)
        {
            return total && item;
        });
    },

    and: function( val )
    {

    },

    and$: function( val )
    {

    },

    orAll: function()
    {
        return this.boolize$().reduce(function(total, item)
        {
            return total || item;
        });
    },

    or: function( val )
    {

    },

    or$: function( val )
    {

    },

    negateAll: function()
    {

    }

});

})(Arrayzing);


