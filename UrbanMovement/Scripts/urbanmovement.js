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

    }
}

function youTubePageRagz() {
    
    $.post("/YouTube/YouMax", function (data) {
        appendData(data);
        prepareYoumax();
    });


}


function appendData(data) {
    $("#content").append(data);
}