import * as THREE from 'three';
import { Building } from '../building.js';
import { BuildingType } from '../buildingType.js';

const Side = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
};

const powerLineMaterial = new THREE.LineBasicMaterial({ color: 0 });

export class PowerLine extends Building {
  constructor(x, y) {
    super(x, y);
    this.type = BuildingType.powerLine;
    this.roadAccess.enabled = false; // Yol erişimini devre dışı bırak
  }

  refreshView(city) {
    const group = new THREE.Group();
    const tower = window.assetManager.getModel(this.type, this);
    tower.rotation.y = Math.PI / 4; // Kulesi 45 derece döndür

    // Yanındaki yolları kontrol et
    const sides = this.#checkAdjacentTiles(city);

    group.add(tower);

    // Bağlantıları ekle
    for (const side of Object.keys(sides)) {
      if (sides[side]) {
        this.#addLines(group, side);
      }
    }

    this.setMesh(group);
  }

  #checkAdjacentTiles(city) {
    return {
      [Side.Top]: city.getTile(this.x, this.y - 1)?.building?.type === this.type,
      [Side.Bottom]: city.getTile(this.x, this.y + 1)?.building?.type === this.type,
      [Side.Left]: city.getTile(this.x - 1, this.y)?.building?.type === this.type,
      [Side.Right]: city.getTile(this.x + 1, this.y)?.building?.type === this.type,
    };
  }

  #addLines(group, side) {
    const offsets = {
      [Side.Left]: [[-0.09, 0.36, 0.09], [-0.09, 0.36, -0.09]],
      [Side.Right]: [[0.09, 0.36, 0.09], [0.09, 0.36, -0.09]],
      [Side.Top]: [[0.09, 0.36, -0.09], [-0.09, 0.36, -0.09]],
      [Side.Bottom]: [[0.09, 0.36, 0.09], [-0.09, 0.36, 0.09]],
    };

    offsets[side].forEach(([x, y, z]) => {
      const xOffset = side === Side.Left || side === Side.Right ? (side === Side.Left ? -0.5 : 0.5) : x;
      const zOffset = side === Side.Top || side === Side.Bottom ? (side === Side.Top ? -0.5 : 0.5) : z;
      group.add(this.#createPowerLine(x, y, z, xOffset, y, zOffset));
    });
  }

  /**
   * İki nokta arasında yeni bir güç hattı oluşturur
   * @returns {THREE.Line} Oluşturulan güç hattı
   */
  #createPowerLine(x1, y1, z1, x2, y2, z2) {
    const points = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const powerLine = new THREE.Line(geometry, powerLineMaterial);
    powerLine.layers.set(1); // Raycaster ile etkileşime girmemesi için katman 1'e yerleştir
    return powerLine;
  }
}
