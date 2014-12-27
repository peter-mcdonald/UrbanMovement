"use strict";

var facebookPageUrl = "";
var fbAccessToken = "936539446373269|360ae556fa35bd7c93bee76022718127";
var famaxWidgetWidth = 300;
var famaxWidgetHeight = 595;
var pathToLoadingImage = './Images/Loader/famax-loader.gif';
var famaxColumns = 2;
var fqlPending = 0;

if (typeof famaxWidgetHeight !== 'undefined') {
    if (null !== famaxWidgetHeight && famaxWidgetHeight !== "" && famaxWidgetHeight !== "undefined") {
        $('html > head').append('<style>#famax{overflow-y:auto;height:' + famaxWidgetHeight + 'px;}</style>');
    }
}
var fbNext = "";

function loadFamax() {

    var famaxColumnsHTML = '';
    var columnWidth = 100 / famaxColumns;
    for (var i = 1; i <= famaxColumns; i++) {
        famaxColumnsHTML += '<div id="famax-video-list-div' + i + '" style="width:' + columnWidth + '%;" class="famax-video-list-div"></div>';
    }

    $('#famax').append('<div id="famax-encloser">' + famaxColumnsHTML + '<div class="load-more-wrapper"><span class="load-more" id="load-more"> Load More..</span></div></div>');

    $('#load-more').click(function () {
        $('#load-more').text('loading..');
        loadMore();
    });

    $('#famax').append('<div id="famax-lightbox"><div id="picasa-lightbox-wrapper"><div id="picasa-lightbox-image"><img id="picasa-img-lightbox" src=""><iframe id="famax-video-lightbox" width="640" height="360" src="" frameborder="0" allowfullscreen></iframe></div><div id="picasa-lightbox-helper"></div></div></div>');

    $('#famax-lightbox').click(function () {
        $('#picasa-img-lightbox').attr('src', '');
        $('#famax-video-lightbox').attr('src', '');
        $('#famax-lightbox').hide();
        $('#famax-img-lightbox').hide();
        $('#famax-video-lightbox').hide();
    });

    $('#famax-lightbox').hide();
    $('#famax-img-lightbox').hide();
    $('#famax-video-lightbox').hide();
}



function getPageDetails(fqlUrl) {
    fqlPending = 1;

    FB.api(fqlUrl,
        function (response) {

            fbNext = "";
            if (response.paging.hasOwnProperty("next")) {
                fbNext = response.paging.next;
            }

            showFamax(response);
        }
    );
}

function showFamax(response) {

    var streamArray = response.data;
    var post_id;
    var message;
    
    var fbAttachmentList = [];
    var fbAttachment;
    var type;
    var src;
    var href;
    var width;
    var height;

    var fbPost;

    for (var i = 0; i < streamArray.length; i++) {
        post_id = streamArray[i].id;
        message = streamArray[i].message;

        if (null == message || message == "" || message == "undefined")
            continue;

        type = streamArray[i].type;
        src = "";

        if (streamArray[i].hasOwnProperty("picture")) {
            src = streamArray[i].picture;
        }

        switch (type) {
            case "video":
                href = streamArray[i].source;
                width = 0;
                height = 0;
                break;
            case "photo":
                href = streamArray[i].picture;
                width = 0;
                height = 0;
                break;
            case "link":
                href = streamArray[i].link;
                width = 0;
                height = 0;
                break;
            default:
                type = null;
                src = null;
                href = null;
        }

        fbAttachment = { type: type, src: src, href: href, height: height, width: width };
        fbAttachmentList.push(fbAttachment);

        if (type != null) {
            fbPost = {
                post_id: post_id,
                message: message,
                fbAttachmentList: fbAttachmentList,
            };
            showPost(fbPost);
        }

        fbAttachmentList = [];
    }

    fqlPending = 0;

    if (fbNext == "") {
        $('#load-more').text('No More Details ..');
    } else {
        $('#load-more').text('Load More..');
    }
}

