// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/CategoryModel" ], function( $, Backbone, CategoryModel ) {

    // Extends Backbone.View
    var CategoryView = Backbone.View.extend( {
        
        // The View Constructor
        initialize: function() {
    		this.render()
    	
        },

        render: function() {
    	    //this.template = _.template( $( "script#categoryItems" ).html(), { "collection": this.collection } );
            this.$el.find("p").html(this.model.get('description'));

            return this;

        }

    } );

    return CategoryView;

} );