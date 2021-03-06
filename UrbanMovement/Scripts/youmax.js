var youTubeChannelURL = "";
var youTubePlaylistURL = "";
var youmaxDefaultTab = "featured";
var youmaxColumns = 2;
var youmaxWidgetWidth = 640;
var youmaxWidgetHeight = "";
var showFeaturedVideoOnLoad = false;
var showVideoInLightbox = true;

if (typeof youmaxWidgetHeight !== 'undefined') {
    if (null != youmaxWidgetHeight && youmaxWidgetHeight != "" && youmaxWidgetHeight != "undefined")
        $('html > head').append('<style>#youmax{overflow-y:auto;height:' + youmaxWidgetHeight + 'px;}</style>');
}

var youmaxUser;
var youmaxFeaturedPlaylistId;
var youtubeMqdefaultAspectRatio = 300 / 180;
var youtubeVideoAspectRatio = 640 / 360;


function secondsToTime(duration) {
    if (null == duration || duration == "" || duration == "undefined")
        return "?";

    var minutes = Math.floor(duration / 60);

    var seconds = duration % 60;

    if (seconds < 10)
        seconds = "0" + seconds;

    var time = minutes + ":" + seconds;
    return time;

}

function getDateDiff(timestamp) {
    if (null == timestamp || timestamp == "" || timestamp == "undefined")
        return "?";
    var splitDate = ((timestamp.toString().split('T'))[0]).split('-');
    var d1 = new Date();

    var d1Y = d1.getFullYear();
    var d2Y = parseInt(splitDate[0], 10);
    var d1M = d1.getMonth();
    var d2M = parseInt(splitDate[1], 10);

    var diffInMonths = (d1M + 12 * d1Y) - (d2M + 12 * d2Y);

    if (diffInMonths <= 1)
        return "1 month";
    else if (diffInMonths < 12)
        return diffInMonths + " months";

    var diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears <= 1)
        return "1 year";
    else if (diffInYears < 12)
        return diffInYears + " years";

}

function getReadableNumber(number) {
    if (null == number || number == "" || number == "undefined")
        return "?";

    number = number.toString();
    var readableNumber = '';
    var count = 0;
    for (var k = number.length; k >= 0; k--) {
        readableNumber += number.charAt(k);
        if (count == 3 && k > 0) {
            count = 1;
            readableNumber += ',';
        } else {
            count++;
        }
    }
    return readableNumber.split("").reverse().join("");
}


function loadYoumax() {
    log("loadYoumax");
    $('#youmax').append('<div id="youmax-header"><div id="youmax-stat-holder"></div></div>');
    $('#youmax').append('<div id="youmax-tabs"><span id="youmax-featured" class="youmax-tab">Featured</span><span id="youmax-uploads" class="youmax-tab">Uploads</span><span id="youmax-playlists" class="youmax-tab">Playlists</span></div>');
    $('#youmax').append('<div id="youmax-encloser"><iframe id="youmax-video" width="' + (youmaxWidgetWidth - 2) + '" height="' + (youmaxWidgetWidth / youtubeVideoAspectRatio) + '" src="" frameborder="0" allowfullscreen></iframe><div id="youmax-video-list-div"></div></div>');
    $('#youmax-video').hide();
    $('#youmax').append('<div id="youmax-lightbox"><div style="width:100%; position:absolute; top:20%;"><iframe id="youmax-video-lightbox" width="640" height="360" src="" frameborder="0" allowfullscreen></iframe></div></div>');
    $('#youmax-lightbox').hide();
    
    //$("#youmax-featured").click();
}

