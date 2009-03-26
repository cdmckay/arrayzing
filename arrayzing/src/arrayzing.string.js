(function($a){
/*
 * Arrayzing String Plugin
 *
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 */

Arrayzing.extend({

    capitalized: function()
    {
        return this.filter( /^[A-Z][a-z\s]*$/ );
    }

});

})(Arrayzing);


