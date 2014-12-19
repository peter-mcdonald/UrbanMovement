//$(function () {
//    siteInitialise();
//});


function siteInitialise() {
    $('.menuitem').click(function () {
        showPage($(this).data("page"));
    });

    showPage("home");
}

function showPage(selectedPage) {

    log("Selected page " + selectedPage);

    switch (selectedPage) {
    
        case "home":
            homePage();
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

    }
}

function homePage() {
    $.post("/Home/GetBlogPosts", function (data) {
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

function appendData(data) {
    $("#content").empty();
    $("#content").append(data);
}