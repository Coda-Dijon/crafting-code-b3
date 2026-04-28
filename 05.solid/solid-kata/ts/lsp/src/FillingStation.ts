import { ElectricCar } from './ElectricCar.js';
import { PetrolCar } from './PetrolCar.js';
import { Vehicle } from './Vehicle.js';

export class FillingStation {
  refuel(vehicle: Vehicle): void {
    if (vehicle instanceof PetrolCar) {
      vehicle.fillUpWithFuel();
    }
  }

  charge(vehicle: Vehicle): void {
    if (vehicle instanceof ElectricCar) {
      vehicle.chargeBattery();
    }
  }
}
