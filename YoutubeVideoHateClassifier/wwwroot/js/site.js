// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function analyzeVideo() {
    var link = document.getElementById('youtube-link').value;

    if (!validateYouTubeUrl(link)) {
        alert("Please enter a valid YouTube URL.");
        return;
    }

    document.body.className = 'default-bg'; // Establecer el fondo a blanco mientras carga

    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/analyze_video',
        data: JSON.stringify({ 'link': link }),
        success: function (data) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            document.getElementById('classification').innerText = data.classification;
            document.getElementById('confidence').innerText = data.confidence;
            document.getElementById('transcription').innerText = data.transcription;
            // Añadir la URL al iframe para mostrar el video
            const videoId = extractVideoID(link);
            document.getElementById('youtube-video').src = `https://www.youtube.com/embed/${videoId}`;

            // Cambiar el color del fondo dependiendo de la clasificación
            if (data.classification === 'Hate') {
                document.body.className = 'hate';
            } else {
                document.body.className = 'no-hate';
            }

        },
        contentType: "application/json",
        dataType: 'json'
    });

    document.getElementById('loading').style.display = 'block';
}

function validateYouTubeUrl(url) {
    if (url !== undefined || url !== '') {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return true;
        } else {
            return false;
        }
    }
}

function extractVideoID(url) {
    // Expresión regular que maneja tanto URLs de videos normales como de "shorts"
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : false;
}
