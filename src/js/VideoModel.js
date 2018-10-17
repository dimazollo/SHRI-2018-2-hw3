export default class VideoModel {
  constructor(domNode) {
    this._brightness = 1.0;
    this._contrast = 1.0;
    this._volume = 1.0;
    this.domNode = domNode;
  }

  updateFilters() {
    this.domNode.style.filter = `brightness(${this._brightness}) contrast(${this._contrast})`;
  }

  get brightness() {
    return Math.floor(this._brightness * 100);
  }

  set brightness(value) {
    this._brightness = value / 100;
    this.updateFilters();
  }

  get contrast() {
    return Math.floor(this._contrast * 100);
  }

  set contrast(value) {
    this._contrast = value / 100;
    this.updateFilters();
  }

  get volume() {
    return Math.floor(this._volume * 100);
  }

  set volume(value) {
    this._volume = value / 100;
  }
}