function prepareYoumax(channel) {
    youTubeChannelURL = channel;
    $('#youmax').empty();
    //$('#youmax').removeData();
    if (youTubeChannelURL.indexOf("youtube.com/user/") != -1) {
        if (null != youTubeChannelURL && youTubeChannelURL.indexOf("?feature") != -1)
            youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/") + 17, youTubeChannelURL.indexOf("?feature"));
        else
            youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/") + 17);
    }

    loadYoumax();
    showLoader();

    $('.youmax-tab').click(function () {
        $('.youmax-tab').css('color', '#666');
        $('.youmax-tab').css('background-color', 'rgb(230,230,230)');
        $('.youmax-tab').css('text-shadow', '0 1px 0 #fff');

        $(this).css('color', '#eee');
        $(this).css('background-color', '#999');
        $(this).css('text-shadow', '0 0');

        var youmaxTabId = this.id;
        youmaxFeaturedPlaylistId = undefined;
        
        if (youmaxTabId == "youmax-featured")
            initFeaturedVideos();
        if (youmaxTabId == "youmax-uploads")
            getUploads();
        if (youmaxTabId == "youmax-playlists")
            getPlaylists();
    });


    if (typeof youmaxDefaultTab === 'undefined' || null == youmaxDefaultTab || youmaxDefaultTab == "" || youmaxDefaultTab == "undefined") {
        $("#youmax-featured").click();
    } else if (youmaxDefaultTab.toUpperCase() == 'UPLOADS' || youmaxDefaultTab.toUpperCase() == 'UPLOAD') {
        $("#youmax-uploads").click();
    } else if (youmaxDefaultTab.toUpperCase() == 'PLAYLISTS' || youmaxDefaultTab.toUpperCase() == 'PLAYLIST') {
        $("#youmax-playlists").click();
    } else {
        log("default click");
        $("#youmax-featured").click();
    }

    var apiProfileURL = "http://gdata.youtube.com/feeds/api/users/" + youmaxUser + "?v=2&alt=json";

    log("Prepare user " + youmaxUser);

    $.ajax({
        url: apiProfileURL,
        type: "GET",
        async: true,
        cache: true,
        dataType: 'jsonp',
        success: function (response) { showInfo(response); },
        error: function (html) { alert(html); },
        beforeSend: setHeader
    });
}


function setHeader(xhr) {
    if (xhr && xhr.overrideMimeType) {
        xhr.overrideMimeType("application/j-son;charset=UTF-8");
    }
}

function showLoader() {
    log("showLoader");
    $('#youmax-video-list-div').empty();
    $('#youmax-video').hide();
    $('#youmax-video').attr('src', '');
    $('#youmax-video-list-div').append('<div style="text-align:center; height:200px; font:14px Calibri;"><br><br><br><br><br><br>loading...</div>');
}

function initFeaturedVideos() {
    log("initFeaturedVideos " + youmaxFeaturedPlaylistId);
    if (null != youmaxFeaturedPlaylistId && youmaxFeaturedPlaylistId != "" && youmaxFeaturedPlaylistId != "undefined") {
        getFeaturedVideos(youmaxFeaturedPlaylistId);
    } else {
        if (typeof youTubePlaylistURL === 'undefined' || null == youTubePlaylistURL || youTubePlaylistURL == "" || youTubePlaylistURL == "undefined") {
            youmaxFeaturedPlaylistId = getFeaturedPlaylistId();
        } else if (null != youTubePlaylistURL && youTubePlaylistURL.indexOf("youtube.com/playlist?list=") != -1) {
            youmaxFeaturedPlaylistId = youTubePlaylistURL.substring(youTubePlaylistURL.indexOf("youtube.com/playlist?list=") + 26);
            getFeaturedVideos(youmaxFeaturedPlaylistId);
        }
    }
}

function getFeaturedVideos(playlistId) {
    log("getFeaturedVideos " + playlistId);
    showLoader();
    var apiFeaturedPlaylistVideosURL = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=jsonc&max-results=50";
    $.ajax({
        url: apiFeaturedPlaylistVideosURL,
        type: "GET",
        async: true,
        cache: true,
        dataType: 'jsonp',
        success: function (response) {
            showPlaylistVideos(response);
            if (showFeaturedVideoOnLoad) {
                //alert(showFeaturedVideoOnLoad);
                $('.youmax-video-tnail-box:first').click();
            }
        },
        error: function (html) { alert(html); },
        beforeSend: setHeader
    });
}

function getUploads() {
    log("getuploads");
    showLoader();
    var apiUploadURL = "http://gdata.youtube.com/feeds/api/users/" + youmaxUser + "/uploads/?v=2&alt=jsonc&max-results=50";
    $.ajax({
        url: apiUploadURL,
        type: "GET",
        async: true,
        cache: true,
        dataType: 'jsonp',
        success: function (response) { showUploads(response); },
        error: function (html) { alert(html); },
        beforeSend: setHeader
    });
}

