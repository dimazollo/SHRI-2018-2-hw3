"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hls_js_1 = __importDefault(require("hls.js"));
// init video streams
const streamServerIp = '192.168.1.38';
const port = '9191';
function initVideo(video, url) {
    if (hls_js_1.default.isSupported()) {
        const hls = new hls_js_1.default();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(hls_js_1.default.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }
}
exports.initVideo = initVideo;
function initVideos() {
    initVideo(document.getElementById('video-1'), `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8`);
    initVideo(document.getElementById('video-2'), `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8`);
    initVideo(document.getElementById('video-3'), `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8`);
    initVideo(document.getElementById('video-4'), `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8`);
}
exports.initVideos = initVideos;
//# sourceMappingURL=videoInitialization.js.map