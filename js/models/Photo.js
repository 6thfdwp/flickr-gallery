var app = app || {};

(function() {
    /**
     * Model class representing photo information 
     * 
     */
    app.Photo = Backbone.Model.extend({
        url: 'https://api.flickr.com/services/rest/',

        initialize: function(attrs, options) {
            var imgUrl = ['https://farm', attrs.farm, '.static.flickr.com/',
                         attrs.server, '/', attrs.id, '_', attrs.secret, '_q.jpg'].join('');
            var link = ['https://farm', attrs.farm, '.static.flickr.com/',
                         attrs.server, '/', attrs.id, '_', attrs.secret, '_b.jpg'].join('');

            // the link for slide show
            this.set('link', link);
            // the url for thumbnail
            this.set('imgUrl', imgUrl);
            this.params = {
                data: { // query params for geting photo info
                    format: 'json',
                    api_key: 'f07c47bed21db4af906afc5174ab22cb',
                    method: 'flickr.photos.getInfo',
                    photo_id: this.get('id')
                },
                dataType: 'jsonp',
                jsonp: 'jsoncallback'
            }
        },

        parse: function(resp, options) {
            // photos.fetch also triggers model.parse 
            // because default options.parse=true
            if (resp.photo) { // this is for photo.fetch response
                var info = _.pick(resp.photo.owner, 'nsid', 'realname', 'location');
                info.views = resp.photo.views;
                info.author = resp.photo.owner.username;
                return info;
            }
            // this is for photos.fetch response
            return resp;
        },

        sync: function(method, collection, options) {
            // merge options passed in if exists
            _.extend(this.params, options);
            Backbone.sync(method, collection, this.params);
        }
    });
}) ();
