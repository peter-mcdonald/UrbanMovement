//$(function () {
//    siteInitialise();
//});


function siteInitialise() {
    $('.menuitem').click(function () {
        showPage($(this).data("page"));
    });
}

function showPage(selectedPage) {

    alert("selected page " + selectedPage);

    switch (selectedPage) {
    
        case "YouTubeRagz":
            youTubePageRagz();
            break;
            
        case "SoundCloudInterviews":
            soundCloudInterviews();
            break;

    }
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


function appendData(data) {
    $("#content").append(data);
}