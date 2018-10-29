"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
exports.animationTime = 500; // in milliseconds
function animateOpen(tile) {
    const bClientRect = tile.getBoundingClientRect();
    tile.style.transformOrigin = `${-bClientRect.x}px ${-bClientRect.y}px`;
    tile.style.zIndex = '1';
    const translate = { x: 0, y: 0 };
    translate.x = -bClientRect.x;
    translate.y = -bClientRect.y;
    const scale = { x: 1.0, y: 1.0 };
    scale.x = window.innerWidth / bClientRect.width;
    scale.y = window.innerHeight / bClientRect.height;
    tile.style.transform =
        `scale(${scale.x}, ${scale.y}) translate(${translate.x}px, ${translate.y}px)`;
    tile.classList.toggle('full-size');
}
exports.animateOpen = animateOpen;
function animateClose() {
    if (state_1.state.openedTile) {
        state_1.state.openedTile.tile.style.transform = '';
        setTimeout(() => {
            if (state_1.state.openedTile) {
                state_1.state.openedTile.tile.style.zIndex = '0';
            }
            state_1.state.openedTile = null;
        }, exports.animationTime);
    }
}
exports.animateClose = animateClose;
//# sourceMappingURL=animation.js.map