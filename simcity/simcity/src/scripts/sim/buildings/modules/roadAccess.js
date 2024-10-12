import config from '../../../config.js';
import { City } from '../../city.js';
import { Building } from '../building.js';
import { SimModule } from './simModule.js';

/**
 * Bir binanın yol erişimini belirler
 */
export class RoadAccessModule extends SimModule {
  /**
   * @type {Building}
   */
  building;
  
  /**
   * @type {boolean}
   */
  enabled = true;
  
  /**
   * Yol erişiminin durumu
   * @type {boolean}
   */
  value = false;

  /**
   * @param {Building} building 
   */
  constructor(building) {
    super();
    this.building = building; // Bina nesnesini ayarla
  }

  /**
   * Bu modülün durumunu günceller
   * @param {City} city 
   */
  simulate(city) {
    // Eğer yol erişimi devre dışı ise, erişim sağlanmış say
    if (!this.enabled) {
      this.value = true;
      return; // Güncelleme tamamlandı, erken çık
    }

    // Yol araması yap
    const roadExists = city.findTile(
      this.building,
      (tile) => tile.building?.type === 'road',
      config.modules.roadAccess.searchDistance
    );

    this.value = Boolean(roadExists); // Yol var mı yok mu kontrol et
  }
}
