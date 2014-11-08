var app = app || {};

(function() {
    var FlickrGallery = Backbone.View.extend({
        //el: '#thumbnails',
        el: $(document),
        tpl: _.template( $('#thumbnail-tpl').html() ),
        events: {
            'scroll': 'loadMore',
            'slide #blueimp-gallery': 'onSlide'
        },

        initialize: function(options) {
            //this.$el.jscroll();
            this._curPage = 1;

            this.$gallery = this.$('#thumbnails');
            this.$gallery.ajaxMask();
            // initial fetching when page first loaded
            app.photos.fetch({reset: true})

            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.onSync)
            this.listenTo(this.collection, 'add', this.onAdd);
        },

        /**
         * Render the whole new images when Photos collection is reset
         * including initial page load or tags searching
         */
        render: function() {
            var imgItems = [];
            this.$gallery.empty();
            this._curPage = 1;

            console.dir('first fetched photos: ' + this.collection.length);
            this.collection.each(function(photo) {
                //console.info(photo.attributes);
                imgItems.push( this.tpl(photo.toJSON()) );
            }, this);
            //this.$el.append(imgItems);
            this.$gallery.append(imgItems);
        },

        loadMore: function() {
            // scrollPosition keeps increasing when scrolling down
            var scrollPosition = $(window).height() + $(window).scrollTop();
            //console.info(scrollPosition);

            if ( scrollPosition == this.$el.height() ) {
                this.$gallery.ajaxMask();
                this._curPage += 1;
                // fetch next page of photos, will automatically call
                // collection.set when response is returned successfully
                this.collection.fetch({
                    remove: false,
                    params: {
                        page: this._curPage
                    },
                    success: function() {
                        //
                    }
                });
            }
        },

        /**
         * Triggered when response is successfully returned
         * can do some post processing here
         *
         * @param {Collection} photos that issues 'fetch' request
         * @param {JSON} resp that returned
         * @param {Object} options that used in request
         */
        onSync: function(photos, resp, options) {
            console.dir('photoes fetched');
            this.$gallery.ajaxMask( {stop: true} );
        },

        onAdd: function(photo, photos, options) {
            console.dir('photo model added to collection');
            this.$gallery.append( this.tpl(photo.toJSON()) );
        },

        onSlide: function() {
            //
        }
    });
    
    app.flickrGallery = new FlickrGallery({
        collection: app.photos
    });

}) ();
