document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPause');
    const seekBar = document.getElementById('seekBar');
    const volumeBar = document.getElementById('volumeBar');
    const fullscreenBtn = document.getElementById('fullscreen');
    const videoItems = document.querySelectorAll('.video-item');
    const previewContainer = document.getElementById('previewContainer');
    const previewVideo = document.getElementById('previewVideo');

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            video.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    // Update seek bar as the video plays
    video.addEventListener('timeupdate', function() {
        const value = (100 / video.duration) * video.currentTime;
        seekBar.value = value;
    });

    // Seek functionality
    seekBar.addEventListener('input', function() {
        const time = video.duration * (seekBar.value / 100);
        video.currentTime = time;
    });

    // Ensure the preview video is loaded and ready to play at the correct time
    function updatePreviewVideoSource() {
        if (previewVideo.src !== video.currentSrc) {
            previewVideo.src = video.currentSrc;
            previewVideo.load();
        }
    }

    // Preview functionality
    seekBar.addEventListener('mousemove', function(event) {
        updatePreviewVideoSource();

        const rect = seekBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const previewTime = video.duration * percent;

        previewContainer.style.display = 'block';
        previewContainer.style.left = `${event.pageX - 80}px`; // Center the preview video
        previewContainer.style.top = `${rect.top - 120}px`;

        previewVideo.currentTime = previewTime;
    });

    seekBar.addEventListener('mouseleave', function() {
        previewContainer.style.display = 'none';
    });

    // Volume control
    volumeBar.addEventListener('input', function() {
        video.volume = volumeBar.value;
    });

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });

    // Video preview and change video functionality
    videoItems.forEach(item => {
        const itemPreviewVideo = item.querySelector('video');

        // Play preview on mouseover
        item.addEventListener('mouseover', function() {
            itemPreviewVideo.play();
        });

        // Pause preview on mouseout
        item.addEventListener('mouseout', function() {
            itemPreviewVideo.pause();
            itemPreviewVideo.currentTime = 0;
        });

        // Change video on click
        item.addEventListener('click', function() {
            const videoSrc = item.getAttribute('data-video');
            const videoType = item.querySelector('source').getAttribute('type');
            video.innerHTML = `<source src="${videoSrc}" type="${videoType}">`;
            video.load();
            video.play();
            playPauseBtn.textContent = 'Pause';

            // Update preview video source
            previewVideo.innerHTML = `<source src="${videoSrc}" type="${videoType}">`;
            previewVideo.load(); // Ensure the new video is loaded
        });
    });
});
