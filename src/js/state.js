"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class State {
    constructor() {
        this.openedTile = null;
        this.videoTiles = [];
        this.volumeLevel = 1.0;
        if (!State.instance) {
            State.instance = this;
        }
        else {
            return State.instance;
        }
    }
}
State.instance = null;
exports.state = new State();
//# sourceMappingURL=state.js.map