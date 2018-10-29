// eslint-disable-next-line no-unused-vars
import '../scss/style.scss';
import { initVideos } from './videoInitialization';
import VideoModel from './VideoModel';
import { state } from './state';
import { animateClose, animateOpen, animationTime } from './animation';

function main() {
  const videoTiles: NodeListOf<HTMLElement> = document.querySelectorAll('.video');
  const overlay: HTMLElement | null = document.querySelector('.overlay');
  const allVideosBtn: HTMLButtonElement | null = document.querySelector('.overlay .all-cameras-btn');

  const brightnessSlider: HTMLInputElement | null = document.querySelector('#brightness-slider');
  const brightnessIndicator: HTMLElement | null = document.querySelector('#brightness-value');
  const contrastSlider: HTMLInputElement | null = document.querySelector('#contrast-slider');
  const contrastIndicator: HTMLElement | null = document.querySelector('#contrast-value');

  const volumeLevelBar: HTMLElement | null = document.querySelector('.overlay .bar');

  // initialize layout state and transition style
  videoTiles.forEach((video) => {
    video.style.transition = 'transform ease-out ' + animationTime + 'ms';
    state.videoTiles.push(new VideoModel(video));
  });

  if (videoTiles && overlay && allVideosBtn &&
    brightnessSlider && brightnessIndicator && contrastSlider && contrastIndicator &&
    volumeLevelBar) {
    // handle brightness control
    const updateBrightnessIndicator = () => {
      brightnessIndicator.textContent = brightnessSlider.value + '%';
    };
    brightnessSlider.addEventListener('input', () => {
      if (state.openedTile) {
        state.openedTile.brightness = Number(brightnessSlider.value);
        updateBrightnessIndicator();
      }
    });

    // handle contrast control
    const updateContrastIndicator = () => {
      contrastIndicator.textContent = contrastSlider.value + '%';
    };
    contrastSlider.addEventListener('input', () => {
      if (state.openedTile) {
        state.openedTile.contrast = Number(contrastSlider.value);
        updateContrastIndicator();
      }
    });

    const initOverlay = function (tile: HTMLElement) {
      animateOpen(tile);
      if (state.openedTile) {
        contrastSlider.value = String(state.openedTile.contrast);
        brightnessSlider.value = String(state.openedTile.brightness);
        updateContrastIndicator();
        updateBrightnessIndicator();
      }
      // volumeSlider.value = state.openedTile.volume;

      setTimeout(() => {
        overlay.classList.remove('hidden');
      }, animationTime);
    };

    const closeOverlay = function () {
      animateClose();
      overlay.classList.add('hidden');
    };

    initVideos();

    // Web audio api part
    // Init web audio context and configure nodes
    const gAudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new gAudioContext();
    const stereoChannelsNum = 2;
    const scriptNode = audioCtx.createScriptProcessor(0, stereoChannelsNum, stereoChannelsNum);
    const analyzer = audioCtx.createAnalyser();

    const smoothTime = 0.3;
    analyzer.smoothingTimeConstant = smoothTime;
    const fftSamples = 32;
    analyzer.fftSize = fftSamples;
    const bands = new Uint8Array(analyzer.frequencyBinCount);

    const startAudioProcess = () => {
      if (state.openedTile) {
        if (state.openedTile.audioSourceNode === null &&
          state.openedTile.videoElement) {
          state.openedTile.audioSourceNode =
            audioCtx.createMediaElementSource(state.openedTile.videoElement);
        }
        state.openedTile.audioSourceNode.connect(analyzer);
        analyzer.connect(scriptNode);
        scriptNode.connect(audioCtx.destination);
        state.openedTile.audioSourceNode.connect(audioCtx.destination);

        // disconnect all nodes when source audio is ended
        state.openedTile.audioSourceNode.onended = stopAudioProcess;

        scriptNode.onaudioprocess = () => {
          analyzer.getByteFrequencyData(bands);
          if (state.openedTile && state.openedTile.videoElement &&
              !state.openedTile.videoElement.paused) {
            const maxVolume = 255;
            state.volumeLevel =
              bands.reduce((accumulator, currentValue) =>
                accumulator + currentValue) / bands.length;
            volumeLevelBar.style.backgroundColor =
              `hsla(${maxVolume - state.volumeLevel}, 100%, 40%, 0.9)`;
            volumeLevelBar.style.transform =
              `scaleX(${state.volumeLevel / maxVolume})`;
          }
        };
      }
    };

    const stopAudioProcess = () => {
      if (state.openedTile) {
        state.openedTile.audioSourceNode.disconnect(analyzer);
        state.openedTile.audioSourceNode.disconnect(audioCtx.destination);
        analyzer.disconnect(scriptNode);
        scriptNode.disconnect(audioCtx.destination);
      }
    };

    // Open video
    videoTiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        if (!state.openedTile) {
          state.openedTile = state.videoTiles.filter(item => item.tile === tile)[0];
          if (state.openedTile.videoElement) {
            state.openedTile.videoElement.muted = false;
            initOverlay(tile);

            const HAVE_ENOUGH_DATA = 4; // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
            if (state.openedTile.videoElement.readyState === HAVE_ENOUGH_DATA) {
              startAudioProcess();
            } else {
              state.openedTile.videoElement.addEventListener('canplay', startAudioProcess);
            }
          }
        }
      });
    });

    // Close active video and return to tiles
    allVideosBtn.addEventListener('click', () => {
      if (state.openedTile) {
        closeOverlay();
        if (state.openedTile.videoElement) {
          state.openedTile.videoElement.muted = true;
          state.openedTile.videoElement.removeEventListener('canplay', stopAudioProcess);
          stopAudioProcess();
        }
      }
    });
  }
}
main();
