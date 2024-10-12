export class InputManager {
  mouse = { x: 0, y: 0 };
  isLeftMouseDown = false;
  isMiddleMouseDown = false;
  isRightMouseDown = false;

  constructor() {
    const gameWindow = window.ui.gameWindow;
    gameWindow.addEventListener('mousedown', this.#onMouseDown.bind(this), false);
    gameWindow.addEventListener('mouseup', this.#onMouseUp.bind(this), false);
    gameWindow.addEventListener('mousemove', this.#onMouseMove.bind(this), false);
    gameWindow.addEventListener('contextmenu', (event) => event.preventDefault(), false);
  }

  #onMouseDown(event) {
    const buttonMap = { 0: 'isLeftMouseDown', 1: 'isMiddleMouseDown', 2: 'isRightMouseDown' };
    if (buttonMap[event.button] !== undefined) {
      this[buttonMap[event.button]] = true;
    }
  }

  #onMouseUp(event) {
    const buttonMap = { 0: 'isLeftMouseDown', 1: 'isMiddleMouseDown', 2: 'isRightMouseDown' };
    if (buttonMap[event.button] !== undefined) {
      this[buttonMap[event.button]] = false;
    }
  }

  #onMouseMove(event) {
    this.mouse = { x: event.clientX, y: event.clientY };
    this.isLeftMouseDown = event.buttons & 1;
    this.isRightMouseDown = event.buttons & 2;
    this.isMiddleMouseDown = event.buttons & 4;
  }
}

