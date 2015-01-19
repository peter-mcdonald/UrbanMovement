// Find user id from name - needed for tracks.....
// http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/##USER-NAME##&client_id=2d7cc150f9e5813c0d93236b3312654c
var SoundCloud = function (storage) {
    this.storage = storage;
};

SoundCloud.prototype.getData = function (id, appendTo) {
    
    var url = "http://api.soundcloud.com/users/" + id + "/tracks.json?client_id=2d7cc150f9e5813c0d93236b3312654c";

    if (this.storage.exists(url)) {
        this.processTracks(this.storage.get(url), appendTo);
        stopSpinner();
        return;
    }

    var that = this;

    $.ajax({
        url: url,
        async: true,
        cache: true,
        success: function (data) {
            that.storage.set(url, data);
            that.processTracks(data, appendTo);
            stopSpinner();
        },
        dataType: 'json',
    });
};

SoundCloud.prototype.processTracks = function (tracks, element) {
    var frame = '<iframe class="center iframe" src="https://w.soundcloud.com/player/?url=#URL#&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';

    for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].embeddable_by === "all") {
            $(element).append(frame.replace('#URL', tracks[i].uri));
        }
    }
};