/*
 * Arrayzing 0.1.0 - jQuery-like Array manipulation
 *
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */

// Map over arrayzing in case of overwrite.
if ( window.arrayzing )
{
	var _arrayzing = window.arrayzing;
}

var arrayzing = window.arrayzing = function( object ) 
{
	// The arrayzing object is actually just the init constructor 'enhanced'.
	return new arrayzing.prototype.init( object );
};

// Map over the $ in case of overwrite
if ( window.$a )
{
	var _$a = window.$a;
}

// Map the arrayzing namespace to the '$a' one
window.$a = arrayzing;

arrayzing.fn = arrayzing.prototype =
{
	init: function(object)
	{	
		if (object.constructor == Array)
		{
			return this.setArray(object);
		}
		else
		{
			this[0] = object;
			this.length = 1;
			return this;
		}
	},

	// Patterns used within the arrayzing object.
	upperPattern: /^[A-Z\s]*$/,      // all uppercase
	lowerPattern: /^[a-z\s]*$/,      // all lowercase
	capPattern:   /^[A-Z][a-z\s]*$/, // first letter uppercase, the rest lowercase

	// The current version of arrayzing being used.
	version: "0.1.0",

	/**
     * The number of elements contained in the matched element set.
     * @return Number
     */
	size: function() 
	{
		return this.length;
	},

    /**
     * The number of elements contained in the matched element set.
     */
	length: 0,    	

    concat: function()
    {
        return this.pushStack( Array.prototype.concat.apply(this, arguments) );
    },

    join: function()
    {
        return this.pushStack( [Array.prototype.join.apply(this, arguments)] );
    },

    pop: function()
    {
        return this.pushStack( Array.prototype.pop.apply(this, arguments) );
    },

    push: function()
    {
        return this.pushStack( Array.prototype.push.apply( this, arguments ) );
    },

    reverse: function()
    {
        return this.pushStack( Array.prototype.reverse.apply( this, arguments ) );
    },

    shift: function()
    {
        return this.pushStack( Array.prototype.shift.apply( this, arguments ) );
    },

    slice: function()
    {
		return this.pushStack( Array.prototype.slice.apply(this, arguments) );
	},

    sort: function()
    {
		return this.pushStack( Array.prototype.sort.apply(this, arguments) );
	},

    splice: function()
    {
		return this.pushStack( Array.prototype.splice.apply(this, arguments) );
	},

    unshift: function()
    {
		return this.pushStack( Array.prototype.unshift.apply(this, arguments) );
	},

    /**
     * Take an array of elements and push it onto the stack returning the
     * new matched element set.
     * @param Array elems
     * @return Arrayzing
     */	
	pushStack: function( elems )
    {
		// Build a new jQuery matched element set
		var ret = arrayzing( elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack.
	// (Adapted from jQuery).
	setArray: function( elems ) 
	{
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;

		Array.prototype.push.apply( this, elems );
		
		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)	
	// (Adapted from jQuery).
	each: function( callback, args )
	{
		return arrayzing.each( this, callback, args );
	},

	compare: function( num, closure )
	{
		var ret = [];

		this.each(function()
		{
			if ( this.constructor == Number && closure( num, this ) )
			{								
				ret.push( this );
			}
			else if ( this.length != undefined && closure( num, this.length ) )
			{				
				ret.push( this );
			}
			else
			{
				var val = parseFloat(this);
				if ( !isNaN(val) && closure( num, val ) )
				{
					ret.push( this );
				}
			}
		});

		return this.pushStack( ret );
	},

	// Internal gt function.
	__gt: function( num, size )
	{
		return size > num;
	},

	gt: function( num )
	{		
		return this.compare( num, this.__gt );
	},	

	filter: function( pattern )
	{		
		var ret = [];		
		       
		this.each(function()
		{            			
			if ( (pattern != null && pattern.constructor == RegExp && pattern.test(this))
                || (pattern == this) )
			{                
				ret.push( this );
			}			
		});

		return this.pushStack( ret );
    },
    
	uppers: function()
	{
		return this.filter( this.upperPattern );
	},

	lowers: function()
	{
		return this.filter( this.lowerPattern );
	},
	
	inject: function( initial, closure )
	{
		var total = initial;

		this.each(function()
		{
			total = closure(total, this);	
		});

		return this.pushStack( [ total ] );
	},

	// Internal sum function.
	__sumfunc: function(total, item)
	{
		if ( item.constructor == Number )
		{
			total += item;
		}
		else
		{
			var val = parseFloat(item);
			if ( !isNaN(val) )
			{
				total += val;
			}
		}

		return total;
	},

	sum: function()
	{
		return this.inject(0, this.__sumfunc); 
	},

	product: function()
	{
		return this.inject(1, function(total, item)
		{
			if ( item.constructor == Number )
			{
				total *= item;
			}
			else
			{
				var val = parseFloat(item);
				if ( !isNaN(val) )
				{
					total *= val;
				}
			}

			return total;
		});
	},

	and: function()
	{
		var bool = true;
		
		this.each(function()
		{
			if ( this.constructor == Boolean )
			{
				bool = bool && this;
			}
			else
			{
				bool = bool && new Boolean(this);
			}
		});

		return this.pushStack( [ bool ] );
	},

	or: function()
	{
		var bool = false;
		
		this.each(function()
		{
			if ( this.constructor == Boolean )
			{
				bool = bool || this;
			}
			else
			{
				bool = bool || new Boolean(this);
			}
		});

		return this.pushStack( [ bool ] );
	},

	toString: function()
	{	
		return Array.prototype.join.apply( this, [ "," ] );
	},

	toArray: function()
	{
		return Array.prototype.slice.apply( this, [ 0, this.length ] );
	}
};
	
// (Adapted from jQuery).
arrayzing.extend = arrayzing.fn.extend = function() 
{
	// Copy reference to target object.
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation.
	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy).
	if ( typeof target != "object" && typeof target != "function" )
		target = {};

	// Extend jQuery itself if only one argument is passed.
	if ( length == 1 ) {
		target = this;
		i = 0;
	}

	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				// Prevent never-ending loop
				if ( target === options[ name ] )
					continue;

				// Recurse if we're merging object values
				if ( deep && options[ name ] && typeof options[ name ] == "object" && target[ name ] && !options[ name ].nodeType )
					target[ name ] = arrayzing.extend( target[ name ], options[ name ] );

				// Don't bring in undefined values
				else if ( options[ name ] != undefined )
					target[ name ] = options[ name ];

			}

	// Return the modified object
	return target;
};

// Give the init function the arrayzing prototype for later instantiation.
arrayzing.prototype.init.prototype = arrayzing.prototype;

// (Adapted from jQuery).
arrayzing.extend(
{
	// args is for internal usage only
	each: function( object, callback, args ) {
		if ( args ) {
			if ( object.length == undefined ) {
				for ( var name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( var i = 0, length = object.length; i < length; i++ )
					if ( callback.apply( object[ i ], args ) === false )
						break;

		// A special, fast, case for the most common use of each
		} else {
			if ( object.length == undefined ) {
				for ( var name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var i = 0, length = object.length, value = object[0]; 
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	/**
	 * Attempts to convert an object to a string.
	 * @param object The object we are converting.
	 */
	stringize: function( object )
	{
		// Check if it's already a string, if it is return.
		if ( object.constructor == String ) return object;

		if ( typeof object == "object" && !!object.toString != false )
		{
			// If it's an object and has a toString method, call that.            
			return object.toString();
		}			
		else
		{
			// Otherwise, try to make a new string out of it
			// using the string construtor.
			return new String(object);
		}	
	}
});