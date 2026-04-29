package lotr;

import java.util.ArrayList;
import java.util.List;

public class FellowshipOfTheRingService {
    private List<Character> members = new ArrayList<>();

    public void addMember(Character character) {
        if (character == null) {
            throw new IllegalArgumentException("Character cannot be null.");
        } else if (character.n == null || character.n.isBlank()) {
            throw new IllegalArgumentException("Character must have a name.");
        } else if (character.r == null || character.r.isBlank()) {
            throw new IllegalArgumentException("Character must have a race.");
        } else if (character.w == null) {
            throw new IllegalArgumentException("Character must have a weapon.");
        } else if (character.w.name == null || character.w.name.isBlank()) {
            throw new IllegalArgumentException("A weapon must have a name.");
        } else if (character.w.damage <= 0) {
            throw new IllegalArgumentException("A weapon must have a damage level.");
        } else {
            boolean exists = false;
            for (Character member : members) {
                if (member.n.equals(character.n)) {
                    exists = true;
                    break;
                }
            }

            if (exists) {
                throw new IllegalStateException(
                    "A character with the same name already exists in the fellowship.");
            } else {
                members.add(character);
            }
        }
    }

    public void updateCharacterWeapon(String name, String newWeapon, int damage) {
        for (Character character : members) {
            if (character.n.equals(name)) {
                character.w = new Weapon(newWeapon, damage);
                break;
            }
        }
    }

    public void removeMember(String name) {
        Character characterToRemove = null;
        for (Character character : members) {
            if (character.n.equals(name)) {
                characterToRemove = character;
                break;
            }
        }

        if (characterToRemove == null) {
            throw new IllegalStateException(
                "No character with the name '" + name + "' exists in the fellowship.");
        } else {
            members.remove(characterToRemove);
        }
    }

    public void moveMembersToRegion(List<String> memberNames, String region) {
        for (String name : memberNames) {
            for (Character character : members) {
                if (character.n.equals(name)) {
                    if (character.c.equals("Mordor") && !region.equals("Mordor")) {
                        throw new IllegalStateException(
                            "Cannot move " + character.n + " from Mordor to " + region +
                            ". Reason: There is no coming back from Mordor.");
                    } else {
                        character.c = region;
                        if (!region.equals("Mordor")) {
                            System.out.println(character.n + " moved to " + region + ".");
                        } else {
                            System.out.println(character.n + " moved to " + region + " 💀.");
                        }
                    }
                }
            }
        }
    }

    public void printMembersInRegion(String region) {
        List<Character> charactersInRegion = new ArrayList<>();
        for (Character character : members) {
            if (character.c.equals(region)) {
                charactersInRegion.add(character);
            }
        }

        if (charactersInRegion.size() > 0) {
            System.out.println("Members in " + region + ":");
            for (Character character : charactersInRegion) {
                System.out.println(character.n + " (" + character.r + ") with " + character.w.name);
            }
        } else if (charactersInRegion.size() == 0) {
            System.out.println("No members in " + region);
        }
    }

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder("Fellowship of the Ring Members:\n");
        for (Character member : members) {
            result.append(member.n)
                  .append(" (").append(member.r).append(")")
                  .append(" with ").append(member.w.name)
                  .append(" in ").append(member.c)
                  .append("\n");
        }
        return result.toString();
    }
}
