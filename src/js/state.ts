import VideoModel from './VideoModel';

class State {
  public openedTile: VideoModel | null = null;
  public videoTiles: Array<VideoModel> = [];
  public volumeLevel: number = 1.0;
  private static instance: State | null = null;

  constructor() {
    if (!State.instance) {
      State.instance = this;
    } else {
      return State.instance;
    }
  }
}

export const state = new State();
