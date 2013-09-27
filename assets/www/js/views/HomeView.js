// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/CategoryModel" ], function( $, Backbone, CategoryModel ) {

    // Extends Backbone.View
    var CategoryView = Backbone.View.extend( {
        el: '#categories',
        
        // The View Constructor
        initialize: function() {
    		this.render()
    	
        },

        render: function() {
    		this.template = _.template( $( "script#categoryItems" ).html(), { "collection": this.collection } );
            this.$el.find("ul").html(this.template);

            return this;

        }

    } );

    return CategoryView;

} );