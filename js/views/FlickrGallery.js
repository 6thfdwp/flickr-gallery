var app = app || {};

(function() {
    var FlickrGallery = Backbone.View.extend({
        //el: '#thumbnails',
        el: $(document),
        tpl: _.template( $('#thumbnail-tpl').html() ),
        //photoInfoTpl: _.template( $('#photoinfo-tpl').html() ),

        events: {
            'scroll': 'loadMore',
            'slide #blueimp-gallery': 'onSlide'
        },

        initialize: function(options) {
            //this.$el.jscroll();
            this._curPage = 1;

            this.$thumbnails = this.$('#thumbnails');
            this.$thumbnails.ajaxMask();
            // initial fetching when page first loaded
            app.photos.fetch({reset: true});

            this.$galleryAuthor = this.$('#blueimp-gallery .author');
            this.$photoViews = this.$('#blueimp-gallery .views .vnumber');

            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.onSync);
            this.listenTo(this.collection, 'add', this.onAdd);
            this.listenTo(this.collection, 'change', this.renderPhotoInfo);
        },

        /**
         * Render the whole new images when Photos collection is reset
         * including initial page load or tags searching
         */
        render: function() {
            var imgItems = [];
            this.$thumbnails.empty();
            this._curPage = 1;

            console.dir('first fetched photos: ' + this.collection.length);
            this.collection.each(function(photo) {
                //console.info(photo.attributes);
                imgItems.push( this.tpl(photo.toJSON()) );
            }, this);
            //this.$el.append(imgItems);
            this.$thumbnails.append(imgItems);
        },

        loadMore: function() {
            // scrollPosition keeps increasing when scrolling down
            var scrollPosition = $(window).height() + $(window).scrollTop();

            if ( scrollPosition == this.$el.height() ) {
                this.$thumbnails.ajaxMask();
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
         * @param {JSON} resp that returned by flickr api
         * @param {Object} options that used in collection.fetch
         */
        onSync: function(photos, resp, options) {
            console.dir('photoes fetched');
            this.$thumbnails.ajaxMask( {stop: true} );
        },

        onAdd: function(photo, photos, options) {
            console.dir('photo model added to collection');
            this.$thumbnails.append( this.tpl(photo.toJSON()) );
        },

        onSlide: function(e, idx, slide) {
            var photo = this.collection.at(idx);
            if (photo.get('author') != undefined) {
                this.renderPhotoInfo(photo);
                return;
            }
            // fetch the photo info
            photo.fetch({
                //success: function(photo, resp, options) {
                //}
            });
            //photo.fetchFaves();
        },

        // render info for the photo currently showing
        renderPhotoInfo: function(photo) {
            var author = photo.get('author');
            var pstreamUrl = ['https://www.flickr.com/photos/', photo.get('nsid')].join('');
            console.dir(author);
            this.$galleryAuthor
                .text('by ' + author).attr('href', pstreamUrl);
            this.$photoViews.text( photo.get('views') + ' views')
        }
    });
    
    app.flickrGallery = new FlickrGallery({
        collection: app.photos
    });

}) ();
