import { Building } from '../building.js';
import { BuildingType } from '../buildingType.js';

export class PowerPlant extends Building {
  /**
   * Kullanılabilir güç birimleri (kW)
   * @type {number}
   */
  powerCapacity = 100;

  /**
   * Tüketilen güç birimleri
   * @type {number}
   */
  powerConsumed = 0;

  constructor(x, y) {
    super(x, y);
    this.type = BuildingType.powerPlant;
  }

  /**
   * Mevcut güç miktarını alır
   * @returns {number} Mevcut güç (kW)
   */
  get powerAvailable() {
    // Güç santrali, güç sağlamak için yol erişimine sahip olmalıdır
    return this.roadAccess.value ? this.powerCapacity - this.powerConsumed : 0;
  }

  refreshView() {
    const mesh = window.assetManager.getModel(this.type, this);
    this.setMesh(mesh);
  }

  /**
   
   * @returns {string} 
   */
  toHTML() {
    const html = super.toHTML() +
      `
      <div class="info-heading">Güç</div>
      <span class="info-label">Güç Kapasitesi (kW)</span>
      <span class="info-value">${this.powerCapacity}</span>
      <br>
      <span class="info-label">Tüketilen Güç (kW)</span>
      <span class="info-value">${this.powerConsumed}</span>
      <br>
      <span class="info-label">Mevcut Güç (kW)</span>
      <span class="info-value">${this.powerAvailable}</span>
      <br>
    `;
    return html;
  }
}
