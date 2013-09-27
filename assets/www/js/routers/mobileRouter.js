// Mobile Router
// =============

// Includes file dependencies
define([ "jquery","backbone", "../models/CategoryModel", "../collections/CategoriesCollection", "../collections/CifraCollection", "../views/HomeView", "../views/CifraView", "../collections/localStorageCollection", '../views/DatabaseView', 'stacktrace' ], function( $, Backbone, CategoryModel, CategoriesCollection, CifraCollection, HomeView, CifraView, localStorageCollection, DatabaseView, stacktrace ) {

    // Extends Backbone.Router
    var CategoryRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // Backbone.js Routesasdfsf
        routes: {

            // When there is no hash bang on the url, the home method is called
            "": "home",

            "song?:id": "song",

            "database": "database",

        },

        // Home method
        home: function() {



            var collection = new localStorageCollection();
            

            collection.fetch().done(function(){
                    var view = new HomeView({ collection: collection });
                    $.mobile.changePage( "#home", { reverse: false, changeHash: false } );
            });          





            // Programatically changes to the categories page
//            $.mobile.changePage( "#categories" , { reverse: false, changeHash: false } );

        },

        // Category method that passes in the type that is appended to the url hash
        category: function(type) {
        
            // Stores the current Category View  inside of the currentView variable
            var currentView = this[ "animalsView" ];

            // If there are no collections in the current Category View
            if(!currentView.collection.length) {
                //update database
                // Show's the jQuery Mobile loading icon
                $.mobile.loading( "show" );
                
                currentView.collection.getJSON(type).done( function(){
                  currentView.collection.fetch().done( function() {
                        // Programatically changes to the current categories page
                        $.mobile.changePage( "#" + "animals", { reverse: false, changeHash: false } );
                    });
                })
            }

            // If there already collections in the current Category View
            else {

                // Programatically changes to the current categories page
                $.mobile.changePage( "#" + type, { reverse: false, changeHash: false } );

            }

        },
        song: function(id){
            $.mobile.loading( "show" );
                
            var collection = new localStorageCollection;

            collection.fetch().done(function(){
                console.log(collection)
                    var view = new CifraView({el:'#cifra', model: collection.at(id)});
                    $.mobile.changePage( "#cifra", { reverse: false, changeHash: false } );
            });
                    
        },


        database: function(){
            storageCollection = new localStorageCollection();
            storageCollection.fetch().done(function(){
                console.log(storageCollection);
                var view = new DatabaseView( {collection:storageCollection} )

            });
            
        },



    } );

    // Returns the Router class
    return CategoryRouter;

} );