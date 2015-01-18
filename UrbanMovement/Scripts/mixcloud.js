var MixCloud = function (storage) {
    this.storage = storage;
};

MixCloud.prototype.getData = function(user, appendTo) {

    var url = "http://api.mixcloud.com/" + user + "/cloudcasts/";

    if (this.storage.exists(url)) {
        this.processTracks(this.storage.get(url), appendTo);
        stopSpinner();
        return;
    }

    var that = this;

    $.ajax({
        type: "GET",
        url: url,
        async: true,
        cache: true,
        success: function (data) {
            that.storage.set(url, data);
            that.processTracks(data, appendTo);
            stopSpinner();
        },
        dataType: 'json',
        beforeSend: setHeader
    });
}


MixCloud.prototype.processTracks = function(data, element) {
    var frame = '<iframe width="660" height="180" src="https://www.mixcloud.com/widget/iframe/?feed=#URL&amp;embed_uuid=33e357b5-67b2-467c-a65c-0bb81758cf6d&amp;replace=0&amp;hide_cover=1&amp;embed_type=widget_standard&amp;hide_tracklist=1" frameborder="0"></iframe>';

    for (var i = 0; i < data.data.length; i++) {
        $(element).append(frame.replace('#URL', encodeURIComponent(data.data[i].url)));
    }
};




