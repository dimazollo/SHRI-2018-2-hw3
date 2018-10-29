const hundredPercents = 100;

export default class VideoModel {
  private _brightness: number = 1.0;
  private _contrast: number = 1.0;
  private _volume: number = 1.0;
  tile: HTMLElement;
  videoElement: HTMLVideoElement | null;
  audioSourceNode: any;

  constructor(tile: HTMLElement) {
    this.tile = tile;
    this.videoElement = tile.querySelector('video');
    this.audioSourceNode = null;
  }

  updateFilters() {
    if (this.videoElement) {
      this.videoElement.style.filter =
        `brightness(${this._brightness}) contrast(${this._contrast})`;
    }
  }

  get brightness() {
    return Math.floor(this._brightness * hundredPercents);
  }

  set brightness(value) {
    this._brightness = value / hundredPercents;
    this.updateFilters();
  }

  get contrast() {
    return Math.floor(this._contrast * hundredPercents);
  }

  set contrast(value) {
    this._contrast = value / hundredPercents;
    this.updateFilters();
  }

  get volume() {
    return Math.floor(this._volume * hundredPercents);
  }

  set volume(value) {
    this._volume = value / hundredPercents;
  }
}
