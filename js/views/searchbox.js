var app = app || {};

(function() {

    var SearchBox = Backbone.View.extend({
        el: '#search-box',
        events: {
            'keypress input': 'onInputEnter',
            'click .glyphicon-search': 'search'
        },

        initialize: function() {
            //this.$('.glyphicon-search').click(function() {
                //alert('kkk');
            //});
        },
        
        onInputEnter: function(e) {
            if (e.which == 13) {
                this.search();
            }
        },

        search: function() {
            var tags = this.$('input').val();
            if ( !tags.trim() ) {
                //alert('tags needed');
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
