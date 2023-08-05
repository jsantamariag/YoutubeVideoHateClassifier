// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function analyzeVideo() {
    var link = document.getElementById('youtube-link').value;

    if (!validateYouTubeUrl(link)) {
        alert("Please enter a valid YouTube URL.");
        return;
    }


    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/analyze_video',
        data: JSON.stringify({ 'link': link }),
        success: function (data) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            document.getElementById('classification').innerText = data.classification;
            document.getElementById('confidence').innerText = data.confidence;
        },
        contentType: "application/json",
        dataType: 'json'
    });

    document.getElementById('loading').style.display = 'block';
}

function validateYouTubeUrl(url) {
    if (url !== undefined || url !== '') {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return true;
        } else {
            return false;
        }
    }
}