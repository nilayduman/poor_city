import { SimModule } from './simModule.js';

export class PowerModule extends SimModule {
  supplied = 0;
  required = 0;

  constructor(powerRequired) {
    super();
    if (powerRequired < 0) {
      throw new Error("Power required cannot be negative");
    }
    this.required = powerRequired; 
  }

  get isFullyPowered() {
    return this.supplied >= this.required; 
  }
}

