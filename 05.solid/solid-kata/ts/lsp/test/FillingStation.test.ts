import { describe, expect, it } from 'vitest';
import { ElectricCar } from '../src/ElectricCar.js';
import { FillingStation } from '../src/FillingStation.js';
import { PetrolCar } from '../src/PetrolCar.js';

const FULL = 100;

describe('FillingStation', () => {
  const fillingStation = new FillingStation();

  it('refuels a petrol car', () => {
    const car = new PetrolCar();
    fillingStation.refuel(car);
    expect(car.fuelTankLevel()).toBe(FULL);
  });

  it('does not fail refueling an electric car', () => {
    const car = new ElectricCar();
    expect(() => fillingStation.refuel(car)).not.toThrow();
  });

  it('recharges an electric car', () => {
    const car = new ElectricCar();
    fillingStation.charge(car);
    expect(car.batteryLevel()).toBe(FULL);
  });

  it('does not fail recharging a petrol car', () => {
    const car = new PetrolCar();
    expect(() => fillingStation.charge(car)).not.toThrow();
  });
});
