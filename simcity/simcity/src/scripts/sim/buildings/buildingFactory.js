import { BuildingType } from './buildingType.js';
import { CommercialZone } from './zones/commercial.js';
import { ResidentialZone } from './zones/residential.js';
import { IndustrialZone } from './zones/industrial.js';
import { Road } from './transportation/road.js';
import { PowerPlant } from './power/powerPlant.js';
import { PowerLine } from './power/powerLine.js';

/**
 
 * @param {number} x The x-coordinate of the building
 * @param {number} y The y-coordinate of the building
 * @param {string} type The building type
 * @returns {Building} A new building object or undefined if type is not recognized
 */
export function createBuilding(x, y, type) {
  const buildingMap = {
    [BuildingType.residential]: () => new ResidentialZone(x, y),
    [BuildingType.commercial]: () => new CommercialZone(x, y),
    [BuildingType.industrial]: () => new IndustrialZone(x, y),
    [BuildingType.road]: () => new Road(x, y),
    [BuildingType.powerPlant]: () => new PowerPlant(x, y),
    [BuildingType.powerLine]: () => new PowerLine(x, y)
  };

  const createBuildingFunc = buildingMap[type];

  if (createBuildingFunc) {
    return createBuildingFunc();
  } else {
    console.error(`${type} is not a recognized building type.`);
  }
}