function getFeaturedPlaylistId() {
    log("getFeaturedPlaylistId");
    showLoader();
    var apiPlaylistURL = "https://gdata.youtube.com/feeds/api/users/" + youmaxUser + "/playlists?v=2&alt=jsonc&max-results=1";
    $.ajax({
        url: apiPlaylistURL,
        type: "GET",
        async: false,
        cache: false,
        dataType: 'jsonp',
        success: function (response) {
            youmaxFeaturedPlaylistId = response.data.items[0].id;
            //console.log(response);
            getFeaturedVideos(youmaxFeaturedPlaylistId);
        },
        error: function (html) { alert(html); },
        beforeSend: setHeader
    });
}


function getPlaylists() {
    log("getPlaylists");
    showLoader();
    var apiPlaylistURL = "https://gdata.youtube.com/feeds/api/users/" + youmaxUser + "/playlists?v=2&alt=jsonc&max-results=50";
    $.ajax({
        url: apiPlaylistURL,
        type: "GET",
        async: true,
        cache: true,
        dataType: 'jsonp',
        success: function (response) { showPlaylists(response); },
        error: function (html) { alert(html); },
        beforeSend: setHeader
    });
}


function getTopVideosFromPlaylist(playlistIdArray, maxTopVideos) {

    for (var i = 0; i < playlistIdArray.length; i++) {
        playlistId = playlistIdArray[i];

        apiPlaylistVideosURL = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=jsonc&max-results=" + maxTopVideos;
        $.ajax({
            url: apiPlaylistVideosURL,
            type: "GET",
            async: true,
            cache: true,
            dataType: 'jsonp',
            success: function (response) { showTopVideosOfPlaylists(response); },
            error: function (html) { alert(html); },
            beforeSend: setHeader
        });
    }

}

function showTopVideosOfPlaylists(response) {
    var playlistId = response.data.id;
    var playlistVideoArray = response.data.items;
    for (var j = 1; j < playlistVideoArray.length; j++) {
        videoTnail = playlistVideoArray[j].video.thumbnail;
        if (null != videoTnail && videoTnail != "" && videoTnail != "undefined") {
            videoTnail = videoTnail.hqDefault;
            videoTnail = videoTnail.replace("hqdefault", "mqdefault");
        }
        $('#youmax-playlist-sidebar-' + playlistId).append('<div class="youmax-playlist-sidebar-video" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + videoTnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + videoTnail + '\')"></div>');
    }

    var youmaxTnailHeight = $('.youmax-playlist-sidebar-video').css('height');
    youmaxTnailHeight = youmaxTnailHeight.substring(0, youmaxTnailHeight.indexOf("px"));
    var youmaxTnailWidth = youtubeMqdefaultAspectRatio * youmaxTnailHeight;
    $('div.youmax-playlist-sidebar-video').css({ 'width': youmaxTnailWidth + 'px' });
    $('div.youmax-playlist-sidebar').css({ 'width': (youmaxTnailWidth + 20) + 'px' });
}

function showInfo(response) {

    var channelName = response.entry.yt$username.display;
    var channelPic = response.entry.media$thumbnail.url;
    var channelSubscribers = response.entry.yt$statistics.subscriberCount;
    var channelViews = response.entry.yt$statistics.totalUploadViews;
    var channelDesc = response.entry.summary.$t;

    $('#youmax-header').append('<img style="vertical-align:middle; height:60px; margin: 15px; display:inline-block;" src="' + channelPic + '"/>' + channelName);

    $('#youmax-header').append('&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="http://www.youtube.com/subscription_center?add_user=' + youmaxUser + '"><img style="vertical-align:middle;height:60px;" src="http://s.ytimg.com/yt/img/creators_corner/Subscribe_to_my_videos/YT_Subscribe_64x64_red.png" alt="Subscribe to me on YouTube"/></a>');

    $('#youmax-stat-holder').append('<div class="youmax-stat"><span class="youmax-stat-count">' + getReadableNumber(channelViews) + '</span><br/> video views </div><div class="youmax-stat"><span class="youmax-stat-count">' + getReadableNumber(channelSubscribers) + '</span><br/>subscribers</div>');

    $('#youmax-channel-desc').append('About ' + channelName + '<br/>' + channelDesc);

}

