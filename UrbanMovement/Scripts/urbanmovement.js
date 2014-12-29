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

    showPage("home");
}

function showPage(selectedPage) {

    log("Selected page " + selectedPage);

    startSpinner();
    emptyContent();

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
    }
}

function homePage() {

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
    setContentClasses("");
    $.post("/Events/Calendar", function (data) {
        appendData(data);
    });
}

function biosPage() {
    setContentClasses("scrollable");

    $.post("/UrbanMovement/Biographies", function (data) {
        setContentClasses("scrollable");
        var bios = $("<div id='biography'></div>");
        $(bios).append(data);
        appendData(bios);
    });
}

function aboutPage() {
    setContentClasses("scrollable");

    $.post("/UrbanMovement/About", function (data) {
        log(data);
        setContentClasses("");
        //var bios = $("<div id='biography'></div>");
        //$(bios).append(data);
        appendData(data);
    });
}

function youTubePageRagz() {
    setContentClasses("scrollable");
    $.post("/YouTube/YouMax", function (data) {
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
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/urbanmovementents", "urbanmovementents");
    });
}

function socialSooz() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/Sooz", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/soozgrooves", "soozgrooves");
    });
}

function socialSoulChild() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/SoulChild", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/soulfullivingradioshow", "soulfullivingradioshow");
    });
}

function socialRagz() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/Ragz", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/DancehallAndTingRadioShow", "DancehallAndTingRadioShow");
    });
}

function startSpinner() {
    $("#spinner").fadeIn('fast');
}

function stopSpinner() {
    $("#spinner").hide();
}

function reLoadWidgets() {
    twttr.widgets.load();
    FB.XFBML.parse();
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