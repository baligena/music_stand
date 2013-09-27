// Includes file dependencies
define([ "jquery", "backbone","models/CategoryModel" ], function( $, Backbone, CategoryModel ) {

    // Extends Backbone.View
    var View = Backbone.View.extend( {
        
        // The View Constructor
        initialize: function() {
			this.render();
			//IF INTERNET GET
    		this.get();
    	},

    	get: function(){
            this.collection.each(function(model){
                console.log(model.get('email'));
            });
        },

        render: function() {
    		return this;
        }

    } );

    return View;

} );