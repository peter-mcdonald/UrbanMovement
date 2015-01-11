﻿var historyJs;
var firstPage = false;

pages = {
    home: function () {
        this.setAddress("Home", "?page=home");
    },
    events: function () {
        this.setAddress("Events", "?page=events");
    },

    setAddress: function (text, uri) {
        if (firstPage) {
            return;
        }
        historyJs.pushState(null, text, uri);
    }
};


function siteInitialise() {

    TwitterFollow(document, 'script', 'twitter-wjs');
    facebook(document, 'script', 'facebook-jssdk');

    window.fbAsyncInit = function () {
        FB.init({
            appId: '936539446373269',
            xfbml: true,
            version: 'v2.0'
        });
    };

    $('.menuitem').click(function () {
        showPage($(this).data("page"));
    });

    historyJs = window.History;
    var state = historyJs.getState();

    if (state.url.indexOf("?") === -1) {
        pages.home();
        firstPage = true;
    }

    historyJs.Adapter.bind(window, 'statechange', function () {
        log("***statechange***");
        getPageFromUrl(historyJs.getState().url);
    });

    var page = getPageFromUrl(historyJs.getState().url);

    showPage("home");
}

function getPageFromUrl(url) {
    var parts = parseUri(url);

    log(parts.queryKey.page);
}


function showPage(selectedPage) {

    log("Selected page " + selectedPage);

    emptyContent();
    startSpinner();

    switch (selectedPage) {

        case "home":
            homePage();
            break;

        case "events":
            eventsPage();
            break;

        case "bios":
            biosPage();
            break;

        case "ume":
            aboutPage();
            break;

        case "YouTubeRagz":
            youTubePageRagz();
            break;

        case "SoundCloudInterviews":
            soundCloudInterviews();
            break;

        case "MixCloudSooz":
            mixCloudSooz();
            break;

        case "DanceHall":
            soundCloudDanceHall();
            break;

        case "MixCloudSoulful":
            mixCloudSoulful();
            break;

        case "UrbanSocial":
            socialUrban();
            break;

        case "SoozSocial":
            socialSooz();
            break;

        case "SoulChildSocial":
            socialSoulChild();
            break;

        case "RagzSocial":
            socialRagz();
            break;

        case "Contact":
            contactPage();
            break;
    }
    
    firstPage = false;
}

function homePage() {

    pages.home();

    var tickerOpts = {
        direction: 'up',
        easing: 'easeInOutSine',
        speed: 'slow',
        interval: 3000,
        height: 450,
        visible: 3,
        mousePause: true,
    };

    setContentClasses("vticker");

    $.post("/Home/GetBlogPosts", function (data) {
        appendData(data);
        stopSpinner();
        $('.vticker').easyTicker(tickerOpts);
    });
}

function eventsPage() {
    pages.events();
    setContentClasses("");
    $.post("/Events/Calendar", function (data) {
        stopSpinner();
        appendData(data);
    });
}

function biosPage() {
    setContentClasses("scrollable");

    $.post("/UrbanMovement/Biographies", function (data) {
        stopSpinner();
        appendData(data);
    });
}

function aboutPage() {
    setContentClasses("scrollable");

    $.post("/UrbanMovement/About", function (data) {
        stopSpinner();
        appendData(data);
    });
}

function youTubePageRagz() {
    setContentClasses("scrollable");
    $.post("/YouTube/YouMax", function (data) {
        stopSpinner();
        appendData(data);
        prepareYoumax();
    });
}

function soundCloudInterviews() {
    setContentClasses("scrollable");
    getDataFromSoundcloud("21788292", "#content");
}

function soundCloudDanceHall() {
    setContentClasses("scrollable");
    getDataFromSoundcloud("57520629", "#content");
}

function mixCloudSooz() {
    setContentClasses("scrollable");
    getDataFromMixcloud("suevmcdonald", "#content");
}

function mixCloudSoulful() {
    setContentClasses("scrollable");
    getDataFromMixcloud("seanconradsmall", "#content");
}

function socialUrban() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/UrbanMovement", function (data) {
        stopSpinner();
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/urbanmovementents", "urbanmovementents");
    });
}

function socialSooz() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/Sooz", function (data) {
        stopSpinner();
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/soozgrooves", "soozgrooves");
    });
}

function socialSoulChild() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/SoulChild", function (data) {
        stopSpinner();
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/soulfullivingradioshow", "soulfullivingradioshow");
    });
}

function socialRagz() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/Ragz", function (data) {
        stopSpinner();
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/DancehallAndTingRadioShow", "DancehallAndTingRadioShow");
    });
}

function startSpinner() {
    var $div = $("<div>", { id: "spinner" });
    $('#content').append($div);
}

function stopSpinner() {
    $("#spinner").remove();
}

function reLoadWidgets() {
    twttr.widgets.load();
    FB.XFBML.parse();
}

function setCaptcha() {
    Recaptcha.create("6LegLAATAAAAAMMk-cKmyFy3QlIF3Fd9NNSRkJp6",
        "recaptcha",
        {
            theme: "blackglass",
            callback: Recaptcha.focus_response_field
        }
    );
}

function contactPage() {
    setContentClasses("");

    $.post("/Contact/GetContactView", function (data) {
        stopSpinner();
        appendData(data);
        setCaptcha();
        $.validator.unobtrusive.parse($("#contactForm"));
    });
}


function SetContactData() {
    $("#contactdata").hide();
    setCaptchaMessage("");
    startSpinner();
    return true;
}

function CheckCaptchaMessage(data) {
    stopSpinner();
    if (data === "") {
        ClearForm();
        ThankYouMessage();
    } else {
        setCaptchaMessage(data);
    }
    $("#contactdata").fadeIn('fast');
}

function ClearForm() {
    $("#contactForm").find('input:text, input:password, input:file, select, textarea').val('');
    $("#contactForm").find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    $("#Phone").val('');
    $('#Email').val('');
    Recaptcha.reload();
}

function ThankYouMessage() {
    $('#sentMessage').slideDown('slow', function () {
        setTimeout(function () {
            $('#sentMessage').slideUp('slow');
        }, 5000);
    });
}

function setCaptchaMessage(message) {
    $('#captchaMessage').text(message);
}

function setContentClasses(classes) {
    var allClasses = "border float-left " + classes;
    $("#content").attr("class", allClasses);
}

function emptyContent() {
    $("#content").removeAttr("style");
    $('.vticker').removeData();
    $("#content").empty();
}

function appendData(data) {
    $("#content").append(data);
}