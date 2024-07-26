const formatTime = function (time) {
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    hours = hours < 10 ? `0${hours}` : `${hours}`;

    if (hours == 0) {
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}


// * Play and Pause
const container = document.querySelector('.container');
const main_video = container.querySelector('video');
const play_pause_button = container.querySelector('.play-pause');
play_pause_button.addEventListener('click', function () {
    if (main_video.paused) {
        main_video.play();
        play_pause_button.children[0].classList.replace('fa-play', 'fa-pause');
    } else {
        main_video.pause();
        play_pause_button.children[0].classList.replace('fa-pause', 'fa-play');
    }
});
// * Play and Pause



// * Show Hide Controls 
let timer;
const hideControls = function () {
    if (main_video.paused) return;
    timer = setTimeout(function () {
        container.classList.remove('show-controls');
    }, 3000);
}
hideControls();
container.addEventListener('mousemove', function () {
    container.classList.add('show-controls');
    clearTimeout(timer);
    hideControls();
});
// * Show Hide Controls 



// * Progress Bar with video time and Current Time Text
const progress_bar = container.querySelector('.progress-bar');
const current_time = container.querySelector('.current-time');
const video_duration = container.querySelector('.video-duration');
main_video.addEventListener('timeupdate', function (e) {
    let { currentTime, duration } = e.target;
    let time_percentage = (currentTime / duration) * 100;
    progress_bar.style.width = `${time_percentage}%`;
    current_time.innerHTML = formatTime(currentTime);
});

main_video.addEventListener('loadeddata', function (e) {
    let { duration } = e.target;
    video_duration.innerHTML = formatTime(duration);
});
// * Progress Bar with video time and Current Time Text



// * Skip Backward and Forward
const skip_backward = container.querySelector('.skip-backward');
const skip_forward = container.querySelector('.skip-forward');
skip_backward.addEventListener('click', function () {
    main_video.currentTime -= 5;
});
skip_forward.addEventListener('click', function () {
    main_video.currentTime += 5;
});
// * Skip Backward and Forward



// * Volume Settings
const volume_button = container.querySelector('.volume');
const volume_slider = container.querySelector('input[type="range"]');
volume_button.addEventListener('click', function () {
    if (volume_button.children[0].classList.contains('fa-volume-high')) {
        main_video.volume = 0;
        volume_slider.value = 0;
        volume_button.children[0].classList.replace('fa-volume-high', 'fa-volume-xmark');
    } else if (volume_button.children[0].classList.contains('fa-volume-low')) {
        main_video.volume = 0;
        volume_slider.value = 0;
        volume_button.children[0].classList.replace('fa-volume-low', 'fa-volume-xmark');
    } else {
        main_video.volume = 1;
        volume_slider.value = 100;
        volume_button.children[0].classList.replace('fa-volume-xmark', 'fa-volume-high');
    }
});

volume_slider.addEventListener('input', function (e) {
    main_video.volume = e.target.value / 100;
    if (main_video.volume > 0.7) {
        volume_button.children[0].classList = '';
        volume_button.children[0].classList.add('fa-solid', 'fa-volume-high');
    } else if (main_video.volume <= 0.7 && main_video.volume > 0) {
        volume_button.children[0].classList = '';
        volume_button.children[0].classList.add('fa-solid', 'fa-volume-low');
    } else {
        volume_button.children[0].classList = '';
        volume_button.children[0].classList.add('fa-solid', 'fa-volume-xmark');
    }
});
// * Volume Settings



// * Playback Speed
const speed_button = container.querySelector('.playback-speed');
const speed_options = document.querySelector('.speed-options');
const speed_quantity = document.querySelectorAll('.speed-options li');
speed_button.addEventListener('click', function () {
    if (!speed_options.classList.contains('active')) {
        speed_options.classList.add('active');
    } else {
        speed_options.classList.remove('active');
    }
});

document.addEventListener('click', function (e) {
    if (e.target.className != 'fa-solid fa-gauge-high') {
        speed_options.classList.remove('active');
    }
});

speed_quantity.forEach(function (quantity) {
    quantity.addEventListener('click', function (e) {
        speed_quantity.forEach(classRemover => classRemover.classList.remove('active'));
        main_video.playbackRate = e.target.dataset.speed;
        if (!quantity.classList.contains('active')) {
            quantity.classList.add('active');
        } else {
            quantity.classList.remove('active');
        }
    });
});
// * Playback Speed



// * Picture in Picture and FullScreen
const pic_in_pic_button = document.querySelector('.pic-in-pic');
const fullscreen_button = document.querySelector('.fullscreen');
pic_in_pic_button.addEventListener('click', function () {
    main_video.requestPictureInPicture();
});

fullscreen_button.addEventListener('click', function () {
    if (document.fullscreenElement) {
        fullscreen_button.children[0].classList.replace('fa-compress', 'fa-expand');
        return document.exitFullscreen();
    } else {
        fullscreen_button.children[0].classList.replace('fa-expand', 'fa-compress');
        container.requestFullscreen();
    }
});
// * Picture in Picture and FullScreen



// * Video Timeline and Draggable Progress Bar
const video_timeline = document.querySelector('.video-timeline');
video_timeline.addEventListener('click', function (e) {
    let timeline_width = video_timeline.clientWidth;
    main_video.currentTime = (e.offsetX / timeline_width) * main_video.duration;
});

const draggableProgressBar = (e) => {
    let timeline_width = video_timeline.clientWidth;
    progress_bar.style.width = `${e.offsetX}px`;
    main_video.currentTime = (e.offsetX / timeline_width) * main_video.duration;
}
container.addEventListener('mousedown', function () {
    video_timeline.addEventListener('mousemove', draggableProgressBar);
});
container.addEventListener('mouseup', function () {
    video_timeline.removeEventListener('mousemove', draggableProgressBar);
});
container.addEventListener('mousemove', function (e) {
    let timeline_width = video_timeline.clientWidth;
    const progressTime = video_timeline.querySelector('span');
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let percent = (e.offsetX / timeline_width) * main_video.duration;
    progressTime.innerText = formatTime(percent);
});
// * Video Timeline and Draggable Progress Bar