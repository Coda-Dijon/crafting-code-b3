import { Character } from "./Character";
import { Weapon } from "./Weapon";

export class FellowshipOfTheRingService {
  private members: Character[] = [];

  addMember(character: Character): void {
    if (character === null || character === undefined) {
      throw new Error("Character cannot be null.");
    } else if (!character.n || character.n.trim() === "") {
      throw new Error("Character must have a name.");
    } else if (!character.r || character.r.trim() === "") {
      throw new Error("Character must have a race.");
    } else if (!character.w) {
      throw new Error("Character must have a weapon.");
    } else if (!character.w.name || character.w.name.trim() === "") {
      throw new Error("A weapon must have a name.");
    } else if (character.w.damage <= 0) {
      throw new Error("A weapon must have a damage level.");
    } else {
      let exists = false;
      for (const member of this.members) {
        if (member.n === character.n) {
          exists = true;
          break;
        }
      }

      if (exists) {
        throw new Error(
          "A character with the same name already exists in the fellowship."
        );
      } else {
        this.members.push(character);
      }
    }
  }

  updateCharacterWeapon(name: string, newWeapon: string, damage: number): void {
    for (const character of this.members) {
      if (character.n === name) {
        character.w = new Weapon(newWeapon, damage);
        break;
      }
    }
  }

  removeMember(name: string): void {
    let characterToRemove: Character | null = null;
    for (const character of this.members) {
      if (character.n === name) {
        characterToRemove = character;
        break;
      }
    }

    if (characterToRemove === null) {
      throw new Error(
        `No character with the name '${name}' exists in the fellowship.`
      );
    } else {
      this.members = this.members.filter((m) => m !== characterToRemove);
    }
  }

  moveMembersToRegion(memberNames: string[], region: string): void {
    for (const name of memberNames) {
      for (const character of this.members) {
        if (character.n === name) {
          if (character.c === "Mordor" && region !== "Mordor") {
            throw new Error(
              `Cannot move ${character.n} from Mordor to ${region}. Reason: There is no coming back from Mordor.`
            );
          } else {
            character.c = region;
            if (region !== "Mordor") {
              console.log(`${character.n} moved to ${region}.`);
            } else {
              console.log(`${character.n} moved to ${region} 💀.`);
            }
          }
        }
      }
    }
  }

  printMembersInRegion(region: string): void {
    const charactersInRegion: Character[] = [];
    for (const character of this.members) {
      if (character.c === region) {
        charactersInRegion.push(character);
      }
    }

    if (charactersInRegion.length > 0) {
      console.log(`Members in ${region}:`);
      for (const character of charactersInRegion) {
        console.log(`${character.n} (${character.r}) with ${character.w.name}`);
      }
    } else if (charactersInRegion.length === 0) {
      console.log(`No members in ${region}`);
    }
  }

  toString(): string {
    let result = "Fellowship of the Ring Members:\n";
    for (const member of this.members) {
      result += `${member.n} (${member.r}) with ${member.w.name} in ${member.c}\n`;
    }
    return result;
  }
}
