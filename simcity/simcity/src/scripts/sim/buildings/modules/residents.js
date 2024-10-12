import config from '../../../config.js';
import { Citizen } from '../../citizen.js';
import { City } from '../../city.js';
import { Zone as ResidentialZone } from '../../buildings/zones/zone.js';
import { DevelopmentState } from './development.js';
import { SimModule } from './simModule.js';

/**
 * Bir binada yaşayanların hareketini yönetir
 */
export class ResidentsModule extends SimModule {
  /**
   * @type {ResidentialZone}
   */
  #zone;

  /**
   * @type {Citizen[]}
   */
  #residents = [];

  /**
   * @param {ResidentialZone} zone 
   */
  constructor(zone) {
    super();
    this.#zone = zone; // Bölgeyi ayarla
  }

  /**
   * Mevcut oturanların sayısını döner
   * @type {number}
   */
  get count() {
    return this.#residents.length; // Oturanların sayısını döner
  }

  /**
   * Bu binada yaşayabilecek maksimum oturan sayısını döner
   * @returns {number}
   */
  get maximum() {
    return Math.pow(config.modules.residents.maxResidents, this.#zone.development.level); // Maksimum oturan sayısını hesapla
  }

  /**
   * Simülasyonu bir adım ileri taşır
   * @param {City} city 
   */
  simulate(city) {
    // Eğer bina terkedilmişse, tüm oturanlar çıkarılır ve yeni oturanların girmesine izin verilmez
    if (this.#zone.development.state === DevelopmentState.abandoned && this.#residents.length > 0) {
      this.evictAll(); // Tüm oturanları çıkar
    } else if (this.#zone.development.state === DevelopmentState.developed) {
      // Eğer yer var ise yeni oturanlar yerleşir
      if (this.#residents.length < this.maximum && Math.random() < config.modules.residents.residentMoveInChance) {
        this.#residents.push(new Citizen(this.#zone)); // Yeni bir oturan ekle
      }
    }

    // Her bir oturanın simülasyonunu ilerlet
    for (const resident of this.#residents) {
      resident.simulate(city);
    }
  }

  /**
   * Tüm oturanları binadan çıkarır
   */
  #evictAll() {
    for (const resident of this.#residents) {
      resident.dispose(); // Her bir oturanın temizleme işlemini yap
    }
    this.#residents = []; // Oturan listesini sıfırla
  }

  /**
   * Bir bina kaldırılmadan önce gerekli temizliği yapar
   */
  dispose() {
    this.#evictAll(); // Tüm oturanları çıkar
  }

  /**
   * Bu nesnenin HTML temsilini döner
   * @returns {string}
   */
  toHTML() {
    let html = `<div class="info-heading">Oturucular (${this.#residents.length}/${this.maximum})</div>`; // Oturan sayısını gösteren başlık

    html += '<ul class="info-citizen-list">'; // Oturanların listesini oluştur
    for (const resident of this.#residents) {
      html += resident.toHTML(); // Her bir oturanın HTML temsilini ekle
    }
    html += '</ul>';

    return html; // HTML içeriğini döner
  }
}
