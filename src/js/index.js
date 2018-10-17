// eslint-disable-next-line no-unused-vars
import classes from '../scss/style.scss';
import initVideo from './initVideo';
import VideoModel from './VideoModel';
import { state } from './state';

function main () {

  const animationTime = 500;

  const videos = document.querySelectorAll('.video');
  const overlay = document.querySelector('.overlay');
  const allVideosBtn = document.querySelector('.all-cameras-btn');

  const brightnessSlider = document.querySelector('#brightness-slider');
  const brightnessIndicator = document.querySelector('#brightness-value');
  const contrastSlider = document.querySelector('#contrast-slider');
  const contrastIndicator = document.querySelector('#contrast-value');

  videos.forEach(video => {
    video.style.transition = 'transform ease-out ' + animationTime + 'ms';
    state.videos.push(new VideoModel(video));
  });

  const initOverlay = function () {
    contrastSlider.value = state.openedVideo.contrast;
    brightnessSlider.value = state.openedVideo.brightness;
    updateContrastIndicator();
    updateBrightnessIndicator();
    // volumeSlider.value = state.openedVideo.volume;

    setTimeout(() => {
      overlay.classList.remove('hidden');
    }, animationTime);
  };

  const closeOverlay = function() {
    state.openedVideo.contrast = contrastSlider.value;
    state.openedVideo.brightness = brightnessSlider.value;
    // state.openedVideo.volume = volumeSlider.value;

    overlay.classList.add('hidden');
  };


  const updateBrightnessIndicator = () => {

    brightnessIndicator.textContent = brightnessSlider.value + '%';
  };
  brightnessSlider.addEventListener('input', () => {
    state.openedVideo.brightness = brightnessSlider.value;
    updateBrightnessIndicator();
  });
  // brightnessSlider.addEventListener('change', updateBrightnessIndicator);

  const updateContrastIndicator = () => {
    contrastIndicator.textContent = contrastSlider.value + '%';
  };
  contrastSlider.addEventListener('input', () => {
    state.openedVideo.contrast = contrastSlider.value;
    updateContrastIndicator();
  });
  // contrastSlider.addEventListener('change', updateContrastIndicator);

  // Close active video and return to tiles
  allVideosBtn.addEventListener('click', () => {
    if (state.openedVideo) {
      state.openedVideo.domNode.style.transform = '';
      setTimeout(() => {
        state.openedVideo.domNode.style.zIndex = '0';
        state.openedVideo = null;
      }, animationTime);

      closeOverlay();
    }
  });


  // Open video
  videos.forEach(video => {
    video.addEventListener('click', event => {
      event.preventDefault();

      if (!state.openedVideo) {
        const bClientRect = video.getBoundingClientRect();
        video.style.transformOrigin = `${-bClientRect.x}px ${-bClientRect.y}px`;
        video.style.zIndex = '1';
        let translate = {x: 0, y: 0};

        translate.x = -bClientRect.x;
        translate.y = -bClientRect.y;

        let scale = {x: 1.0, y: 1.0};
        scale.x = window.innerWidth / bClientRect.width;
        scale.y = window.innerHeight / bClientRect.height;

        state.openedVideo = state.videos.filter(item => item.domNode === video)[0];
        video.style.transform = `scale(${scale.x}, ${scale.y}) translate(${translate.x}px, ${translate.y}px)`;
        video.classList.toggle('full-size');

        initOverlay();
      }
    });
  });

  initVideo(
    document.getElementById('video-1'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
  );

  initVideo(
    document.getElementById('video-2'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
  );

  initVideo(
    document.getElementById('video-3'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
  );

  initVideo(
    document.getElementById('video-4'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
  );
}

main();
