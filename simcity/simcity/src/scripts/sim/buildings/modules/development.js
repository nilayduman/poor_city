import config from '../../../config.js';
import { City } from '../../city.js';
import { Zone } from '../../buildings/zones/zone.js';
import { SimModule } from './simModule.js';

export const DevelopmentState = {
  abandoned: 'abandoned',
  developed: 'developed',
  underConstruction: 'under-construction',
  undeveloped: 'undeveloped',
};

export class DevelopmentModule extends SimModule {
  #abandonmentCounter = 0;
  #constructionCounter = 0;
  #level = 1;
  maxLevel = 3;
  #state = DevelopmentState.undeveloped;
  #zone;

  constructor(zone) {
    super();
    this.#zone = zone;
  }

  get level() {
    return this.#level;
  }

  set level(value) {
    if (value >= 1 && value <= this.maxLevel) {
      this.#level = value;
      this.#zone.refreshView();
    }
  }

  get state() {
    return this.#state;
  }

  set state(value) {
    this.#state = value;

    switch (value) {
      case DevelopmentState.underConstruction:
        this.#zone.playConstructionAnimation();
        break;
      case DevelopmentState.abandoned:
        this.#zone.playAbandonmentAnimation();
        break;
      case DevelopmentState.developed:
        this.#zone.playDevelopmentAnimation();
        break;
      default:
        this.#zone.refreshView();
    }
  }

  simulate(city) {
    this.#checkAbandonmentCriteria();

    switch (this.state) {
      case DevelopmentState.undeveloped:
        if (this.#checkDevelopmentCriteria() && Math.random() < config.modules.development.redevelopChance) {
          this.startConstruction();
        }
        break;
      case DevelopmentState.underConstruction:
        if (++this.#constructionCounter >= config.modules.development.constructionTime) {
          this.completeConstruction();
        }
        break;
      case DevelopmentState.developed:
        if (this.#abandonmentCounter > config.modules.development.abandonThreshold) {
          if (Math.random() < config.modules.development.abandonChance) {
            this.state = DevelopmentState.abandoned;
          }
        } else if (this.level < this.maxLevel && Math.random() < config.modules.development.levelUpChance) {
          this.level++;
        }
        break;
      case DevelopmentState.abandoned:
        if (this.#abandonmentCounter === 0 && Math.random() < config.modules.development.redevelopChance) {
          this.state = DevelopmentState.developed;
        }
        break;
    }
  }

  startConstruction() {
    this.state = DevelopmentState.underConstruction;
    this.#constructionCounter = 0;
  }

  completeConstruction() {
    this.state = DevelopmentState.developed;
    this.level = 1; // Geliştirme tamamlandığında seviyeyi sıfırlama
    this.#constructionCounter = 0;
  }

  #checkDevelopmentCriteria() {
    return (
      this.#zone.roadAccess.value &&
      this.#zone.power.isFullyPowered
    );
  }

  #checkAbandonmentCriteria() {
    if (!this.#checkDevelopmentCriteria()) {
      this.#abandonmentCounter++;
    } else {
      this.#abandonmentCounter = 0;
    }
  }

  toHTML() {
    let stateInfo = '';

    switch (this.state) {
      case DevelopmentState.underConstruction:
        stateInfo = `<span class="status under-construction">Under Construction</span>`;
        break;
      case DevelopmentState.abandoned:
        stateInfo = `<span class="status abandoned">Abandoned</span>`;
        break;
      case DevelopmentState.developed:
        stateInfo = `<span class="status developed">Developed</span>`;
        break;
      default:
        stateInfo = `<span class="status undeveloped">Undeveloped</span>`;
    }

    return `
      <span class="info-label">State </span>
      <span class="info-value">${stateInfo}</span>
      <br>
      <span class="info-label">Level </span>
      <span class="info-value">${this.level}</span>
      <br>
      <span class="info-label">Abandonment Counter </span>
      <span class="info-value">${this.#abandonmentCounter}</span>
      <br>
      <span class="info-label">Construction Counter </span>
      <span class="info-value">${this.#constructionCounter}</span>
      <br>
      <span class="info-label">Maximum Level </span>
      <span class="info-value">${this.maxLevel}</span>
      <br>`;
  }
}

      