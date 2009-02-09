/*
 * Arrayzing 0.1.0 - jQuery-like Array manipulation
 *
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 */

// Map over Arrayzing in case of overwrite.
if ( window.Arrayzing )
{
    var _Arrayzing = window.Arrayzing;
}

var Arrayzing = window.Arrayzing = function()
{
    // The Arrayzing object is actually just the init constructor 'enhanced'.
    return new Arrayzing.prototype.init( arguments );
};

// Map over the $ in case of overwrite
if ( window.$a )
{
    var _$a = window.$a;
}

// Map the Arrayzing namespace to the '$a' one.
window.$a = Arrayzing;

Arrayzing.fn = Arrayzing.prototype =
{
    init: function( arguments )
    {
        if (arguments.length == 1)
        {
            if (arguments[0].constructor == Array)
            {
                return this.setArray( arguments[0] );
            }
            else if (arguments[0] instanceof Arrayzing)
            {                
                return this.setArray( arguments[0].get() );
            }            
        }
        
        return this.setArray( arguments );		
    },

    // The current version of Arrayzing being used.
    version: "0.1.0",

    /**
     * The number of elements contained in the set.
     */
    length: 0,

    /**
     * The number of elements contained in the set.
     * @return Number
     */
    size: function()
    {
        return this.length;
    },

    get: function( index )
    {
        // If there is no index, return the whole array.
        if ( index == undefined )
        {
            return this.toArray();
        }
        // If it is >= 0, pass through to the normal way.
        else if ( index >= 0 )
        {
            return this[index];
        }
        // If it's negative, return from the right.
        else
        {
            return this[this.length + index];
        }
    },

    add: function()
    {
        // Just alias push.
        return this.push.apply(this, arguments);
    },

    /**
     * Removes the element at the given index, and shifts all the
     * elements over by one to close the gap.
     * @param index The index of the element to remove.
     * @return Arrayzing set
     */
    remove: function( index )
    {
        // If index is greater than the length, just return this object.
        if (index < -this.length || index >= this.length) return this;

        // If the index is negative, convert it to it's positive equivalent.
        if (index < 0) index += this.length;

        // Push the old array onto the stack.
        var ret = this.pushStack( this );

        // Get a slice from just after the index to the end.
        var elems = ret.slice(index + 1, ret.length).get();

        // Set the length to the index, so when we push, the elements
        // will be pushed on top of the old ones.
        ret.length = index;
        Array.prototype.push.apply( ret, elems );

        // Return the new array.
        return ret;
    },

    /**
     * A function to filter based on instanceof instead of ==.
     * @param fn function type to check for.
     * @return an Arrayzing set.
     */
    only: function( fn )
    {
        var ret = [];

        this.each(function()
        {
            if (this instanceof fn)
            {
                ret.push(this);
            }
        });

        return this.pushStack( ret );
    },

    /**
     * An alias for only to return elements that are numbers.
     * @return Arrayzing set
     */
    numbers: function()
    {
        return this.only(Number);
    },

    /**
     * An alias for only to return elements that are strings.
     * @return Arrayzing set
     */
    strings: function()
    {
        return this.only(String);
    },

    /**
     * Reduces the array to the value at the given index,
     * reducing the array to 1 element.
     * @param index The index that will become sole element in the array.
     * @return Arrayzing set
     */
    just: function( index )
    {
        // Push the current array onto the stack.
        var ret = this.pushStack( this );

        // Get the just element.
        var element = ret[index];

        // Splice it in.
        ret.splice(0, ret.length, element);

        // Return the new array.
        return ret;
    },
   
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
        // Run Array's pop function.
        var ret = Array.prototype.pop.apply(this, arguments);

        // If the result is defined (i.e. there are no elements) then
        // return an element array instead of that.
        if (ret == undefined) ret = [];

        // Return the new array.
        return this.pushStack( ret );
    },

    push: function()
    {     
        var ret = this.pushStack( this );     
        Array.prototype.push.apply( ret, arguments );
        return ret;
    },

    reverse: function()
    {
        var ret = this.pushStack( this );
        Array.prototype.reverse.apply( ret, arguments );
        return ret;
    },

    shift: function()
    {
        // Run Array's shift function.
        var ret = Array.prototype.shift.apply(this, arguments);

        // If the result is defined (i.e. there are no elements) then
        // return an element array instead of that.
        if (ret == undefined) ret = [];

        // Return the new array.
        return this.pushStack( ret );
    },

    slice: function()
    {
        return this.pushStack( Array.prototype.slice.apply(this, arguments) );
    },

    sort: function()
    {
        var ret = this.pushStack( this );
        Array.prototype.sort.apply( ret, arguments );
        return ret;
    },

    splice: function()
    {
        var ret = this.pushStack( this );
        Array.prototype.splice.apply( ret, arguments );
        return ret;
    },

    unshift: function()
    {
        var ret = this.pushStack( this );
        Array.prototype.unshift.apply(ret, arguments);
        return ret;
    },

    /**
     * Take an array of elements and push it onto the stack returning the
     * new matched element set.
     * @param elems
     * @return Arrayzing
     */	
    pushStack: function( elems )
    {
        // Build a new jQuery matched element set
        var ret = Arrayzing( elems );

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

    end: function()
    {
        return this.prevObject || Arrayzing( [] );
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    // (Adapted from jQuery).
    each: function( callback, args )
    {
        return Arrayzing.each( this, callback, args );
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

    /** Pattern that matches a string that is entirely uppercase. */
    __uppercased: /^[A-Z\s]*$/,

    uppercased: function()
    {
        return this.filter( this.__uppercased );
    },

    /** Pattern that matches a string that is entirely lowercase. */
    __lowercased: /^[a-z\s]*$/,

    lowercased: function()
    {
        return this.filter( this.__lowercased );
    },

    /**
     * Pattern that matches a string that has it's first level uppercase,
     * and the rest lower case.
     */
    __capitalized: /^[A-Z][a-z\s]*$/,

    capitalized: function()
    {
        return this.filter( this.__capitalized );
    },
	
    reduce: function( initial, closure )
    {
        var total = initial;

        this.each(function()
        {
            total = closure(total, this);
        });

        return this.pushStack( [ total ] );
    },

    rreduce: function()
    {
    },

    sum: function()
    {
        return this.reduce(0, Arrayzing.__add);
    },

    product: function()
    {
        return this.reduce(1, Arrayzing.__multiply);
    },

    index: function()
    {

    },    

    every: function()
    {

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

        return bool;
    },

    some: function()
    {

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

        return bool;
    },

    flatten: function()
    {

    },

    // Methods that modify the elements directly.

    map: function()
    {

    },

    enclose: function()
    {

    },

    prechop: function( n )
    {

    },

    chop: function( n )
    {

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
Arrayzing.extend = Arrayzing.fn.extend = function()
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
                    target[ name ] = Arrayzing.extend( target[ name ], options[ name ] );

                // Don't bring in undefined values
                else if ( options[ name ] != undefined )
                    target[ name ] = options[ name ];

            }

    // Return the modified object
    return target;
};

// Give the init function the Arrayzing prototype for later instantiation.
Arrayzing.prototype.init.prototype = Arrayzing.prototype;

// (Adapted from jQuery).
Arrayzing.extend(
{
    // Internal sum function.
    __add: function(total, item)
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

    __multiply: function(total, item)
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
    },

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