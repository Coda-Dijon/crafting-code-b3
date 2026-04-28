import { describe, expect, it } from 'vitest';
import { Vehicle } from '../src/Vehicle.js';

class TestableVehicle extends Vehicle {
  fillUpWithFuel(): void {}
  chargeBattery(): void {}
}

describe('Vehicle', () => {
  it('starts engine', () => {
    const vehicle = new TestableVehicle();
    vehicle.startEngine();
    expect(vehicle.engineIsStarted()).toBe(true);
  });

  it('stops engine', () => {
    const vehicle = new TestableVehicle();
    vehicle.startEngine();
    vehicle.stopEngine();
    expect(vehicle.engineIsStarted()).toBe(false);
  });
});
