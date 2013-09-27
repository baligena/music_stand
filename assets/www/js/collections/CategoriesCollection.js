// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/CategoryModel","stacktrace"], function( $, Backbone, CategoryModel, stacktrace) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {
        url: 'http://localhost/laravel4_backbone_contact_manager/public/contacts',


      fetch: function(options) { //override backbone default 
        options = options ? _.clone(options) : {};
        if (options.parse === undefined) options.parse = true;
        var collection = this;
        var success = options.success;
        options.success = function(resp, status, xhr) {
          collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
          if (success) success(collection, resp);
        };
        options.error = Backbone.wrapError(options.error, collection, options);
        
        //IF no internet connection get from DB
        if (2 == 3){
            return (this.sync || Backbone.sync).call(this, 'read', this, options);
        }  
        else {  //ELSE update DB
            return (this.database_sync || Backbone.sync).call(this, 'read', this, options);
        }
      },


        // Sets the Collection model property to be a Category Model
        model: CategoryModel,



      jsonArray: function(){

        object = [{"id":"19","first_name":"John","last_name":"asdf","email":"asdfasdf","description":"asdf","created_at":"2013-06-04 14:57:35","updated_at":"2013-06-04 20:46:08"},{"id":"52","first_name":"test","last_name":"","email":"aassdf16","description":"","created_at":"2013-06-13 15:35:23","updated_at":"2013-06-13 15:35:23"},{"id":"53","first_name":"","last_name":"","email":"asdf3","description":"","created_at":"2013-06-13 15:47:19","updated_at":"2013-06-13 15:47:19"},{"id":"54","first_name":"","last_name":"","email":"aassdf13","description":"","created_at":"2013-06-13 16:30:06","updated_at":"2013-06-13 16:30:06"}];
        localStorage.setItem('testObject', JSON.stringify(object));

        var retrieve = localStorage.getItem('testObject')

        //console.log(JSON.parse(retrieve))
        return JSON.parse(retrieve);
      },

        // Sample JSON data that in a real app will most likely come from a REST web service
        jsonArray2: [

            { "category": "animals", "type": "Pets" },

            { "category": "animals", "type": "Farm Animals" },

            { "category": "animals", "type": "Wild Animals" },

            { "category": "colors", "type": "Blue" },

            { "category": "colors", "type": "Green" },

            { "category": "colors", "type": "Orange" },

            { "category": "colors", "type": "Purple" },

            { "category": "colors", "type": "Red" },

            { "category": "colors", "type": "Yellow" },

            { "category": "colors", "type": "Violet" },

            { "category": "vehicles", "type": "Cars" },

            { "category": "vehicles", "type": "Planes" },

            { "category": "vehicles", "type": "Construction" },

            { "category": "me", "type": "Felipe" }

        ],

        // Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
        database_sync: function( method, model, options ) {
            // Local Variables
            // ===============
            // Stores the this context in the self variable
            self = this;

            // Creates a jQuery Deferred Object
            deferred = $.Deferred();


      //      console.log(window.asdf)
            // Calls the options.success method and passes an array of objects (Internally saves these objects as models to the current collection)

/*
            this.jsonArray().done(function(){
                console.log(window.asdf)
            })
  */          
            options.success( this.jsonArray() );

            // Triggers the custom `added` method (which the Category View listens for)
            self.trigger( "added" );

            // Resolves the deferred object (this triggers the changePage method inside of the Category Router)
            deferred.resolve();


            // Returns the deferred object
            return deferred;

        }

    } );

    // Returns the Model class
    return Collection;

} );