"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hundredPercents = 100;
class VideoModel {
    constructor(tile) {
        this._brightness = 1.0;
        this._contrast = 1.0;
        this._volume = 1.0;
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
exports.default = VideoModel;
//# sourceMappingURL=VideoModel.js.map