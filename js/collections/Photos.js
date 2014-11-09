var app = app || {};

(function() {
    var Photos = Backbone.Collection.extend({
        model: app.Photo,
        url: 'https://api.flickr.com/services/rest/',

        initialize: function() {
            this.page = 1;
            this.params = {
                data: { // query params for flickr api
                    format: 'json',
                    api_key: 'f07c47bed21db4af906afc5174ab22cb',
                    method: 'flickr.photos.search',
                    per_page: 50, page: 1,
                    tags: 'architecture'
                },
                dataType: 'jsonp',
                jsonp: 'jsoncallback'
            }
        },

        /**
         * override Extract attributes required by Photo model
         *
         * @param {JSON} response returned through Flickr rest API
         * @return {array} of photo objects
         */
        parse: function(response) {
            console.info('page ' + response.photos.page);
            console.info('pages ' + response.photos.pages);
            console.info('total ' + response.photos.total);
            console.info('fetched photos: ' + response.photos.photo.length);

            return response.photos.photo;
        },

        /**
         * Override Backbone sync to merge the query params
         * before issuing ajax request
         *
         * @param {Object} options that passed to collection fetch method
         *
         *  The properties in options can be divided to two parts
         *  {Object} params: for flickr search api use
         *  others: used to tell Backbone how to change the underlying
         *      collection after response returned
         */
        sync: function(method, collection, options) {
            if (options.params) {
                // merge more params (tags, page etc.) for flickr search api
                _.extend(this.params.data, options.params);
            }
            _.extend(this.params, options); 
            Backbone.sync(method, collection, this.params);
        },

    });

    app.photos = new Photos();
}) ();
