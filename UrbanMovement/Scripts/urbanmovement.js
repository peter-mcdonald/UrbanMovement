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

    //Start spinner
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


    //https://www.facebook.com/soulfullivingradioshow
    //https://www.facebook.com/urbanmovementents
    //https://www.facebook.com/soozgrooves
    //https://www.facebook.com/DancehallAndTingRadioShow

}

function homePage() {
    $.post("/Home/GetBlogPosts", function (data) {
        setContentClasses("vticker");
        appendData(data);
    });
}

function eventsPage() {
    $.post("/Events/Calendar", function (data) {
        appendData(data);
    });
}

function biosPage() {
    $.post("/UrbanMovement/Biographies", function (data) {
        setContentClasses("");
        var bios = $("<div id='biography'></div>");
        $(bios).append(data);
        appendData(bios);
    });
}

function aboutPage() {
    $.post("/UrbanMovement/About", function (data) {
        log(data);
        setContentClasses("");
        //var bios = $("<div id='biography'></div>");
        //$(bios).append(data);
        appendData(data);
    });
}

function youTubePageRagz() {

    $.post("/YouTube/YouMax", function (data) {
        appendData(data);
        prepareYoumax();
    });
}

function soundCloudInterviews() {
    getDataFromSoundcloud("21788292", "#content");
}

function soundCloudDanceHall() {
    getDataFromSoundcloud("57520629", "#content");
}

function mixCloudSooz() {
    getDataFromMixcloud("suevmcdonald", "#content");
}

function mixCloudSoulful() {
    getDataFromMixcloud("seanconradsmall", "#content");
}

function socialUrban() {

    $.post("/Social/UrbanMovement", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/urbanmovementents", "urbanmovementents");
    });
}

function socialSooz() {

    $.post("/Social/Sooz", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/soozgrooves", "soozgrooves");
    });
}

function socialSoulChild() {

    $.post("/Social/SoulChild", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/soulfullivingradioshow", "soulfullivingradioshow");
    });
}

function socialRagz() {

    $.post("/Social/Ragz", function (data) {
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/DancehallAndTingRadioShow", "DancehallAndTingRadioShow");
    });
}


function reLoadWidgets() {
    twttr.widgets.load();
    FB.XFBML.parse();
}

function setContentClasses(classes) {
    var allClasses = "border float-left scrollable " + classes;
    $("#content").attr("class", allClasses);
}

function emptyContent() {
    $("#content").empty();
}

function appendData(data) {
    $("#content").append(data);
}