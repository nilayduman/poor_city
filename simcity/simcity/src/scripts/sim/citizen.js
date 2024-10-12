import { CommercialZone } from './buildings/zones/commercial.js';
import { IndustrialZone } from './buildings/zones/industrial.js';
import { ResidentialZone } from './buildings/zones/residential.js';
import config from '../config.js';

export class Citizen {
  constructor(residence) {
    this.id = crypto.randomUUID();
    this.name = generateRandomName();
    this.age = this.#generateRandomAge();
    this.state = this.#initializeState();
    this.stateCounter = 0;
    this.residence = residence;
    this.workplace = null;
  }

  #generateRandomAge() {
    return 1 + Math.floor(Math.random() * 100);
  }

  #initializeState() {
    if (this.age < config.citizen.minWorkingAge) return 'school';
    if (this.age >= config.citizen.retirementAge) return 'retired';
    return 'unemployed';
  }

  simulate(city) {
    const actions = {
      idle: this.#handleIdle,
      school: this.#handleSchool,
      retired: this.#handleRetired,
      unemployed: this.#handleUnemployed.bind(this, city),
      employed: this.#handleEmployed.bind(this)
    };

    const action = actions[this.state] || this.#handleUnknownState;
    action();
  }

  #handleIdle() {
    }

  #handleSchool() {
    }

  #handleRetired() {
    }

  #handleUnemployed(city) {
    this.workplace = this.#findJob(city);
    if (this.workplace) this.state = 'employed';
  }

  #handleEmployed() {
    if (!this.workplace) this.state = 'unemployed';
  }

  #handleUnknownState() {
    console.error(`Citizen ${this.id} is in an unknown state (${this.state})`);
  }

  dispose() {
    this.#removeFromWorkplace();
  }

  #removeFromWorkplace() {
    const index = this.workplace?.jobs.workers.indexOf(this);
    if (index !== -1) {
      this.workplace.jobs.workers.splice(index, 1);
    }
  }

  #findJob(city) {
    const tile = city.findTile(this.residence, this.#jobSearchCondition.bind(this), config.citizen.maxJobSearchDistance);
    if (tile) {
      tile.building.jobs.workers.push(this);
      return tile.building;
    }
    return null;
  }

  #jobSearchCondition(tile) {
    const isValidBuilding = tile.building?.type === 'industrial' || tile.building?.type === 'commercial';
    return isValidBuilding && tile.building.jobs.availableJobs > 0;
  }

  toHTML() {
    return `
      <li class="info-citizen">
        <span class="info-citizen-name">${this.name}</span>
        <br>
        <span class="info-citizen-details">
          <span>
            <img class="info-citizen-icon" src="/icons/calendar.png">
            ${this.age} 
          </span>
          <span>
            <img class="info-citizen-icon" src="/icons/job.png">
            ${this.state}
          </span>
        </span>
      </li>
    `;
  }
}

function generateRandomName(length = 5) {
  const randomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return characters.charAt(Math.floor(Math.random() * characters.length));
  };

  const firstName = Array.from({ length }).map(randomString).join('');
  const lastName = Array.from({ length }).map(randomString).join('');

  return `${capitalize(firstName)} ${capitalize(lastName)}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
