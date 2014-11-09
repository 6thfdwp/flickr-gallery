var app = app || {};

(function() {

    /**
     * View represents search by tags area
     *
     */
    var SearchBox = Backbone.View.extend({
        el: '#search-box',
        events: {
            'keypress input': 'onInputEnter',
            'click .glyphicon-search': 'search'
        },

        initialize: function() {

        },
        
        onInputEnter: function(e) {
            if (e.which == 13) {
                this.search();
            }
        },

        search: function() {
            var tags = this.$('input').val();
            if ( !tags.trim() ) {
                return;
            }
            app.flickrGallery.$thumbnails.ajaxMask();
            // fetch photos for the searched tags
            app.photos.fetch({
                reset: true,
                params: {
                    page: 1,
                    tags: tags, tag_mode: 'all'
                }
            });
        }
    });

    app.searchbox = new SearchBox();
}) ();
