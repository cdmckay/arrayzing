(function(){
/*
 * Arrayzing 0.1.0 - Advanced Array manipulation
 *
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 */

// Map over Arrayzing in case of overwrite.
if ( window.Arrayzing ) var $Arrayzing = window.Arrayzing;

var Arrayzing = window.Arrayzing = function()
{
    // The Arrayzing object is actually just the init constructor 'enhanced'.
    return new Arrayzing.prototype.init( arguments );
};

// Map over the _ in case of overwrite.
if ( window._ ) var $_ = window._;

// Map the Arrayzing namespace to the _ one.
window._ = Arrayzing;

// Map the Arrayzing namespace internally to _.
var _ = Arrayzing;

Arrayzing.prototype =
{
    /**
     * Initialize a new zing.
     */
    init: function( arguments )
    {
        this.constructor = Arrayzing;

        if (arguments.length == 1)
        {
            var val = arguments[0];
            
            // This allows any iterable object to be used as a constructor
            // for Arrayzing.
            if ( _.isIterable(val) )
            {               
                return this._setArray( Array.prototype.slice.call(val, 0, val.length) );
            }                   
        }
        
        return this._setArray( arguments );
    },

    /**
     * The current version of Arrayzing being used.
     */
    version: "0.1.0",

    /**
     * The number of elements contained in the zing.
     */
    length: 0,

    /**
     * The number of elements contained in the set.
     * 
     * @return The size of the zing.
     * @type Number
     */
    size: function()
    {
        return this.length;
    },

    /**
     * Checks if one zing is equal to another by checking if each
     * element is equal.  This method can handle Array equality.
     *
     * Equals checks equality by first checking if the element defines
     * an equals() method, and barring that, tries to use the == operator.
     *
     * @param {Arrayzing} that The zing to check for equality.
     * @return True if equal, false otherwise.
     */
    equals: function( that )
    {
        if ( !_.isArrayzing(that) ) return false;

        var equals = function( that )
        {
            if (this.length != that.length) return false;

            for ( var i = 0; i < this.length; i++ )
            {
                if ( this[i] == that[i] )
                    continue;
                else if ( _.isFunction( this[i].equals )
                        && this[i].equals(that[i]) )
                    continue;

                return false;
            }

            return true;
        };

        // This will temporarily add an equals method to the
        // Array "class" (but only if it's not defined already).
        if ( !_.isFunction( Array.prototype.equals ) )        
            Array.prototype.equals = equals;

        var areEqual = equals.call( this, that );

        // Remove our equals method if we added it.
        if ( Array.prototype.equals == equals )
            Array.prototype.equals = undefined;

        return areEqual;
    },
    
    contains: function( pattern )
    {
        return this.filter(pattern).length > 0;
    },

    /**
     * Determine whether or not a given key in the zing has a value.
     *
     * @param {Number} index The object we're looking for.
     * @return True if the key exists is in the zing, false otherwise.
     * @type {Boolean}
     */
    hasKey: function( index )
    {        
        return (typeof(this[index]) != "undefined");
    },

    /**
     * Get the object held at the given index.  You may index from the
     * left (positive numbers) or right (negative numbers).  For example,
     * get(0) would be the first element and get(-1) would be the last element.
     *
     * @param {Number} index The index we're getting.
     * @return The object held at that index, or undefined for an empty entry.
     * @type Object
     */
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

    /**
     * Set the value at the given index.  Index values may be
     * positive (start from 0) or negative (start from the end of the string).
     *
     * @param {Number} index The index to set.
     * @param {Object} value The value to set.
     * @return The zing.
     * @type Arrayzing
     */
    set: function( index, value )
    {                
        return this.set$.apply(this.clone(), arguments);
    },

    /**
     * The mutator version of set.
     *
     * @see #set
     * @type Arrayzing
     */
    set$: function ( index, value )
    {
        if ( index == undefined )
            throw new Error("Set requires an index");

        if ( value == undefined )
            throw new Error("Set requires an value");

        if ( index < 0 ) index += this.length;

        this[index] = value;
        if (index >= this.length) this.length = index + 1;
        
        return this;
    },

    /**
     * Adds an element to the end of the zing.
     *
     * @type Arrayzing
     */
    add: function()
    {
        // Just alias push.
        return this.add$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of add.
     *
     * @see #add
     * @type Arrayzing
     */
    add$: function()
    {
        Array.prototype.push.apply( this, arguments );
        return this;
    },

    /**
     * Removes the element at the given index, and shifts all the
     * elements over by one to close the gap.
     *
     * @param index The index of the element to remove.
     * @param len The number of elements to remove.
     * @return Arrayzing set
     * @type Arrayzing
     */
    removeAt: function( index, len )
    {
        return this.removeAt$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of removeAt.
     *
     * @see #removeAt     
     * @type Arrayzing
     */
    removeAt$: function( index, len )
    {
        // If the length is undefined, use 1.
        if (len == undefined) len = 1;

        // If index is greater than the length, just return this object.
        if (index < -this.length || index >= this.length) return this;

        // If the index is negative, convert it to it's positive equivalent.
        if (index < 0) index += this.length;

        // Get a slice from just after the index to the end.
        this.splice$(index, len);

        // Adjust index array if it exists.
        if (this._indices != undefined)
        {
            this._indices.splice(index, len);
        }

        // Return the modified array.
        return this;
    },

    /**
     * Inserts the value at the given index, and shifts all the
     * elements to the right of the index by one to make room.
     *
     * @param {Number} index The index to insert the element at.
     * @param {Object} values ... The values to insert (may be one or more).
     * @return The zing with the new value inserted into it.
     * @type Arrayzing
     */
    insertAt: function( index, values )
    {
        return this.insertAt$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of insertAt.
     *
     * @see #insertAt     
     * @type Arrayzing
     */
    insertAt$: function( index, values )
    {		
        // If index is greater than the length, just return this object.
        if (index < -this.length) return this;

        // If the index is negative, convert it to it's positive equivalent.
        if (index < 0) index += this.length;

		// The elements to insert.
		var elements = Array.prototype.slice.call(arguments, 1);

        // Splice it in.
        this.splice$.apply(this, [index, 0].concat(elements));

        // Adjust index array if it exists.
        if (this._indices != undefined)
        {			
            this._indices.splice(index, 0,
		(function() { var a = []; a.length = elements.length; return a; })()
            );
        }

        // Return the modified array.
        return this;
    },

    /**
     * Return a new copy of this zing.
     *
     * @return A new zing with all elements.
     * @type Arrayzing
     */
    clone: function()
    {
        return this._pushStack( this );
    },

    /**
     * A function to filter out all objects of a certain type.
     *
     * @param fn Function type to look for.
     * @return A zing with only that type.
     * @type Arrayzing
     */
    only: function( fn )
    {
        return this.only$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of only.
     *
     * @see #only
     * @type Arrayzing
     */
    only$: function( fn )
    {
        // Check type.
        if (typeof fn != "function")
            throw new TypeError();

        var ret = [];

        this.each(function()
        {
            if (this instanceof fn)
                ret.push(this);
        });

        return this._setArray( ret );
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
     * Mutator version of numbers.
     *
     * @see #numbers
     * @see #only
     * @type Arrayzing
     */
    numbers$: function()
    {
        return this.only$(Number);
    },

    /**
     * An alias for only to return elements that are strings.
     *
     * @return Arrayzing set
     */
    strings: function()
    {
        return this.only(String);
    },

     /**
     * Mutator version of strings.
     *
     * @see #strings
     * @see #only
     * @type Arrayzing
     */
    strings$: function()
    {
        return this.only$(String);
    },

    /**
     * Reduces the array to the value at the given index,
     * reducing the array to 1 element.
     *
     * @param index The index that will become sole element in the array.
     * @return Arrayzing set
     */
    just: function( index )
    {
        return this.just$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of just.
     *
     * @see #just
     * @type Arrayzing
     */
    just$: function( indices )
    {
        if ( _.isIterable(indices) )
        {
            var table = [];
            _.each(indices, function()
            {
                table[this] = true;
            });

            var filterfn = function(item, index)
            {
                return table[index] === true;
            };

            return this.filter$( filterfn );
        }
        else
        {
            // Only one index, so rename.
            var index = indices;

            // Slice it out.
            if (index == -1) return this.slice(index);            
            else return this.slice(index, index + 1);            
        }
    },

    /**
     * Concatenates the contents of one or more zings to the current zing.
     *
     * @param {Arrayzing} zing An arrayzing to concatenate.
     * @return The result of the concatenation.
     * @type Arrayzing
     */
    addAll: function( zing )
    {
        return this.addAll$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of addAll.
     *
     * @see #addAll
     * @type Arrayzing
     */
    addAll$: function ( zing )
    {
        var ret = [];       
                
        _.each(arguments, function()
        {
            // If it's an array, keep it unchanged.
            if ( _.isArrayzing(this) ) ret.push(this.array());
            else if ( _.isArray(this) ) ret.push(this);
            else if ( _.isIterable(this) )
            {
                ret.push(Arrayzing.prototype.array.apply(this));
            }
        });

        //alert(this.prevObject);

        return this._setArray(Array.prototype.concat.apply(this.array(), ret));
    },

    /**
     * Puts all the elements of an array into a string. The elements are
     * separated by a specified delimiter.  If no delimiter is specified, then
     * a comma is used.
     * 
     * @param {String} [delimiter] Specifies the separator to use.
     * @return A joined string.
     * @type String
     */
    join: function( delimiter )
    {
        return Array.prototype.join.apply(this, arguments);
    },    

    /**
     * Reverses the order of the elements in the zing.
     *
     * @return Returns a new zing with reversed elements.
     * @type Arrayzing
     */
    reverse: function()
    {        
        return this.reverse$.apply( this.clone(), arguments );
    },

    /**
     * Reverses the order of the elements in the zing.
     *
     * @return Returns the modified zing with reversed elements.
     * @type Arrayzing
     */
    reverse$: function()
    {
        Array.prototype.reverse.apply( this, arguments );
        return this;
    },   

    slice: function()
    {
        return this.slice$.apply( this.clone(), arguments );
    },

    slice$: function()
    {        
        return this._setArray( Array.prototype.slice.apply(this, arguments) );
    },

    sort: function()
    {
        return this.sort$.apply( this.clone(), arguments );
    },

    sort$: function()
    {
        Array.prototype.sort.apply( this, arguments );
        return this;
    },

    splice: function()
    {
        return this.splice$.apply( this.clone(), arguments );
    },

    splice$: function()
    {
        Array.prototype.splice.apply( this, arguments );
        return this;
    }, 

    /**
     * Clear the contents of the zing.
     *
     * @return An empty zing.
     * @type Arrayzing
     */
    clear: function()
    {
        return this.clear$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of clear.
     *
     * @see #clear
     * @type Arrayzing
     */
    clear$: function()
    {
        return this._setArray( [] );
    },

    /**
     * Push the current zing onto the stack returning the passed elements
     * as a new zing.  The new zing will have a reference to the old one.
     *
     * @param elements The elements.
     * @return The new zing.
     * @type Arrayzing
     */
    // Adapted from jQuery 1.2.
    _pushStack: function( elements )
    {
        // Build a new jQuery matched element set
        var ret = Arrayzing( elements );

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;

        // Create an array on indices.
        var array = [];
        for (var i = 0; i < ret.length; i++) array.push(i);
        ret._indices = array;
        
        // Return the newly-formed element set
        return ret;
    },

    /**
     * Force the current zing to become the specified array of elements.
     * The stack is not increased (i.e. it will be the same as it was before
     * the array was set).
     * If you want to add to the stack, use pushStack() or .clone().setArray().
     *
     * @see #pushStack
     * @see #clone
     * @param {Array} elements The elements to set the array to.
     * @return The zing with the passed elements as its elements.
     * @type Arrayzing
     */
    // Adapted from jQuery 1.2.
    _setArray: function( elements )
    {
        // Resetting the length to 0, then using the native Array push
        // is a super-fast way to populate an object that is iterable.
        this.length = 0;

        Array.prototype.push.apply( this, elements );
		
        return this;
    },

    /** 
     * This is used internally by setIndices to track changes for the 
     * merge functions.
     */
    _indices: [],

    _setIndices: function( elements )
    {
        this._indices.length = 0;
        Array.prototype.push.apply( this._indices, elements );
        return this;
    },

    undo: function()
    {
        return this.prevObject || Arrayzing( [] );
    },  

    merge: function()
    {
        return this.merge$.call( this.clone(), this );
    },

    merge$: function( target )
    {
        // First see if a target was passed, if not,
        // use the prevObject as the target.
        if (target == undefined) target = this;
       
        // If there is no prev-object to merge to, just
        // return this.
        if (target.prevObject == undefined) return this;

        // Get a clone of the previous object.
        var prev = target.prevObject.clone();       

        // Copy in the elements from the current zing
        // using the indices to choose their spots.
        for (var i = 0; i < target._indices.length; i++)
        {
            prev[target._indices[i]] = this[i];
        }

        // If there are any remaining elements, concatenate
        // them to the end of the prev.
        if (this.length - target._indices.length > 0)
        {
            prev.addAll$( this.slice$(target._indices.length) );
        }

        // Make the prev array the new array.
        return this._setArray( prev.array() );
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    // (Adapted from jQuery).
    each: function( callback, args )
    {
        return _.each( this, callback, args );
    },

    /**
     * Applies the comparer function to each element in the zing, keeping
     * only those elements for which the comparer returns true.
     * This method implicity applies the quantize function.
     *
     * The format of the comparer is:
     * comparer(number, size)
     * where number is the passed in number
     * and size is the elements quantized size.
     *
     * @see #quantize
     * @param {Number} number
     * @param {Function} comparer
     */
    compare: function( number, comparer )
    {
        return this.compare$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of compare.
     *
     * @see #compare
     * @type Arrayzing
     */
    compare$: function( number, comparer )
    {
        var fn = function(size)
        {
            if (size == undefined) return false;
            return comparer(number, size);
        };

        var matchIndices = this.quantize().indicesOf(fn);
        return this.just$(matchIndices);
    },

    gt: function( num )
    {
        return this.gt$.apply( this.clone(), arguments );
    },

    gt$: function( num )
    {
        var gt = function( num, size )
        {
            return size > num;
        };

        return this.compare$( num, gt );       
    },

    gteq: function( num )
    {
        return this.gteq$.apply( this.clone(), arguments );
    },

    gteq$: function( num )
    {
        var gteq = function( num, size )
        {
            return size >= num;
        };

        return this.compare$( num, gteq );
    },    

    lt: function( num )
    {
        return this.lt$.apply( this.clone(), arguments );
    },

    lt$: function( num )
    {
        var lt = function( num, size )
        {
            return size < num;
        };

        return this.compare$( num, lt );
    },

    lteq: function( num )
    {
        return this.lteq$.apply( this.clone(), arguments );
    },

    lteq$: function( num )
    {
        var lteq = function( num, size )
        {
            return size <= num;
        };

        return this.compare$( num, lteq );
    },

    eq: function( num )
    {
        return this.eq$.apply( this.clone(), arguments );
    },

    eq$: function( num )
    {
        var eq = function( num, size )
        {
            return size == num;
        };

        return this.compare$( num, eq );
    },

    ofLength: function( length )
    {
        // Just alias equals.
        return this.eq.apply(this, arguments);
    },

    ofLength$: function( length )
    {
        // Just alias equals.
        return this.eq$.apply(this, arguments);
    },

    filter: function( pattern )
    {
        return this.filter$.apply(this.clone(), arguments);
    },

    filter$: function( pattern, not )
    {
        var outer = this;

        var keep = [];
        var indices = [];

        var matchesRegExp = function(pattern, item)
        {
            return pattern != null && _.isRegExp(pattern)
                && item != null && item != undefined
                && pattern.test(item);
        };

        var matchesFunction = function(pattern, item, index)
        {
            return pattern != null && _.isFunction(pattern)
                    && pattern(item, index);
        };

        this.each(function(index, item)
        {
            var matches = matchesRegExp(pattern, item)
                    || matchesFunction(pattern, item, index)
                    || (pattern == item);

            if ((matches && !not) || (!matches && not))
            {                
                keep.push( item );

                if ( outer._indices[index] != undefined )
                    indices.push( outer._indices[index] );
            }           
        });
       
        this._setIndices( indices );
        this._setArray( keep );

        return this;
    },

    remove: function( pattern )
    {
        return this.filter.call( this.clone(), pattern, true );
    },

    remove$: function( pattern )
    {
        return this.filter$.call( this.clone(), pattern, true );
    },

    removeAll: function( iterable )
    {
        this.remove.apply(this, iterable)
    },

    removeAll$: function( iterable )
    {
        this.remove$.apply(this, iterable)
    },

    /**
     * Returns the indices of all elements that match the
     * given pattern.  The pattern can be any pattern that
     * is valid for the filter function.
     * 
     * @see #filter
     * @return A zing of numbers corresponding to the indices that matched.
     * @type Arrayzing
     */
    indicesOf: function( pattern )
    {
      return this.indicesOf$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of indicesOf.
     * @see #indicesOf
     * @type Arrayzing
     */
    indicesOf$: function( pattern )
    {
        var filtered = this.filter$(pattern);
        return filtered.map$(function(item, index)
        {
            return filtered._indices[index];
        });
    },

    /**
     * Removes all null, undefined, NaN, "", and [] elements from the zing
     * and pulls them tight.  Equivalent to calling removeAt() at each of those
     * indices.
     *
     * This function will also test for a length property and remove the element
     * if that property is 0.
     *
     * @see #removeAt
     * @return The tightened zing.
     * @type Arrayzing
     */
    tighten: function()
    {
        return this.tighten$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of tighten.
     * @see #tighten
     * @type Arrayzing
     */
    tighten$: function()
    {
        var fn = function(item)
        {
            if (item == null
                || item == undefined
                || (typeof item == "number" && isNaN(item))
                || item == ""
                || (item.length != undefined && item.length == 0))
            {                
                return false;
            }

            return true;
        };

        // Tighten the zing.
        return this.filter$(fn);
    },

    /**
     * Remove all strings that are not uppercased.     
     *
     * @see #areLower
     * @return The zing with all non-uppercased strings removed.
     * @type Arrayzing
     */
    areUpper: function()
    {
        return this.areUpper$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of areUpper.
     *
     * @see #areUpper
     * @type Arrayzing
     */
    areUpper$: function()
    {        
        return this.strings$().filter$( /^[A-Z\s]*$/ );
    },

    /**
     * Remove all strings that are not lowercased.
     *
     * @see #areUpper     
     * @return The zing with all non-lowercased strings removed.
     * @type Arrayzing
     */
    areLower: function()
    {
        return this.areLower$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of areLower.
     * @see #areLower
     * @type Arrayzing
     */
    areLower$: function()
    {
        return this.strings$().filter$( /^[a-z\s]*$/ );
    },

    /**
     * Apply a function against an accumulator and each value
     * of the array (from left-to-right) as to reduce it to a
     * single value.
     *
     * The format of the closure is:
     * function(accumalator, element, index)
     *
     * @see #rreduce
     * @param {Object} initial The initial value of the accumulator
     * @param {Function} closure The closure applied against each value
     * @return The final value of the accumulator
     * @type Object
     */
    reduce: function( initial, closure )
    {
        // The starting "total".
        var accumulator = initial;

        for (var i = 0; i < this.length; i++)
        {
            if (this.hasKey(i))
                accumulator = closure.call(this[i], accumulator, this[i], i);
        }

        return accumulator;
    },

    /**
     * Apply a function against an accumulator and each value
     * of the array (from right-to-left) as to reduce it to a
     * single value.
     *
     * The format of the closure is:
     * function(accumalator, element, index)
     *
     * @see #reduce
     * @param {Object} initial The initial value of the accumulator
     * @param {Function} closure The closure applied against each value
     * @return The final value of the accumulator
     * @type Object
     */
    rreduce: function( initial, closure )
    {
        // Reverse and reduce.
        var reversed = this.reverse();
        return this.reduce.apply(reversed, arguments);
    },

    sum: function()
    {
        return this.reduce(0, function(total, item)
        {
            if ( _.isNumber(item) )
            {
                total += item;
            }
            else
            {
                var val = parseFloat(item);
                if ( !isNaN(val) ) total += val;
            }

            return total;
        });
    },
    
    product: function()
    {
        return this.reduce(1, function(total, item)
        {
            if ( _.isNumber(item) )
            {
                total *= item;
            }
            else
            {
                var val = parseFloat(item);
                if ( !isNaN(val) ) total *= val;
            }

            return total;
        });
    },

    /**
     * Returns the minimum value in the zing.  The value
     * used is the numeric value for a Number, or the
     * length property if it exists.  If the object is
     * neither a Number nor has a length property, it is
     * ignored.  If dfferent objects evaluate to the same
     * minimum length, the first value found will be returned.
     *
     * @see #max
     * @return The object with the lowest value or undefined.
     * @type Object
     */
    min: function()
    {
        var fn = function(min, val)
        {
            var ret;
            if (typeof next == "number")
            {
                ret = val;
            }
            else if (val != null && val.length != undefined)
            {
                ret = val.length;
            }
            else
            {
                return min;
            }

            if (min == undefined || ret < min)
            {
                return ret;
            }
            else
            {
                return min;
            }
        }

        return this.reduce(undefined, fn);
    },

    /**
     * Returns the maximum value in the zing.  The value
     * used is the numeric value for a Number, or the
     * length property if it exists.  If the object is
     * neither a Number nor a length property, it is
     * ignored.  If dfferent objects evaluate to the same
     * maximum length, the first value found will be returned.
     *
     * @see #min
     * @return The object with the lowest value or undefined.
     * @type Object
     */
    max: function()
    {
        var fn = function(max, next)
        {
            var val;
            if (typeof next == "number")
            {
                val = next;
            }
            else if (next != null && next.length != undefined)
            {
                val = next.length;
            }
            else
            {
                return max;
            }

            if (max == undefined || val > max)
            {
                return val;
            }
            else
            {
                return max;
            }
        }

        return this.reduce(undefined, fn);
    },

    /**
     * Used to determine if the given predicate closure is valid
     * (i.e. returns true for all items in this zing).
     *
     * @param {Function} closure The closure predicate used for matching
     * @return True if all elements return true for the closure
     * @type Boolean
     */
    every: function( closure )
    {
        // Make sure the first argument is a Function.
        if (!_.isFunction(closure)) throw new TypeError();

        var fn = function( accumlator, element )
        {
            return accumlator && closure(element);
        };

        return this.reduce(true, fn);
    },

    /**
     * Iterates over the contents of an object or collection,
     * and checks whether a predicate is valid for at least one element.
     *
     * @param {Function} closure The closure predicate used for matching
     * @return True if any elements returns true for the closure
     * @type Boolean
     */
    any: function( closure )
    {
        // Make sure the first argument is a Function.
        if (!_.isFunction(closure)) throw new TypeError();

        var fn = function( accumlator, element )
        {
            return accumlator || closure(element);
        };

        return this.reduce(false, fn);
    },

    /**
     * Returns an Arrayzing that is a one-dimensional flattening of
     * this Arrayzing (recursively).
     *
     * That is, for every element that is an Array or Arrayzing,
     * extract its elements into the new Arrayzing.
     *
     * For example,
     * _([1, 2], [3, [4]]).flatten() == _(1, 2, 3, 4)
     *
     * This transformation is not mergeable.
     *
     * @return A flattened zing.
     * @type Arrayzing
     */
    flatten: function()
    {
        return this.flatten$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of flatten.
     *
     * @see #flatten
     * @type Arrayzing
     */
    flatten$: function()
    {        
        var fn = function(accumulator, item)
        {
            if ( _.isArray(item) || _.isArrayzing(item) )
                accumulator = accumulator.concat( _(item).flatten$().array() );
            else
                accumulator.push(item);

            return accumulator;
        };

        // The new, flattened array.
        var flattened = this.reduce([], fn);
        this._setArray(flattened);
        this._setIndices([]);

        return this;
    },

    // Methods that modify the elements.

    /**
     * Creates a new array with the results of calling a provided function on
     * every element in this array.
     *
     * @param fn The function to call on each element.
     * @param [context] The object that the function is called on.
     * @return A mapped zing.
     * @type Arrayzing
     */
    map: function( fn /*, context */ )
    {        
        return this.map$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of map.
     *
     * @see #map
     */
    map$: function( fn /*, context */ )
    {       
        if (typeof fn != "function")
            throw new TypeError();
        
        var context = arguments[1];                
        for (var i = 0; i < this.length; i++)
        {            
            if (this.hasKey(i))
            {                
                this[i] = fn.call(context, this[i], i, this);
            }
        }

        return this;
    },

    /**
     * Encloses all elements in the zing with left and optionally right
     * objects.
     */
    enclose: function( left, right )
    {
        return this.enclose$.apply( this.clone(), arguments );
    },

    enclose$: function( left, right )
    {
        return this.prefix$(left).postfix$(right);
    },

    /**
     * Prepend each element with an object.  Prepend will act slightly
     * differently depending on the the passed objects type and the target
     * element.
     *
     * For a String object on a String element, the object will be prepended
     * to the element.
     *
     * For any object on a iterable element, the object will be added to the
     * left side of the iterable element.
     *
     * For any object on an unknown element object, the element will simply
     * be skipped.
     * 
     * @param {Object} object The object to prepend.
     * @return The zing with each element.
     * @type Arrayzing    
     */
    prefix: function( object )
    {
        return this.prefix$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of prepend.
     * 
     * @see #prefix
     */
    prefix$: function( object )
    {
        var fn = function( element )
        {
            if ( _.isString(element) && _.isString(object) )
                return object + element;

            if ( _.isArrayzing(element) )
                return element.insertAt(0, object);

            if ( _.isIterable(element) )
            {
                Array.prototype.unshift.call(element, object);
                return element;
            }

            return element;
        };

        return this.map$(fn);
    },

    /**
     * Append each element with an object.  Append will act slightly
     * differently depending on the the passed objects type and the target
     * element.
     *
     * For a String object on a String element, the object will be appended
     * to the element.
     *
     * For any object on a iterable element, the object will be added to the right side
     * of the iterable element.
     *
     * For any object on an unknown element object, the element will simply
     * be skipped.
     *
     * @param {Object} object The object to append.
     * @return The zing with each element.
     * @type Arrayzing
     */
    postfix: function( object )
    {

    },

    /**
     * Mutator version of append.
     * 
     * @see #append
     * @param {Object} object The object to append.
     * @return The zing with each element.
     * @type Arrayzing
     */
    postfix$: function( object )
    {
        var fn = function( element )
        {
            if ( _.isString(element) && _.isString(object) )
                return element + object;

            if ( _.isArrayzing(element) )
                return element.add(object);

            if ( _.isIterable(element) )
            {
                Array.prototype.push.call(element, object);
                return element;
            }

            return element;
        };

        return this.map$(fn);
    },

    /**
     * Chop off one or more characters/elements from the left side of all
     * elements in the zing.  The default number of characters chopped is 1.
     * 
     * @param {Number} [n] The number of characters to prechop.
     * @return A new zing with prechopped elements.
     * @type Arrayzing
     */
    prechop: function( n )
    {
        return this.prechop$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of prechop.
     *
     * @see #prechop
     * @type Arrayzing
     */
    prechop$: function( n )
    {
        // If n is not passed, set it to 1.
        if (n == undefined) n = 1;
        
        var fn = function( val )
        {
            // Look for iterable item.
            if ( _.isString(val) )
            {
                return val.substr(n);
            }
            else if ( _.isIterable(val) )
            {
                return Array.prototype.slice.call(val, n);
            }
            else
            {
                return val;
            }
        };

        return this.map$(fn);
    },

    /**
     * Chop off one or more digits/characters/elements from the right side of all
     * elements in the zing.  The default number of characters chopped is 1.
     *
     * @param {Number} [n] The number of characters to chop.
     * @return A new zing.
     * @type Arrayzing
     */
    chop: function( n )
    {
        return this.chop$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of chop.
     * @see #prechop
     * @type Arrayzing
     */
    chop$: function( n )
    {
        // If n is not passed, set it to 1.
        if (n == undefined) n = 1;

        var fn = function( val )
        {
            // Look for iterable item.
            if ( _.isString(val) )
            {
                return val.substr(0, val.length - n);
            }
            else if ( _.isIterable(val) )
            {
                return Array.prototype.slice.call(val, 0, val.length - n);
            }
            else
            {
                return val;
            }
        };

        return this.map$(fn);
    },

    toUpper: function()
    {
        return this.toUpper$.apply( this.clone(), arguments );
    },

    toUpper$: function()
    {
        var fn = function(item)
        {
            if (item && item.toUpperCase)
                return item.toUpperCase();

            return item;
        };

        return this.map$(fn);
    },

    toLower: function()
    {
        return this.toLower$.apply( this.clone(), arguments );
    },

    toLower$: function()
    {
        var fn = function(item)
        {
            if (item && item.toLowerCase)
                return item.toLowerCase();

            return item;
        };

        return this.map$(fn);
    },    

    /**
     * Applies the string object's replace method on all strings in the
     * zing.
     * 
     * @see String#replace
     * @param {RegExp} regexp The RegExp object that specifies the pattern
     * to replace.  If it is a string, the string is used as the pattern.
     * @param {String} replacement A string that specifies the replacment text,
     * or a function that can be invoked to provide the replacement text.
     * @return A new zing.
     * @type Arryzing
     */
    replace: function( regexp, replacement )
    {
        return this.replace$.apply( this.clone(), arguments );
    },

    /**
     * Mutator version of replace.
     *
     * @see #replace
     * @type Arrayzing
     */
    replace$: function( regexp, replacement )
    {
        var fn = function(element)
        {
            if ( _.isString(element) )
                return element.replace(regexp, replacement);
            else
                return element;
        }

        return this.map$(fn);
    },

    /**
     * Convert one or all elements using a conversion function.
     * 
     * @param {Function} fn The conversion function.
     * @param {Number} [index] The index to convert.
     * @return The converted zing.
     * @type Arrayzing
     */
    convert: function( fn, index )
    {
        return this.convert$.apply(this.clone(), arguments);
    },

    /**
     * Mutator version of convert.
     *
     * @see #convert
     * @type Arrayzing
     */
    convert$: function( fn, index )
    {
        // Make sure the fn is a function.
        if (typeof fn != "function")
            throw TypeError();

        // If no index is specified, run boolize$ on all indicies.
        if (index == undefined)
        {
            this.map$(fn);
        }
        // If an index is specified, run it on that one.
        else
        {
            this.set$(index, fn(this.get(index)));
        }

        return this;
    },   

    /**
     * Converts all elements in the array to a Number quantity.
     * Quantize will leave any Number untouched, will convert any object with
     * a length property (i.e. a String) to it's length, and any other object
     * will be parsed.  If the function cannot determine a quantity for
     * the object, undefined will be returned.
     *
     * @param {Number} [index] The index to convert.
     * @return The quantized zing.
     * @type Arrayzing
     */
    quantize: function( index )
    {
        return this.convert( _.quantize, index );
    },

    /**
     * Mutator version of quantize.
     *
     * @see #quantize
     * @type Arrayzing
     */
    quantize$: function( index )
    {
        return this.convert$( _.quantize, index );
    },

    /**
     * Turns all elements into Arrays.  If the element is already
     * an Array, it is untouched.  All other objects are enclosed
     * as single elements in an array.  If the element has a toArray
     * function, it will be called.
     *
     * @param {Number} [index] The index to convert.
     * @return An arrayized zing.
     * @type Arrayzing
     */
    arrayize: function( index )
    {
        return this.convert( _.arrayize, index );
    },

    /**
     * Mutator version of arrayize.
     *
     * @see #arrayize
     * @type Arrayzing
     */
    arrayize$: function( index )
    {
        return this.convert$( _.arrayize, index );
    },

    /**
     * Convert one or all elements to Boolean objects.  If the element has a
     * toBoolean function, it will be called.
     *
     * @param {Number} [index] The index to convert.
     * @return A boolized zing.
     * @type Arrayzing
     */
    boolize: function( index )
    {
        return this.convert( _.boolize, index );
    },

    /**
     * Mutator version of boolize.
     *
     * @see #boolize
     * @type Arrayzing
     */
    boolize$: function( index )
    {
        return this.convert$( _.boolize, index );
    },

    /**
     * Convert one or all elements to Number objects.  If the element has a
     * toNumber function, it will be called.  If the element is true or false,
     * it will be converted to 1 or 0 (instead of NaN).
     *
     * @param {Number} [index] The index to convert.
     * @return A numberized zing.
     * @type Arrayzing
     */
    numberize: function( index )
    {
        return this.convert( _.numberize, index );
    },

    /**
     * Mutator version of numberize.
     *
     * @see #numberize
     * @type Arrayzing
     */
    numberize$: function ( index )
    {
        return this.convert$( _.numberize, index );
    },

    /**
     * Convert one or all elements to String objects.  If the element has a
     * toString function, it will be called.
     *
     * @param {Number} [index] The index to convert.
     * @return A strized zing.
     * @type Arrayzing
     */
    strize: function( index )
    {
        return this.convert( _.strize, index );
    },

    /**
     * Mutator version of strize.
     *
     * @see #boolize
     * @type Arrayzing
     */
    strize$: function( index )
    {
        return this.convert$( _.strize, index );
    },

    /**
     * Alias of toString.
     *
     * @see #toString
     */
    str: function()
    {
        return this.toString.apply(this, arguments);
    },   

    /**
     * Convert the zing to a human-readable String.
     *
     * @return The zing as String (it rhymes!)
     * @type String
     */
    toString: function()
    {
        return Array.prototype.join.apply( this, [ "," ] );
    },

    /**
     * Alias of toArray.
     *
     * @see #toArray
     * @type Array
     */
    array: function()
    {
        return this.toArray.apply(this, arguments);
    },

    /**
     * Convert the zing to an Array.
     * 
     * @return The zing as an Array (does not rhyme).
     * @type Array
     */
    toArray: function()
    {
        return Array.prototype.slice.apply( this, [ 0, this.length ] );
    }
};
	
// Map the fn namespace to the prototype.
Arrayzing.fn = Arrayzing.prototype;	
	
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
    is: function( type, object )
    {
        return ( object && object.constructor == type );
    },

    isArray: function( object )
    {
        return _.is(Array, object);
    },

    isArrayzing: function( object )
    {
        return _.is(Arrayzing, object);
    },

    isIterable: function( object )
    {
        if ( object && !_.isString(object) &&
            (  _.isArray(object)
            || _.isArrayzing(object)
            || object.length != undefined) )
        {
            return true;
        }

        return false;
    },

    isBoolean: function( object )
    {
        return _.is(Boolean, object);
    },

    isFunction: function( object )
    {
        return (typeof object == "function")
            || _.is( Function, object );
    },

    isNumber: function( object )
    {
        return (typeof object == "number")
            || _.is( Number, object );
    },

    isRegExp: function( object )
    {
        return _.is( RegExp, object );
    },

    isString: function( object )
    {
        return (typeof object == "string")
            || _.is( String, object );
    },

    quantize: function( object )
    {
        if ( _.isNumber(object) )
        {
            return object;
        }
        else if ( _.isIterable(object) || _.isString(object) )
        {
            return object.length;
        }

        var floatVal = parseFloat(object);
        if ( !isNaN(floatVal) ) return floatVal;

        return undefined;
    },

    arrayize: function( object )
    {
        if (object == undefined || object == null)
        {
            return undefined;
        }
        else if ( _.isArray(object) )
        {
            return object;
        }
        else if ( _.isFunction(object.toArray) )
        {
            return object.toArray();
        }
        else
        {
            return [ object ];
        }
    },

    /**
     * Convert an object to a Boolean object.  If the object has a
     * toBoolean function, it will be called.
     * 
     * @param {Object} object The object to convert.
     * @return The converted object.
     * @type Boolean
     */
    boolize: function( object )
    {
        if (object == undefined || object == null)
        {
            return false;
        }
        else if ( _.isBoolean(object) )
        {
            return object;
        }
        else if ( _.isFunction(object.toBoolean) )
        {
            return object.toBoolean();
        }
        else
        {
            return !!object;
        }
    },

    /**
     * Convert an object to a Number object.  If the object has a
     * toNumber function, it will be called.
     *
     * @param {Object} [object] The object to convert.
     * @return The converted object.
     * @type Number
     */
    numberize: function( object )
    {
        if (object == undefined || object == null)
        {
            return 0;
        }
        else if ( _.isNumber(object) )
        {
            return object;
        }
        else if ( _.isFunction(object.toNumber) )
        {
            return object.toNumber();
        }

        var n = Number(object);
        if (!isNaN(n)) return n;
        else return parseFloat(object);
    },

    /**
     * Convert an object to a String object.  If the object has a
     * toString function, it will be called.
     * 
     * @param {Object} [object] The object to convert.
     * @return The converted object.
     * @type String
     */
    strize: function( object )
    {
        return "" + object;
    },
	
    /**
     * Create a new Arrayzing with the given
     * size, populated wth the given value.
     * 
     * @param {Number} size
     * @param {Object} value
     */
    fill: function( size, value )
    {
        var zing = _();
        
        for (var i = 0; i < size; i++)        
            zing.add(value);
        
        return zing;
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
    }
    
});

})();