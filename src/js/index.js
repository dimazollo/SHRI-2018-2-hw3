// eslint-disable-next-line no-unused-vars
import classes from '../scss/style.scss';
import {initVideos} from './videoInitialization';
import VideoModel from './VideoModel';
import {state} from './state';
import {animateClose, animateOpen, animationTime} from './animation';

function main() {


  const videoTiles = document.querySelectorAll('.video');
  const overlay = document.querySelector('.overlay');
  const allVideosBtn = document.querySelector('.overlay .all-cameras-btn');

  const brightnessSlider = document.querySelector('#brightness-slider');
  const brightnessIndicator = document.querySelector('#brightness-value');
  const contrastSlider = document.querySelector('#contrast-slider');
  const contrastIndicator = document.querySelector('#contrast-value');

  const volumeLevelBar = document.querySelector('.overlay .bar');

  // initialize layout state and transition style
  videoTiles.forEach(video => {
    video.style.transition = 'transform ease-out ' + animationTime + 'ms';
    state.videoTiles.push(new VideoModel(video));
  });

  // handle brightness control
  const updateBrightnessIndicator = () => {
    brightnessIndicator.textContent = brightnessSlider.value + '%';
  };
  brightnessSlider.addEventListener('input', () => {
    state.openedTile.brightness = brightnessSlider.value;
    updateBrightnessIndicator();
  });

  // handle contrast control
  const updateContrastIndicator = () => {
    contrastIndicator.textContent = contrastSlider.value + '%';
  };
  contrastSlider.addEventListener('input', () => {
    state.openedTile.contrast = contrastSlider.value;
    updateContrastIndicator();
  });

  const initOverlay = function(tile) {
    animateOpen(tile);

    contrastSlider.value = state.openedTile.contrast;
    brightnessSlider.value = state.openedTile.brightness;
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

  const scriptNode = audioCtx.createScriptProcessor(0, 2, 2);
  const analyzer = audioCtx.createAnalyser();

  analyzer.smoothingTimeConstant = 0.3;
  analyzer.fftSize = 32;
  const bands = new Uint8Array(analyzer.frequencyBinCount);

  const startAudioProcess = () => {
    if (state.openedTile.audioSourceNode === null) {
      state.openedTile.audioSourceNode = audioCtx.createMediaElementSource(state.openedTile.videoElement);
    }
    state.openedTile.audioSourceNode.connect(analyzer);
    analyzer.connect(scriptNode);
    scriptNode.connect(audioCtx.destination);
    state.openedTile.audioSourceNode.connect(audioCtx.destination);

    // disconnect all nodes when source audio is ended
    state.openedTile.audioSourceNode.onended = stopAudioProcess;

    scriptNode.onaudioprocess = () => {
      analyzer.getByteFrequencyData(bands);
      if (!state.openedTile.videoElement.paused) {
        state.volumeLevel = bands.reduce((accumulator, currentValue) => accumulator + currentValue) / bands.length;
        volumeLevelBar.style.backgroundColor = `hsla(${255 - state.volumeLevel}, 100%, 40%, 0.9)`;
        volumeLevelBar.style.transform = `scaleX(${state.volumeLevel / 255})`;
      }
    };
  };

  const stopAudioProcess = () => {
    state.openedTile.audioSourceNode.disconnect(analyzer);
    state.openedTile.audioSourceNode.disconnect(audioCtx.destination);
    analyzer.disconnect(scriptNode);
    scriptNode.disconnect(audioCtx.destination);
  };

  // Open video
  videoTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      if (!state.openedTile) {
        state.openedTile = state.videoTiles.filter(item => item.tile === tile)[0];
        state.openedTile.videoElement.muted = false;
        initOverlay(tile);

        const HAVE_ENOUGH_DATA = 4; // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
        if (state.openedTile.videoElement.readyState === HAVE_ENOUGH_DATA) {
          startAudioProcess();
        } else {
          state.openedTile.videoElement.addEventListener('canplay', startAudioProcess);
        }
      }
    });
  });

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
