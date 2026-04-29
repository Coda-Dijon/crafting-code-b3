package lotr;

import java.util.List;

public class Main {
    static void main() {
        var fellowship = new FellowshipOfTheRingService();

        try {
            fellowship.addMember(new Character("Frodo",          "Hobbit", new Weapon("Sting",       30)));
            fellowship.addMember(new Character("Sam",            "Hobbit", new Weapon("Dagger",      10)));
            fellowship.addMember(new Character("Merry",          "Hobbit", new Weapon("Short Sword", 24)));
            fellowship.addMember(new Character("Pippin",         "Hobbit", new Weapon("Bow",          8)));
            fellowship.addMember(new Character("Aragorn",        "Human",  new Weapon("Anduril",    100)));
            fellowship.addMember(new Character("Boromir",        "Human",  new Weapon("Sword",       90)));
            fellowship.addMember(new Character("Legolas",        "Elf",    new Weapon("Bow",        100)));
            fellowship.addMember(new Character("Gimli",          "Dwarf",  new Weapon("Axe",        100)));
            fellowship.addMember(new Character("Gandalf the 🐐", "Wizard", new Weapon("Staff",      200)));

            System.out.println(fellowship);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        var group1 = List.of("Frodo", "Sam");
        var group2 = List.of("Merry", "Pippin", "Aragorn", "Boromir");
        var group3 = List.of("Legolas", "Gimli", "Gandalf the 🐐");

        fellowship.moveMembersToRegion(group1, "Rivendell");
        fellowship.moveMembersToRegion(group2, "Moria");
        fellowship.moveMembersToRegion(group3, "Lothlorien");

        try {
            var group4 = List.of("Frodo", "Sam");
            fellowship.moveMembersToRegion(group4, "Mordor");
            fellowship.moveMembersToRegion(group4, "Shire"); // should fail for "Frodo"
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        fellowship.printMembersInRegion("Rivendell");
        fellowship.printMembersInRegion("Moria");
        fellowship.printMembersInRegion("Lothlorien");
        fellowship.printMembersInRegion("Mordor");
        fellowship.printMembersInRegion("Shire");

        try {
            fellowship.removeMember("Frodo");
            fellowship.removeMember("Sam"); // should throw
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
