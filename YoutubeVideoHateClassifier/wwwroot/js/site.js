// Inicialización dde la conexión con el websocket

var socket = io.connect('http://localhost:5000');

socket.on('message', function (data) {
    document.getElementById('loading').innerText = data.data;
});



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
            console.log("Success Data:", data);
            if (data.success) {
                // Obtener feedback y resultados del proceso
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';
                document.getElementById('classification').innerText = data.classification;
                document.getElementById('confidence').innerText = data.confidence;
                document.getElementById('transcription').innerText = data.transcription;

                // Añadir las categorías al HTML
                const categoriesElement = document.getElementById('categories');
                categoriesElement.innerHTML = "";  // Limpiar el contenido previo
                for (const [category, value] of Object.entries(data.type_result)) {
                    const listItem = document.createElement('li');
                    listItem.innerText = `${category}: ${value}`;
                    categoriesElement.appendChild(listItem);
                }
                // Añadir la URL al iframe para mostrar el video
                const videoId = extractVideoID(link);
                document.getElementById('youtube-video').src = `https://www.youtube.com/embed/${videoId}`;

                // Cambiar el color del fondo dependiendo de la clasificación
                if (data.classification === 'Hate') {
                    document.body.className = 'hate';
                } else {
                    document.body.className = 'no-hate';
                }
            } else {
                alert("Ocurrió un error: " + data.error);
                document.getElementById('loading').style.display = 'none';
            }

            

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error Data:", jqXHR, textStatus, errorThrown);
            alert("Ocurrió un error: " + errorThrown);
            document.getElementById('loading').style.display = 'none';
            
        },
        contentType: "application/json",
        dataType: 'json'
    });

    document.getElementById('loading').style.display = 'block';
}

// Validación de link de Youtube (vídeo o short)
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

// Extraer id de un vídeo o short
function extractVideoID(url) {    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : false;
}
