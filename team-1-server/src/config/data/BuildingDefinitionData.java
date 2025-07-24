package config.data;

/**
 * POJO for building definition data configuration
 */
public class BuildingDefinitionData {
    private int gold;
    private int level;
    private String buildingID;
    private int cell;

    /**
     * Default constructor
     */
    public BuildingDefinitionData() {
        this.gold = 0;
        this.level = 0;
        this.buildingID = "";
        this.cell = 0;
    }

    /**
     * Constructor with all fields
     */
    public BuildingDefinitionData(int gold, int level, String buildingID, int cell) {
        this.gold = gold;
        this.level = level;
        this.buildingID = buildingID;
        this.cell = cell;
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getBuildingID() {
        return buildingID;
    }

    public void setBuildingID(String buildingID) {
        this.buildingID = buildingID;
    }

    public int getCell() {
        return cell;
    }

    public void setCell(int cell) {
        this.cell = cell;
    }

    @Override
    public String toString() {
        return "BuildingDefinitionData{" +
                "gold=" + gold +
                ", level=" + level +
                ", buildingID='" + buildingID + '\'' +
                ", cell=" + cell +
                '}';
    }
}