function showPlaylists(response) {

    $('#youmax-video-list-div').empty();
    var playlistArray = response.data.items;
    var playlistIdArray = [];
    var zeroPlaylistCompensation = 0;
    for (var i = 0; i < playlistArray.length; i++) {
        playListId = playlistArray[i].id;
        playlistSize = playlistArray[i].size;
        if (playlistSize <= 0) {
            zeroPlaylistCompensation++;
            continue;
        }
        playlistIdArray.push(playListId);
        playlistTitle = playlistArray[i].title;
        playlistUploaded = playlistArray[i].created;
        playlistThumbnail = playlistArray[i].thumbnail.hqDefault;
        playlistThumbnail = playlistThumbnail.replace("hqdefault", "mqdefault");
        if ((i - zeroPlaylistCompensation) % youmaxColumns != 0)
            $('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:' + ((100 / youmaxColumns) - 4) + '%;" id="' + playListId + '"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + playlistThumbnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + playlistThumbnail + '\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-' + playListId + '"><span class="youmax-playlist-video-count"><b>' + playlistSize + '</b><br/>videos</span></div></div><span class="youmax-video-list-title">' + playlistTitle + '</span><br/><span class="youmax-video-list-views">' + playlistSize + ' videos | ' + getDateDiff(playlistUploaded) + ' ago</span></div>');
        else
            $('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:' + ((100 / youmaxColumns) - 4) + '%; clear:both;" id="' + playListId + '"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + playlistThumbnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + playlistThumbnail + '\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-' + playListId + '"><span class="youmax-playlist-video-count"><b>' + playlistSize + '</b><br/>videos</span></div></div><span class="youmax-video-list-title">' + playlistTitle + '</span><br/><span class="youmax-video-list-views">' + playlistSize + ' videos | ' + getDateDiff(playlistUploaded) + ' ago</span></div>');

    }

    $('.youmax-video-tnail-box').click(function () {
        getPlaylistVideos(this.id);
    });

    var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
    youmaxTnailWidth = youmaxTnailWidth.substring(0, youmaxTnailWidth.indexOf("px"));
    var youmaxTnailHeight = youmaxTnailWidth / youtubeMqdefaultAspectRatio;
    $('div.youmax-video-tnail').css({ 'height': youmaxTnailHeight + 'px' });


    if (youmaxTnailHeight < 130) {
        maxTopVideos = 3;
        $('html > head').append('<style>.youmax-playlist-video-count{margin: 10%;margin-top: 15%;}.youmax-playlist-sidebar-video{margin: 8% auto;}</style>');
    } else {
        maxTopVideos = 4;
    }

    getTopVideosFromPlaylist(playlistIdArray, maxTopVideos);
}

function showUploads(response) {
    $('#youmax-video-list-div').empty();

    var uploadsArray = response.data.items;

    for (var i = 0; i < uploadsArray.length; i++) {
        videoId = uploadsArray[i].id;
        videoTitle = uploadsArray[i].title;
        videoViewCount = uploadsArray[i].viewCount;
        videoDuration = uploadsArray[i].duration;
        videoUploaded = uploadsArray[i].uploaded;
        videoThumbnail = uploadsArray[i].thumbnail.hqDefault;
        videoThumbnail = videoThumbnail.replace("hqdefault", "mqdefault");
        if (i % youmaxColumns != 0)
            $('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:' + ((100 / youmaxColumns) - 4) + '%;" id="' + videoId + '"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + videoThumbnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + videoThumbnail + '\')"><div class="youmax-duration">' + secondsToTime(videoDuration) + '</div></div><span class="youmax-video-list-title">' + videoTitle + '</span><br/><span class="youmax-video-list-views">' + getReadableNumber(videoViewCount) + ' views | ' + getDateDiff(videoUploaded) + ' ago</span></div>');
        else
            $('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:' + ((100 / youmaxColumns) - 4) + '%; clear:both;" id="' + videoId + '"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + videoThumbnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + videoThumbnail + '\')"><div class="youmax-duration">' + secondsToTime(videoDuration) + '</div></div><span class="youmax-video-list-title">' + videoTitle + '</span><br/><span class="youmax-video-list-views">' + getReadableNumber(videoViewCount) + ' views | ' + getDateDiff(videoUploaded) + ' ago</span></div>');

    }

    $('.youmax-video-tnail-box').click(function () {
        if (showVideoInLightbox) {
            showVideoLightbox(this.id);
        } else {
            $('#youmax-video').attr('src', 'http://www.youtube.com/embed/' + this.id);
            $('#youmax-video').show();
            $('html,body').animate({ scrollTop: $("#youmax-header").offset().top }, 'slow');
        }
    });

    var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
    youmaxTnailWidth = youmaxTnailWidth.substring(0, youmaxTnailWidth.indexOf("px"));
    var youmaxTnailHeight = youmaxTnailWidth / youtubeMqdefaultAspectRatio;
    $('div.youmax-video-tnail').css({ 'height': youmaxTnailHeight + 'px' });



}

function getPlaylistVideos(playlistId) {
    showLoader();
    apiPlaylistVideosURL = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=jsonc&max-results=50";
    $.ajax({
        url: apiPlaylistVideosURL,
        type: "GET",
        async: true,
        cache: true,
        dataType: 'jsonp',
        success: function (response) { showPlaylistVideos(response); },
        error: function (html) { alert(html); },
        beforeSend: setHeader
    });
}

function showPlaylistVideos(response) {
    $('#youmax-video-list-div').empty();
    $('#youmax-video-list-div').append('<span class="youmax-video-list-title" style="max-width:100%;"><span class="youmax-showing">&nbsp;&nbsp;Showing playlist: </span>' + response.data.title + '</span><br/>');
    var videoArray = response.data.items;

    for (var i = 0; i < videoArray.length; i++) {
        videoId = videoArray[i].video.id;
        videoTitle = videoArray[i].video.title;
        videoViewCount = videoArray[i].video.viewCount;
        videoDuration = videoArray[i].video.duration;
        videoThumbnail = videoArray[i].video.thumbnail;
        videoUploaded = videoArray[i].video.uploaded;
        if (null != videoThumbnail && videoThumbnail != "" && videoThumbnail != "undefined") {
            videoThumbnail = videoThumbnail.hqDefault;
            videoThumbnail = videoThumbnail.replace("hqdefault", "mqdefault");
        } else {

        }

        if (i % youmaxColumns != 0)
            $('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:' + ((100 / youmaxColumns) - 4) + '%;" id="' + videoId + '"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + videoThumbnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + videoThumbnail + '\')"><div class="youmax-duration">' + secondsToTime(videoDuration) + '</div></div><span class="youmax-video-list-title">' + videoTitle + '</span><br/><span class="youmax-video-list-views">' + getReadableNumber(videoViewCount) + ' views | ' + getDateDiff(videoUploaded) + ' ago</span></div>');
        else
            $('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:' + ((100 / youmaxColumns) - 4) + '%; clear:both;" id="' + videoId + '"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + videoThumbnail + '\', sizingMethod=\'scale\'); background-image:url(\'' + videoThumbnail + '\')"><div class="youmax-duration">' + secondsToTime(videoDuration) + '</div></div><span class="youmax-video-list-title">' + videoTitle + '</span><br/><span class="youmax-video-list-views">' + getReadableNumber(videoViewCount) + ' views | ' + getDateDiff(videoUploaded) + ' ago</span></div>');
    }

    $('.youmax-video-tnail-box').click(function () {
        if (showVideoInLightbox) {
            showVideoLightbox(this.id);
        } else {
            $('#youmax-video').attr('src', 'http://www.youtube.com/embed/' + this.id);
            $('#youmax-video').show();
            $('html,body').animate({ scrollTop: $("#youmax-header").offset().top }, 'slow');
        }
    });

    var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
    youmaxTnailWidth = youmaxTnailWidth.substring(0, youmaxTnailWidth.indexOf("px"));
    var youmaxTnailHeight = youmaxTnailWidth / youtubeMqdefaultAspectRatio;
    $('div.youmax-video-tnail').css({ 'height': youmaxTnailHeight + 'px' });

}

function showVideoLightbox(videoId) {
    $('#youmax-lightbox').show();
    $('#youmax-video-lightbox').attr('src', 'http://www.youtube.com/embed/' + videoId);

    $('#youmax-lightbox').click(function () {
        $('#youmax-video-lightbox').attr('src', '');
        $('#youmax-lightbox').hide();
    });
}
