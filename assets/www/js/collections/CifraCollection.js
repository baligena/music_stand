// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/CategoryModel"], function( $, Backbone, CategoryModel) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {
        url:'http://baligena.com/laravel4/public/contacts',

        model: CategoryModel,
    
    } );

    // Returns the Model class
    return Collection;

} );