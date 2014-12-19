// Find user id from name - needed for tracks.....
// http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/##USER-NAME##&client_id=2d7cc150f9e5813c0d93236b3312654c

function getDataFromSoundcloud(id, appendTo) {

    $(appendTo).empty();

    $.ajax({
        url: "http://api.soundcloud.com/users/" + id + "/tracks.json?client_id=2d7cc150f9e5813c0d93236b3312654c",
        async: true,
        cache: true,
        success: function (data) {
            processTracks(data, appendTo);
        },
        dataType: 'json',
        beforeSend: setHeader
    });
}

function processTracks(tracks, element) {
    var frame = '<iframe class="center iframe" src="https://w.soundcloud.com/player/?url=#URL#&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';

    for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].embeddable_by === "all") {
            $(element).append(frame.replace('#URL', tracks[i].uri));
        }
    }
}

function setHeader(xhr) {
    if (xhr && xhr.overrideMimeType) {
        xhr.overrideMimeType("application/j-son;charset=UTF-8");
    }
}