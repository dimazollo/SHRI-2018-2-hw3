import {state} from './state';

export const animationTime = 500; // in milliseconds

export function animateOpen(tile) {
  const bClientRect = tile.getBoundingClientRect();
  tile.style.transformOrigin = `${-bClientRect.x}px ${-bClientRect.y}px`;
  tile.style.zIndex = '1';
  let translate = {x: 0, y: 0};

  translate.x = -bClientRect.x;
  translate.y = -bClientRect.y;

  let scale = {x: 1.0, y: 1.0};
  scale.x = window.innerWidth / bClientRect.width;
  scale.y = window.innerHeight / bClientRect.height;

  tile.style.transform = `scale(${scale.x}, ${scale.y}) translate(${translate.x}px, ${translate.y}px)`;
  tile.classList.toggle('full-size');
}

export function animateClose() {
  state.openedTile.tile.style.transform = '';
  setTimeout(() => {
    state.openedTile.tile.style.zIndex = '0';
    state.openedTile = null;
  }, animationTime);
}
