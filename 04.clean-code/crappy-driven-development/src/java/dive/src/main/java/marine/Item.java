package marine;

public class Item {
    public String n;
    public int sellIn;
    public int Y;

    public Item(String name, int sellIn, int quality) {
        this.n = name;
        this.sellIn = sellIn;
        this.Y = quality;
    }

    @Override
    public String toString() {
        return this.n + ", " + this.sellIn + ", " + this.Y;
    }
}