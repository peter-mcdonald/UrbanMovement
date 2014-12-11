//$(function () {
//    siteInitialise();
//});


function siteInitialise() {
    $('.menuitem').click(function () {
        showPage($(this).data("page"));
    });
}

function showPage(selectedPage) {
    
    switch (selectedPage) {
    
        case "YouTubeRagz":
            youTubePageRagz();
            break;

    }
}

function youTubePageRagz() {
    
}