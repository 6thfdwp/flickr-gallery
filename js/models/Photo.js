var app = app || {};

(function() {
    /**
     * Model class representing photo information 
     * 
     */
    app.Photo = Backbone.Model.extend({
        initialize: function(attrs, options) {
            var imgUrl = ['https://farm', attrs.farm, '.static.flickr.com/',
                         attrs.server, '/', attrs.id, '_', attrs.secret, '_q.jpg'].join('');
            var link = ['https://farm', attrs.farm, '.static.flickr.com/',
                         attrs.server, '/', attrs.id, '_', attrs.secret, '_b.jpg'].join('');

            // the link for slide show
            this.set('link', link);
            // the url for thumbnail
            this.set('imgUrl', imgUrl);
        }
    });
}) ();
