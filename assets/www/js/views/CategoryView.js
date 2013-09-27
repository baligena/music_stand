// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/CategoryModel" ], function( $, Backbone, CategoryModel ) {

    // Extends Backbone.View
    var CategoryView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {
            //console.log(this.collection)
            // The render method is called when Category Models are added to the Collection
            this.collection.on( "added", this.render, this );
            //this.collection.on('balls', function(){alert('view_balls')}, this); 
            this.collection.on('balls', this.render, this); 

            //console.log(this.collection );
            
        },

        // Renders all of the Category models on the UI
        render: function() {
            alert('render page');
            // Sets the view's template property
            //console.log(this.collection);
            this.template = _.template( $( "script#categoryItems" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul").html(this.template);

            // Maintains chainability
            return this;

        }

    } );

    // Returns the View class
    return CategoryView;

} );