(function($a){
/*
 * Arrayzing String Plugin
 *
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 */

Arrayzing.extend({

	/**
	 * Removes all elements that have are not completely
	 * lowercased save for the first letter, which must be uppercased.
	 * For example, "Foo bar" will match but "Foo Bar" or "foo bar" will not.
	 * @return A zing containing only capitalized strings.
	 * @type Arrayzing
	 */
    capitalized: function()
    {
        return this.filter( /^[A-Z][a-z\s]*$/ );
    },
	
	/**
	 * Capitalize all strings in the zing so that all of the characters
	 * are lowercase, except for the first letter, which is uppercase.
	 * For example, "foo bar" becomes "Foo bar".
	 * @return A zing with all the strings capitalized.
	 * @type Arrayzing
	 */
    capitalize: function()
    {

    },

	/**
	 * The mutator version of capitalize.
	 * @see #capitalize
	 * @type Arrayzing
	 */
    capitalize$: function()
    {

    },
	
	capitalizeWords: function()
	{
		
	},
	
	capitalizeWords$: function()
	{
		
	},
	
	reverseWords: function()
	{
		
	},
	
	reverseWords$: function()
	{
		
	}		

});

})(Arrayzing);


