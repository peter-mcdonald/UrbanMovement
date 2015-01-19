var historyJs;
var cache;

var arr = {
    "home": "Home",
    "events": "Events",
    "about": "About",
    "bios": "Biographies",
    "youtuberagz": "Dancehall & Ting",
    "youtubesoulchild": "Soulchild",
    "youtubelaughlovefunk": "Laugh Love Funk",
    "scinterviews": "Interviews",
    "mcsooz": "Sooz Grooves",
    "scsooz": "DJ Sooz",
    "mcdancehall": "Dancehall & Ting",
    "mcsoulful": "Souful Living",
    "scsoulchild": "DJ Soulchild",
    "urbansocial": "Social",
    "soozsocial": "Social",
    "soulchildsocial": "Social",
    "ragzsocial": "Social",
    "contact": "Contact Us"
};

pages = {
    change: function (newPage) {
        this.setAddress(arr[newPage], newPage);
    },
    home: function () {
        this.setAddress("Welcome", "home");
    },
    replacewithhome: function () {
        historyJs.replaceState(null, "Home", "?page=home");
    },
    setAddress: function (text, page) {
        historyJs.pushState(null, text, "?page=" + page);
    }
};


function siteInitialise() {
    facebook(document, 'script', 'facebook-jssdk');
    TwitterFollow(document, 'script', 'twitter-wjs');

    window.fbAsyncInit = function () {
        FB.init({
            appId: '936539446373269',
            xfbml: true,
            version: 'v2.0'
        });
    };

    $('.menuitem').click(function () {
        pages.change($(this).data("page"));
    });

    initialiseHistory();
    setFirstPage();
    cache = new Cache();
}

function initialiseHistory() {
    historyJs = window.History;

    historyJs.Adapter.bind(window, 'statechange', function () {
        showPage(getPageFromUrl(historyJs.getState().url));
    });
}

function setFirstPage() {
    var state = historyJs.getState();

    if (state.url.indexOf("?") === -1) {
        pages.home();
    } else {
        showPage(getPageFromUrl(historyJs.getState().url));
    }
}

function getPageFromUrl(url) {
    var parts = parseUri(url);
    return parts.queryKey.page;
}

function showPage(selectedPage) {

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

        case "about":
            aboutPage();
            break;

        case "youtuberagz":
            youTubePageRagz();
            break;

        case "youtubesoulchild":
            youTubeDJSoulChild();
            break;

        case "youtubelaughlovefunk":
            youTubeLaughLoveFunk();
            break;

        case "scinterviews":
            soundCloudInterviews();
            break;

        case "mcdancehall":
            mixCloudDanceHall();
            break;

        case "mcsooz":
            mixCloudSooz();
            break;

        case "scsooz":
            soundCloudSooz();
            break;

        case "mcsoulful":
            mixCloudSoulful();
            break;

        case "scsoulchild":
            soundCloudSoulchild();
            break;

        case "urbansocial":
            socialUrban();
            break;

        case "soozsocial":
            socialSooz();
            break;

        case "soulchildsocial":
            socialSoulChild();
            break;

        case "ragzsocial":
            socialRagz();
            break;

        case "contact":
            contactPage();
            break;

        default:
            pages.replacewithhome();
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
        prepareYoumax("http://www.youtube.com/user/RagzDancehallandTing");
    });
}

function youTubeDJSoulChild() {
    setContentClasses("scrollable");
    $.post("/YouTube/YouMax", function (data) {
        stopSpinner();
        appendData(data);
        prepareYoumax("http://www.youtube.com/user/akaDjSoulchild");
    });
}

function youTubeLaughLoveFunk() {
    setContentClasses("scrollable");
    $.post("/YouTube/YouMax", function (data) {
        stopSpinner();
        appendData(data);
        prepareYoumax("http://www.youtube.com/user/LaughLoveFunk");
    });
}

function soundCloudInterviews() {
    setContentClasses("scrollable");
    var sc = new SoundCloud(cache);
    sc.getData("21788292", "#content");
}

function mixCloudDanceHall() {
    setContentClasses("scrollable");
    var mc = new MixCloud(cache);
    mc.getData("DJ_Ragz_Australia", "#content");
}

function mixCloudSooz() {
    setContentClasses("scrollable");
    var mc = new MixCloud(cache);
    mc.getData("suevmcdonald", "#content");
}

function soundCloudSooz() {
    setContentClasses("scrollable");
    var sc = new SoundCloud(cache);
    sc.getData("33674627", "#content");
}

function mixCloudSoulful() {
    setContentClasses("scrollable");
    var mc = new MixCloud(cache);
    mc.getData("seanconradsmall", "#content");
}

function soundCloudSoulchild() {
    setContentClasses("scrollable");
    var sc = new SoundCloud(cache);
    sc.getData("16129577", "#content");
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
        prepareFamax("https://www.facebook.com/akaDjSoulchild", "akaDjSoulchild");
    });
}

function socialRagz() {
    setContentClasses("");
    $("#content").css("height", "595px");
    $.post("/Social/Ragz", function (data) {
        stopSpinner();
        appendData(data);
        reLoadWidgets();
        prepareFamax("https://www.facebook.com/pages/DJ-Ragz-Australia/349305668577960", "349305668577960");
    });
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
    $('#famax').removeData();
    $("#content").empty();
}

function appendData(data) {
    $("#content").append(data);
}