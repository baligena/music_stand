
// Includes file dependencies
define([ "jquery","backbone","models/CategoryModel","stacktrace",'libs/jquery-ajax-localstorage-cache'], function( $, Backbone, CategoryModel, stacktrace,cache) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {
        model: CategoryModel,

        url: 'http://baligena.com/laravel4/public/contacts',

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
        
            //IF internet connection get from DB

            var networkState = navigator.network.connection.type;
            
            //works only in mobile. chrome shows error.  

            if (networkState != 'none'){
                return (this.sync || Backbone.sync).call(this, 'read', this, options);
            }  
            else {  //ELSE update DB
                return (this.database_sync || Backbone.sync).call(this, 'read', this, options);
            }
        },

        jsonArray: function(){

            var retrieve = localStorage.getItem('cifras')

            return JSON.parse(retrieve);
        },

        sync : function(method, model, options) {


            var getValue = function(object, prop) {
                if (!(object && object[prop])) return null;
                return _.isFunction(object[prop]) ? object[prop]() : object[prop];
            };

            var type = 'GET';

            // Default options, unless specified.
            options || (options = {});

            // Default JSON-request options.
            var params = {
                type: type, 
                dataType: 'json'
            };

            // Ensure that we have a URL.
            if (!options.url) {
                params.url = getValue(model, 'url') || urlError();
            }

            // Ensure that we have the appropriate request data.
            if (!options.data && model && (method == 'create' || method == 'update')) {
                params.contentType = 'application/json';
                params.data = JSON.stringify(model.toJSON());
            }

            // For older servers, emulate JSON by encoding the request into an HTML-form.
            if (Backbone.emulateJSON) {
                params.contentType = 'application/x-www-form-urlencoded';
                params.data = params.data ? {
                    model: params.data
                    } : {};
            }

            // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
            // And an `X-HTTP-Method-Override` header.
            if (Backbone.emulateHTTP) {
                if (type === 'PUT' || type === 'DELETE') {
                    if (Backbone.emulateJSON) params.data._method = type;
                    params.type = 'POST';
                    params.beforeSend = function(xhr) {
                        xhr.setRequestHeader('X-HTTP-Method-Override', type);
                    };
                }
            }

            // Don't process data on a non-GET request.
            if (params.type !== 'GET' && !Backbone.emulateJSON) {
                params.processData = false;
            }

            localStorage.clear()

            var cache = {
                localCache : true,
                cacheTTL    : '1',
                cacheKey     : 'cifras',
                isCacheValid : function(){
                    return true;
                }
            }

            console.log(_.extend(params, options, cache))
            return $.ajax(_.extend(params, options));
        },

        // Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
        database_sync: function( method, model, options ) {
            // Local Variables
            // ===============
            // Stores the this context in the self variable
            self = this;

            // Creates a jQuery Deferred Object
            deferred = $.Deferred();
         
            options.success( this.jsonArray() );

            // Triggers the custom `added` method (which the Category View listens for)
            self.trigger( "added" );

            // Resolves the deferred object (this triggers the changePage method inside of the Category Router)
            deferred.resolve();


            // Returns the deferred object
            return deferred;
        }

    } );
    
    return Collection;

} );