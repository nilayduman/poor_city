import { Game } from './game';
import { SimObject } from './sim/simObject';
import playIconUrl from '/icons/play-color.png';
import pauseIconUrl from '/icons/pause-color.png';

export class GameUI {
  activeToolId = 'select';
  selectedControl = document.getElementById('button-select');
  isPaused = false;

  get gameWindow() {
    return document.getElementById('render-target');
  }

  showLoadingText() {
    this.toggleLoadingTextVisibility(true);
  }

  hideLoadingText() {
    this.toggleLoadingTextVisibility(false);
  }

  toggleLoadingTextVisibility(isVisible) {
    document.getElementById('loading').style.visibility = isVisible ? 'visible' : 'hidden';
  }

  onToolSelected(event) {
    if (this.selectedControl) {
      this.selectedControl.classList.remove('selected');
    }
    this.selectedControl = event.target;
    this.selectedControl.classList.add('selected');
    this.activeToolId = this.selectedControl.getAttribute('data-type');
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    document.getElementById('pause-button-icon').src = this.isPaused ? playIconUrl : pauseIconUrl;
    document.getElementById('paused-text').style.visibility = this.isPaused ? 'visible' : 'hidden';
  }

  updateTitleBar(game) {
    document.getElementById('city-name').innerHTML = "Poor City"; 
    document.getElementById('population-counter').innerHTML = game.city.population;
    // Zamanı kaldırdık
    // Sim zamanını kaldırdık
  }

  updateInfoPanel(object) {
    const infoElement = document.getElementById('info-panel');
    infoElement.style.visibility = object ? 'visible' : 'hidden';
    infoElement.innerHTML = object ? object.toHTML() : '';
  }
}

window.ui = new GameUI();
