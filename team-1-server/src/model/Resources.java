package model;

/**
 * Represents the resources a player has in the game
 */
public class Resources {
    private int gold;
    private int oil;
    private int gems; // Interpret 'G' as 'gems'

    private int maxGoldCapacity;
    private int maxOilCapacity;

    // Default constructor for Gson
    public Resources() {
    }

    public Resources(int gold, int oil, int gems) {
        this.gold = gold;
        this.oil = oil;
        this.gems = gems;
    }

    // Getters and Setters
    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = Math.max(0, Math.min(gold, this.maxGoldCapacity));
    }

    public int getOil() {
        return oil;
    }

    public void setOil(int oil) {
        this.oil = Math.max(0, Math.min(oil, this.maxOilCapacity));
    }

    public int getGems() {
        return gems;
    }

    public void setGems(int gems) {
        this.gems = gems;
    }

    public int getMaxGoldCapacity() {
        return maxGoldCapacity;
    }

    public void setMaxGoldCapacity(int maxGoldCapacity) {
        this.maxGoldCapacity = maxGoldCapacity;
    }

    public int getMaxOilCapacity() {
        return maxOilCapacity;
    }

    public void setMaxOilCapacity(int maxOilCapacity) {
        this.maxOilCapacity = maxOilCapacity;
    }

    @Override
    public String toString() {
        return "Resources{" +
                "gold=" + gold +
                ", oil=" + oil +
                ", gems=" + gems +
                '}';
    }
}
