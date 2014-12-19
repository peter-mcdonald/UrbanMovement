function getDataFromMixcloud(user, appendTo) {

    $(appendTo).empty();

    $.ajax({
        url: "http://api.mixcloud.com/" + user + "/cloudcasts/",
        async: true,
        cache: true,
        success: function (data) {
            processMixCloudTracks(data, appendTo);
        },
        dataType: 'json',
        beforeSend: setHeader
    });
}


function processMixCloudTracks(data, element) {
    var frame = '<iframe width="660" height="180" src="https://www.mixcloud.com/widget/iframe/?feed=#URL&amp;embed_uuid=33e357b5-67b2-467c-a65c-0bb81758cf6d&amp;replace=0&amp;hide_cover=1&amp;embed_type=widget_standard&amp;hide_tracklist=1" frameborder="0"></iframe>';

    for (var i = 0; i < data.data.length; i++) {        
        $(element).append(frame.replace('#URL', encodeURIComponent(data.data[i].url)));
    }
}




