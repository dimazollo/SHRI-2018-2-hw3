"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-unused-vars
require("../scss/style.scss");
const videoInitialization_1 = require("./videoInitialization");
const VideoModel_1 = __importDefault(require("./VideoModel"));
const state_1 = require("./state");
const animation_1 = require("./animation");
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
    videoTiles.forEach((video) => {
        video.style.transition = 'transform ease-out ' + animation_1.animationTime + 'ms';
        state_1.state.videoTiles.push(new VideoModel_1.default(video));
    });
    if (videoTiles && overlay && allVideosBtn &&
        brightnessSlider && brightnessIndicator && contrastSlider && contrastIndicator &&
        volumeLevelBar) {
        // handle brightness control
        const updateBrightnessIndicator = () => {
            brightnessIndicator.textContent = brightnessSlider.value + '%';
        };
        brightnessSlider.addEventListener('input', () => {
            if (state_1.state.openedTile) {
                state_1.state.openedTile.brightness = Number(brightnessSlider.value);
                updateBrightnessIndicator();
            }
        });
        // handle contrast control
        const updateContrastIndicator = () => {
            contrastIndicator.textContent = contrastSlider.value + '%';
        };
        contrastSlider.addEventListener('input', () => {
            if (state_1.state.openedTile) {
                state_1.state.openedTile.contrast = Number(contrastSlider.value);
                updateContrastIndicator();
            }
        });
        const initOverlay = function (tile) {
            animation_1.animateOpen(tile);
            if (state_1.state.openedTile) {
                contrastSlider.value = String(state_1.state.openedTile.contrast);
                brightnessSlider.value = String(state_1.state.openedTile.brightness);
                updateContrastIndicator();
                updateBrightnessIndicator();
            }
            // volumeSlider.value = state.openedTile.volume;
            setTimeout(() => {
                overlay.classList.remove('hidden');
            }, animation_1.animationTime);
        };
        const closeOverlay = function () {
            animation_1.animateClose();
            overlay.classList.add('hidden');
        };
        videoInitialization_1.initVideos();
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
            if (state_1.state.openedTile) {
                if (state_1.state.openedTile.audioSourceNode === null &&
                    state_1.state.openedTile.videoElement) {
                    state_1.state.openedTile.audioSourceNode =
                        audioCtx.createMediaElementSource(state_1.state.openedTile.videoElement);
                }
                state_1.state.openedTile.audioSourceNode.connect(analyzer);
                analyzer.connect(scriptNode);
                scriptNode.connect(audioCtx.destination);
                state_1.state.openedTile.audioSourceNode.connect(audioCtx.destination);
                // disconnect all nodes when source audio is ended
                state_1.state.openedTile.audioSourceNode.onended = stopAudioProcess;
                scriptNode.onaudioprocess = () => {
                    analyzer.getByteFrequencyData(bands);
                    if (state_1.state.openedTile && state_1.state.openedTile.videoElement &&
                        !state_1.state.openedTile.videoElement.paused) {
                        const maxVolume = 255;
                        state_1.state.volumeLevel =
                            bands.reduce((accumulator, currentValue) => accumulator + currentValue) / bands.length;
                        volumeLevelBar.style.backgroundColor =
                            `hsla(${maxVolume - state_1.state.volumeLevel}, 100%, 40%, 0.9)`;
                        volumeLevelBar.style.transform =
                            `scaleX(${state_1.state.volumeLevel / maxVolume})`;
                    }
                };
            }
        };
        const stopAudioProcess = () => {
            if (state_1.state.openedTile) {
                state_1.state.openedTile.audioSourceNode.disconnect(analyzer);
                state_1.state.openedTile.audioSourceNode.disconnect(audioCtx.destination);
                analyzer.disconnect(scriptNode);
                scriptNode.disconnect(audioCtx.destination);
            }
        };
        // Open video
        videoTiles.forEach((tile) => {
            tile.addEventListener('click', () => {
                if (!state_1.state.openedTile) {
                    state_1.state.openedTile = state_1.state.videoTiles.filter(item => item.tile === tile)[0];
                    if (state_1.state.openedTile.videoElement) {
                        state_1.state.openedTile.videoElement.muted = false;
                        initOverlay(tile);
                        const HAVE_ENOUGH_DATA = 4; // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
                        if (state_1.state.openedTile.videoElement.readyState === HAVE_ENOUGH_DATA) {
                            startAudioProcess();
                        }
                        else {
                            state_1.state.openedTile.videoElement.addEventListener('canplay', startAudioProcess);
                        }
                    }
                }
            });
        });
        // Close active video and return to tiles
        allVideosBtn.addEventListener('click', () => {
            if (state_1.state.openedTile) {
                closeOverlay();
                if (state_1.state.openedTile.videoElement) {
                    state_1.state.openedTile.videoElement.muted = true;
                    state_1.state.openedTile.videoElement.removeEventListener('canplay', stopAudioProcess);
                    stopAudioProcess();
                }
            }
        });
    }
}
main();
//# sourceMappingURL=index.js.map