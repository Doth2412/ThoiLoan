package config.data;

import com.google.gson.annotations.SerializedName;

/**
 * POJO for player data configuration
 */
public class PlayerData {
    @SerializedName("gold") // Explicitly map JSON key "gold" to this field
    private int gold;
    @SerializedName("elixir") // Maps JSON key "elixir" to this field
    private int oil;
    @SerializedName("coin") // Maps JSON key "coin" to this field
    private int gem;
    private int builderNumber;

    /**
     * Default constructor
     */
    public PlayerData() {
        this.gold = 0;
        this.oil = 0;
        this.gem = 0;
        this.builderNumber = 0;
    }

    /**
     * Constructor with all fields
     */
    public PlayerData(int gold, int oil, int gem, int builderNumber) {
        this.gold = gold;
        this.oil = oil;
        this.gem = gem;
        this.builderNumber = builderNumber;
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

    public int getGem() {
        return gem;
    }

    public void setGem(int gem) {
        this.gem = gem;
    }

    public int getBuilderNumber() {
        return builderNumber;
    }

    public void setBuilderNumber(int builderNumber) {
        this.builderNumber = builderNumber;
    }

    @Override
    public String toString() {
        return "PlayerData{" +
                "gold=" + gold +
                ", oil=" + oil +
                ", gem=" + gem +
                ", builderNumber=" + builderNumber +
                '}';
    }
}