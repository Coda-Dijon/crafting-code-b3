import { Weapon } from "./Weapon";

export class Character {
  n: string;
  r: string;
  w: Weapon;
  c: string = "Shire";

  constructor(n: string, r: string, w: Weapon) {
    this.n = n;
    this.r = r;
    this.w = w;
  }
}
