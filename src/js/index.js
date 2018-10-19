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
    animateClose();
    overlay.classList.add('hidden');
  };

  initVideos();

  // Web audio api part
  // Init web audio context and configure nodes
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

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
    if (state.openedTile) {
      closeOverlay();
      state.openedTile.videoElement.muted = true;
      state.openedTile.videoElement.removeEventListener('canplay', stopAudioProcess);
      stopAudioProcess();
    }
  });
}

main();
