var wlTitle = document.getElementById("VLWL-guide-item").textContent.trim();
var thumbUrlString = "//img.youtube.com/vi/{0}/mqdefault.jpg";
var ytWatchLaterUrl = "/playlist?list=WL"
var playlistVideos = [];

$(document.body).ready(function () {
    getWLPage();
});

$("#what_to_watch-guide-item").click(function () {
    // TODO prepend playlist again
});

$("#yt-masthead-logo-fragment").click(function () {
    // TODO prepend playlist again
});

function getWLPage() {
    $.ajax({
        method: 'get',
        url: window.location.protocol + "//youtube.com/playlist?list=WL",
        success: function (res) {
            var $body = $(res);
            extractList($body);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function extractList($body) {
    playlistVideos = [];
    var listLenght = $body.find("#pl-load-more-destination").children().length - 1;

    if (listLenght < 0)
        return;

    $body.find("#pl-load-more-destination").children().each(function (i) {
        var $elem = $(this);
        var url = $elem.find(".pl-video-title-link").attr("href").toString().split("&")[0];
        var videoElement = {
            title: $elem.find(".pl-video-title-link").text().trim(),
            url: url,
            thumbUrl: window.location.protocol + thumbUrlString.replace("{0}", url.replace("/watch?v=", "")),
            timestamp: $elem.find(".timestamp").text().trim(),
            owner: $elem.find(".pl-video-owner > a")
        }
        playlistVideos.push(videoElement);
        if (i == listLenght)
            prependPlaylistToHomePage(playlistVideos, 1);
    });
}

function prependPlaylistToHomePage(playlistVideos, cloneIndex) {
    var length = playlistVideos.length;
    var $sectionItem = $(".section-list > li:nth-child(" + cloneIndex + ")").clone();

    // iterate until find a compact-shelf
    if ($sectionItem.find("div.feed-item-dismissable > div.compact-shelf").length === 0 ||
        $sectionItem.find(".yt-lockup-playlist").length !== 0) {
        prependPlaylistToHomePage(playlistVideos, cloneIndex + 1);
        return;
    }

    $sectionItem.attr("class", "WLoHP");
    $sectionItem.find("div.shelf-title-table > div > div").remove();
    $sectionItem.find("div.shelf-title-table > div > h2").empty();
    $sectionItem.find("div.shelf-title-table > div > h2").append("<a href=\"" + ytWatchLaterUrl + "\">" + wlTitle + "</a>");
    $sectionItem.prependTo(".section-list");

    var $sectionVideo = $sectionItem.find("ul.yt-uix-shelfslider-list > li:nth-child(1)");
    $sectionItem.find("ul.yt-uix-shelfslider-list").attr("id", "WLoHP_List");
    $sectionItem.find("ul.yt-uix-shelfslider-list").empty();
    for (var i = 0; i < length; i++) {
        var playlistItem = playlistVideos[i];
        var $cloneSectionVideo = $sectionVideo.clone();
        $cloneSectionVideo.find("h3 > a").attr("href", playlistItem.url);
        $cloneSectionVideo.find("h3 > a").attr("title", playlistItem.title);
        $cloneSectionVideo.find("h3 > a").text(playlistItem.title);
        $cloneSectionVideo.find("div.yt-lockup-dismissable > div > a").attr("href", playlistItem.url);
        $cloneSectionVideo.find("div.yt-lockup-dismissable > div > button").remove();
        $cloneSectionVideo.find("span.yt-thumb-simple").attr("src", playlistItem.thumbUrl);
        $cloneSectionVideo.find("span.yt-thumb-simple > img").attr("src", playlistItem.thumbUrl);
        $cloneSectionVideo.find("span.video-time").text(playlistItem.timestamp);
        $cloneSectionVideo.find("div.yt-lockup-byline").html(playlistItem.owner);
        $cloneSectionVideo.find("div.yt-lockup-meta").empty();
        $cloneSectionVideo.find("div.yt-uix-menu-container").empty();
        $cloneSectionVideo.prependTo("#WLoHP_List");
    }
}