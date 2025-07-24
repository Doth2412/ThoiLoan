package config.data;

/**
 * POJO for resource data configuration
 */
public class ResourceData {
    private int gold;
    private int oil;

    /**
     * Default constructor
     */
    public ResourceData() {
        this.gold = 0;
        this.oil = 0;
    }

    /**
     * Constructor with all fields
     * 
     * @param gold the gold amount
     * @param oil  the oil amount
     */
    public ResourceData(int gold, int oil) {
        this.gold = gold;
        this.oil = oil;
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }

    public int getOil() {
        return oil;
    }

    public void setOil(int oil) {
        this.oil = oil;
    }

    @Override
    public String toString() {
        return "ResourceData{" +
                "gold=" + gold +
                ", oil=" + oil +
                '}';
    }
}