function showPost(fbPost) {

    var fbPicAspectRatio = 0;
    var attachment_display;
    var famax_video_tnail;
    var fbAttachmentList = fbPost.fbAttachmentList;
    var famaxPicTrain = '';
    var message = fbPost.message;

    var attachment_type;
    var attachment_display;
    var attachment_href;

    if (null != message && message != "" && message != "undefined") {

        var linkStartIndex;
        var leftLinkSeparator;
        var index;
        var parsedLink = "";
        var messageLength = message.length;

        if (message.indexOf("http://") != -1) {
            linkStartIndex = message.indexOf("http://");
            leftLinkSeparator = message.charAt(linkStartIndex - 1);
            index = linkStartIndex;
            while (message.charAt(index) != leftLinkSeparator) {
                parsedLink += message.charAt(index++);
                if (message.charAt(index) == " " || index >= messageLength || message.charAt(index) == "\n" || message.charAt(index) == "\r\n")
                    break;
            }
            message = message.replace(parsedLink, '<a target="_blank" href="' + parsedLink + '">' + parsedLink + '</a>');
        } else if (message.indexOf("https://") != -1) {
            linkStartIndex = message.indexOf("https://");
            leftLinkSeparator = message.charAt(linkStartIndex - 1);
            index = linkStartIndex;
            while (message.charAt(index) != leftLinkSeparator) {
                parsedLink += message.charAt(index++);
                if (message.charAt(index) == " " || index >= messageLength || message.charAt(index) == "\n" || message.charAt(index) == "\r\n")
                    break;
            }
            message = message.replace(parsedLink, '<a target="_blank" href="' + parsedLink + '">' + parsedLink + '</a>');
        } else if (message.indexOf("www.") != -1) {
            linkStartIndex = message.indexOf("www.");
            leftLinkSeparator = message.charAt(linkStartIndex - 1);
            index = linkStartIndex;
            while (message.charAt(index) != leftLinkSeparator) {
                parsedLink += message.charAt(index++);
                if (message.charAt(index) == " " || index >= messageLength || message.charAt(index) == "\n" || message.charAt(index) == "\r\n")
                    break;
            }
            message = message.replace(parsedLink, '<a target="_blank" href="' + parsedLink + '">' + parsedLink + '</a>');
        }
    }

    if (null != fbAttachmentList && fbAttachmentList != "" && fbAttachmentList != "undefined") {
        for (var k = 0; k < fbAttachmentList.length; k++) {
            attachment_type = fbAttachmentList[k].type;
            attachment_display = fbAttachmentList[k].src;
            attachment_href = fbAttachmentList[k].href;


            if (k == 0) {
                if (attachment_display.indexOf("_s.") != -1)
                    attachment_display = attachment_display.replace("_s.", "_n.");

                if (attachment_type == 'photo') {
                    fbPicAspectRatio = fbAttachmentList[k].width / fbAttachmentList[k].height;
                    famax_video_tnail = '<div id="' + fbPost.post_id + '" data-picSrc="' + attachment_display + '" class="famax-pic-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\'' + attachment_display + '\', sizingMethod=\'scale\'); background-image:url(\'' + attachment_display + '\')"></div>';
                } else if (attachment_type == 'link') {
                    famax_video_tnail = '<div class="famax-link-tnail" style="width:100%;text-align:center;"><a target="_blank" href="' + attachment_href + '"><i class="_1y4" style="background: url(\'./Images/famax_link.png\') no-repeat 0 0;"></i><img  class="link-img" id="' + fbPost.post_id + '" src="' + attachment_display + '"></a></div>';
                } else if (attachment_type == 'video') {
                    famax_video_tnail = '<div class="famax-video-tnail" data-videoSrc="' + attachment_href + '" style="width:100%;text-align:center;"><i class="_1y4" style="background: url(\'./Images/famax_video.png\') no-repeat 0 0;"></i><img class="video-img"  id="' + fbPost.post_id + '" src="' + attachment_display + '"></div>';
                } else {
                }

            } else if (k > 0) {
                if (attachment_type == 'photo') {
                    famaxPicTrain += '<div class="famax-playlist-sidebar-video" data-picSrc="' + attachment_display + '" style="background-image:url(\'' + attachment_display + '\')"></div>';
                }
            }

        }
    } else {
        famax_video_tnail = '';
        famaxPicTrain = '';
    }

    var famaxColumn = getNextFamaxColumn();

    if (null != famaxPicTrain && famaxPicTrain != "undefined" && famaxPicTrain != "") {
        famaxPicTrain = '<div class="famax-pic-train" id="famax-pic-train-' + fbPost.post_id + '">' + famaxPicTrain + '</div>';
    }

    $('#famax-video-list-div' + famaxColumn).append('<div class="famax-video-tnail-box">' + famax_video_tnail + famaxPicTrain + '<span class="famax-video-list-title">' + message + '</span><br/></div>');


    $('.famax-pic-tnail').click(function () {
        showPicLightbox(this.getAttribute('data-picSrc'));
    });

    $('.famax-video-tnail').click(function () {
        showVideoLightbox(this.getAttribute('data-videoSrc'));
    });

    $('.famax-playlist-sidebar-video').click(function () {
        var tmpPicSrc = this.getAttribute('data-picSrc');
        if (tmpPicSrc.indexOf("_s.") != -1)
            tmpPicSrc = tmpPicSrc.replace("_s.", "_n.");
        showPicLightbox(tmpPicSrc);
    });

    if (fbPicAspectRatio != 0) {
        var famaxTnailWidth = $('#' + fbPost.post_id).css('width');
        famaxTnailWidth = famaxTnailWidth.substring(0, famaxTnailWidth.indexOf("px"));
        var famaxTnailHeight = famaxTnailWidth / fbPicAspectRatio;
        $('#' + fbPost.post_id).css({ 'height': famaxTnailHeight + 'px' });
    }
}

function loadMore() {
    if (!fqlPending && fbNext != "") {
        getPageDetails(fbNext);
    }
}

function getNextFamaxColumn() {
    var lowestHeight = $('#famax-video-list-div1').height();
    var tempHeight = 0;
    var columnNumber = 1;

    for (var i = 1; i <= famaxColumns; i++) {
        tempHeight = $('#famax-video-list-div' + i).height();
        if (tempHeight < lowestHeight) {
            lowestHeight = tempHeight;
            columnNumber = i;
        }
    }

    return columnNumber;
}

function showPicLightbox(picSrc) {
    $('#famax-img-lightbox').show();
    $('#famax-lightbox').show();
    showLoadingInLightbox();
    setTimeout(function () { $('#picasa-img-lightbox').attr('src', picSrc); }, 10);
}

function showVideoLightbox(videoSrc) {
    $('#famax-video-lightbox').show();
    $('#famax-lightbox').show();
    setTimeout(function () { $('#famax-video-lightbox').attr('src', videoSrc); }, 10);
}

function showLoadingInLightbox() {
    $('#picasa-img-lightbox').attr('src', '');
    $('#picasa-img-lightbox').attr('src', pathToLoadingImage);
}

function prepareFamax(url, pageid) {

    facebookPageUrl = url;

    loadFamax();

    var fqlUrl = "/" + pageid + "/feed?fields=id,from,to,message,description,picture,source,type,properties,link,name&access_token=" + fbAccessToken;

    getPageDetails(fqlUrl);
}