let isFullscreen = false;

async function loadCameras() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const config = await response.json();
            const cameras = config.cameras || [];
            const container = document.getElementById('cameraGrid');
            const countElement = document.getElementById('cameraCount');
            
            // Filtra solo telecamere con IP e username validi
            const validCameras = cameras.filter(cam => cam.ip && cam.username);
            
            if (validCameras.length === 0) {
                container.innerHTML = `
                    <div class="no-cameras">
                        <h3>🔧 Nessuna telecamera configurata</h3>
                        <p>Vai alla <a href="config.html">configurazione</a> per aggiungere telecamere ONVIF.</p>
                    </div>`;
                countElement.textContent = 'Telecamere: 0';
                return;
            }
            
            countElement.textContent = `Telecamere: ${validCameras.length}`;
            container.innerHTML = '';
            
            validCameras.forEach((cam, i) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('camera-video');
                videoDiv.innerHTML = `
                    <div class="camera-header">
                        <h3>📹 Telecamera #${i + 1}</h3>
                        <span class="camera-ip">${cam.ip}:${cam.port}</span>
                    </div>
                    <div class="video-container">
                        <video controls autoplay muted preload="metadata" 
                               onerror="handleVideoError(this, '${cam.ip}', '${cam.port}')">
                            <source src="rtsp://${cam.username}:${cam.password}@${cam.ip}:${cam.port}/stream" type="application/x-rtsp" />
                            <source src="http://${cam.username}:${cam.password}@${cam.ip}:${cam.port}/video.mjpg" type="video/mjpeg" />
                            <div class="video-fallback">
                                <p>❌ Impossibile caricare il video</p>
                                <p>URL Stream: rtsp://${cam.ip}:${cam.port}/stream</p>
                                <button onclick="openDirectStream('${cam.username}', '${cam.password}', '${cam.ip}', '${cam.port}')">🔗 Apri Stream Diretto</button>
                            </div>
                        </video>
                        <div class="video-overlay">
                            <button onclick="openDirectStream('${cam.username}', '${cam.password}', '${cam.ip}', '${cam.port}')">🔗 Stream Diretto</button>
                        </div>
                    </div>
                    <div class="camera-info">
                        <span>👤 ${cam.username}</span>
                        <span>📡 <span class="status-indicator" id="status-${i}">Verificando...</span></span>
                    </div>
                `;
                container.appendChild(videoDiv);
                
                // Verifica stato telecamera
                checkCameraStatus(cam, i);
            });
        } else {
            document.getElementById('cameraGrid').innerHTML = 
                '<div class="error">❌ Errore nel caricamento configurazione telecamere</div>';
        }
    } catch (error) {
        console.error('Errore caricamento telecamere:', error);
        document.getElementById('cameraGrid').innerHTML = 
            '<div class="error">❌ Errore nella comunicazione con il server</div>';
    }
}

// Gestisce errori video
function handleVideoError(videoElement, ip, port) {
    console.log(`Errore video per telecamera ${ip}:${port}`);
    const fallback = videoElement.querySelector('.video-fallback');
    if (fallback) {
        fallback.style.display = 'block';
    }
}

// Verifica stato telecamera
async function checkCameraStatus(camera, index) {
    const statusElement = document.getElementById(`status-${index}`);
    try {
        // Tenta ping HTTP alla telecamera
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`http://${camera.ip}:${camera.port}`, { 
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        });
        
        clearTimeout(timeoutId);
        statusElement.textContent = '🟢 Online';
        statusElement.className = 'status-indicator status-online';
    } catch (error) {
        statusElement.textContent = '🔴 Offline';
        statusElement.className = 'status-indicator status-offline';
    }
}

// Apri stream diretto in nuova finestra
function openDirectStream(username, password, ip, port) {
    const streamUrl = `rtsp://${username}:${password}@${ip}:${port}/stream`;
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    newWindow.document.write(`
        <html>
            <head>
                <title>Stream Diretto - ${ip}:${port}</title>
                <style>
                    body { margin: 0; background: #000; font-family: Arial, sans-serif; }
                    video { width: 100%; height: 90vh; }
                    .info { color: white; padding: 10px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="info">
                    <h3>📹 Telecamera ${ip}:${port}</h3>
                    <p>Stream URL: ${streamUrl}</p>
                </div>
                <video controls autoplay>
                    <source src="${streamUrl}" type="application/x-rtsp">
                    <source src="http://${username}:${password}@${ip}:${port}/video.mjpg" type="video/mjpeg">
                    <p>Il browser non supporta questo formato video.</p>
                </video>
            </body>
        </html>
    `);
}

// Toggle modalità schermo intero
function toggleFullscreen() {
    if (!isFullscreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        isFullscreen = true;
        document.querySelector('header').style.display = 'none';
        document.querySelector('.dvr-controls').style.display = 'none';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        isFullscreen = false;
        document.querySelector('header').style.display = 'block';
        document.querySelector('.dvr-controls').style.display = 'flex';
    }
}

// Gestisci eventi fullscreen
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        isFullscreen = false;
        document.querySelector('header').style.display = 'block';
        document.querySelector('.dvr-controls').style.display = 'flex';
    }
});

// Auto-refresh ogni 5 minuti
setInterval(() => {
    loadCameras();
}, 300000);