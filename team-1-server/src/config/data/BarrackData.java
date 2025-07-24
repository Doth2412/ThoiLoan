package config.data;

/**
 * POJO for barrack data configuration
 */
public class BarrackData {
    private int baseHitPoints;
    private Size size;
    private int queueLength;
    private int buildTime;
    private int townHallLevelRequired;
    private ResourceType resourceRequired;
    private int buildingCost;
    private String unlockedUnit;

    /**
     * Default constructor
     */
    public BarrackData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.queueLength = 0;
        this.buildTime = 0;
        this.townHallLevelRequired = 0;
        this.resourceRequired = ResourceType.NONE;
        this.buildingCost = 0;
        this.unlockedUnit = "";
    }

    /**
     * Constructor with all fields
     */
    public BarrackData(int baseHitPoints, Size size, int queueLength, int buildTime,
            int townHallLevelRequired, ResourceType resourceRequired,
            int buildingCost, String unlockedUnit) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
        this.queueLength = queueLength;
        this.buildTime = buildTime;
        this.townHallLevelRequired = townHallLevelRequired;
        this.resourceRequired = resourceRequired;
        this.buildingCost = buildingCost;
        this.unlockedUnit = unlockedUnit;
    }

    public int getBaseHitPoints() {
        return baseHitPoints;
    }

    public void setBaseHitPoints(int baseHitPoints) {
        this.baseHitPoints = baseHitPoints;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public int getQueueLength() {
        return queueLength;
    }

    public void setQueueLength(int queueLength) {
        this.queueLength = queueLength;
    }

    public int getBuildTime() {
        return buildTime;
    }

    public void setBuildTime(int buildTime) {
        this.buildTime = buildTime;
    }

    public int getTownHallLevelRequired() {
        return townHallLevelRequired;
    }

    public void setTownHallLevelRequired(int townHallLevelRequired) {
        this.townHallLevelRequired = townHallLevelRequired;
    }

    public ResourceType getResourceRequired() {
        return resourceRequired;
    }

    public void setResourceRequired(ResourceType resourceRequired) {
        this.resourceRequired = resourceRequired;
    }

    public int getBuildingCost() {
        return buildingCost;
    }

    public void setBuildingCost(int buildingCost) {
        this.buildingCost = buildingCost;
    }

    public String getUnlockedUnit() {
        return unlockedUnit;
    }

    public void setUnlockedUnit(String unlockedUnit) {
        this.unlockedUnit = unlockedUnit;
    }

    @Override
    public String toString() {
        return "BarrackData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", queueLength=" + queueLength +
                ", buildTime=" + buildTime +
                ", townHallLevelRequired=" + townHallLevelRequired +
                ", resourceRequired=" + resourceRequired +
                ", buildingCost=" + buildingCost +
                ", unlockedUnit='" + unlockedUnit + '\'' +
                '}';
    }
}