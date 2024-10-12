import * as THREE from 'three';
import { SimObject } from '../simObject';
import { BuildingStatus } from './buildingStatus';
import { PowerModule } from './modules/power';
import { RoadAccessModule } from './modules/roadAccess';

export class Building extends SimObject {
  /**
   * The building type
   * @type {string}
   */
  type = 'building';
  
  /**
   * True if the terrain should not be rendered with this building type
   * @type {boolean}
   */
  hideTerrain = false;

  /**
   * Modules for power and road access
   * @type {PowerModule}
   * @type {RoadAccessModule}
   */
  power = new PowerModule(this);
  roadAccess = new RoadAccessModule(this);

  /**
   * The current status of the building
   * @type {string}
   */
  status = BuildingStatus.Ok;

  /**
   * Icon displayed when building status
   * @type {THREE.Sprite}
   */
  #statusIcon = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false }));

  constructor() {
    super();
    this.#initializeStatusIcon();
  }

  /**
   * Initialize the status icon properties
   */
  #initializeStatusIcon() {
    this.#statusIcon.visible = false;
    this.#statusIcon.layers.set(1);
    this.#statusIcon.scale.set(0.5, 0.5, 0.5);
    this.add(this.#statusIcon);
  }

  /**
   * Update the building status and corresponding icon
   * @param {string} status 
   */
  setStatus(status) {
    if (status !== this.status) {
      this.status = status;
      this.#updateStatusIcon();
    }
  }

  #updateStatusIcon() {
    this.#statusIcon.visible = this.status !== BuildingStatus.Ok;

    if (this.status === BuildingStatus.NoPower) {
      this.#statusIcon.material.map = window.assetManager.statusIcons[this.status];
    } else if (this.status === BuildingStatus.NoRoadAccess) {
      this.#statusIcon.material.map = window.assetManager.statusIcons[this.status];
    }
  }

  simulate(city) {
    super.simulate(city);
    
    this.power.simulate(city);
    this.roadAccess.simulate(city);
    
    if (!this.power.isFullyPowered) {
      this.setStatus(BuildingStatus.NoPower);
    } else if (!this.roadAccess.value) {
      this.setStatus(BuildingStatus.NoRoadAccess);
    } else {
      this.setStatus(BuildingStatus.Ok);
    }
  }

  dispose() {
    this.power.dispose();
    this.roadAccess.dispose();
    super.dispose();
  }

  /**
   * Returns an HTML representation of this object
   * @returns {string}
   */
  toHTML() {
    const html = `
      <div class="info-heading">Building</div>
      <span class="info-label">Name:</span>
      <span class="info-value">${this.name}</span>
      <br>
      <span class="info-label">Type:</span>
      <span class="info-value">${this.type}</span>
      <br>
      <span class="info-label">Road Access:</span>
      <span class="info-value">${this.roadAccess.value}</span>
      <br>
      ${this.power.required > 0 ? `
        <span class="info-label">Power (kW):</span>
        <span class="info-value">${this.power.supplied}/${this.power.required}</span>
        <br>
      ` : ''}
    `;
    return html;
  }
}
