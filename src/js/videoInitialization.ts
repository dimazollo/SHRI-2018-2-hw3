import Hls from 'hls.js';

// init video streams
const streamServerIp = '127.0.0.1';
const port = '9191';

export function initVideo(video: HTMLVideoElement, url: string) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
}

export function initVideos() {
  initVideo(
    <HTMLVideoElement> document.getElementById('video-1'),
    `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8`
  );

  initVideo(
    <HTMLVideoElement> document.getElementById('video-2'),
    `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8`
  );

  initVideo(
    <HTMLVideoElement> document.getElementById('video-3'),
    `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8`
  );

  initVideo(
    <HTMLVideoElement> document.getElementById('video-4'),
    `http://${streamServerIp}:${port}/master?url=http%3A%2F%2F${streamServerIp}%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8`
  );
}
