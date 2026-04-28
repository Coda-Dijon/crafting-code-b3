import { Vehicle } from './Vehicle.js';

export class PetrolCar extends Vehicle {
  private static readonly FUEL_TANK_FULL = 100;
  private _fuelTankLevel = 0;

  fillUpWithFuel(): void {
    this._fuelTankLevel = PetrolCar.FUEL_TANK_FULL;
  }

  chargeBattery(): void {
    throw new Error('A petrol car cannot be recharged');
  }

  fuelTankLevel(): number {
    return this._fuelTankLevel;
  }
}
