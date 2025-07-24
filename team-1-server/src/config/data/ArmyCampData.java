package config.data;

/**
 * POJO for army camp data configuration
 */
public class ArmyCampData {
    private int baseHitPoints;
    private Size size;
    private int housingCapacity;
    private int buildTime;
    private int townHallLevelRequired;
    private ResourceType resourceRequired;
    private int buildingCost;

    /**
     * Default constructor
     */
    public ArmyCampData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.housingCapacity = 0;
        this.buildTime = 0;
        this.townHallLevelRequired = 0;
        this.resourceRequired = ResourceType.NONE;
        this.buildingCost = 0;
    }

    /**
     * Constructor with all fields
     */
    public ArmyCampData(int baseHitPoints, Size size, int housingCapacity,
            int buildTime, int townHallLevelRequired,
            ResourceType resourceRequired, int buildingCost) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
        this.housingCapacity = housingCapacity;
        this.buildTime = buildTime;
        this.townHallLevelRequired = townHallLevelRequired;
        this.resourceRequired = resourceRequired;
        this.buildingCost = buildingCost;
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

    public int getHousingCapacity() {
        return housingCapacity;
    }

    public void setHousingCapacity(int housingCapacity) {
        this.housingCapacity = housingCapacity;
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

    @Override
    public String toString() {
        return "ArmyCampData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", housingCapacity=" + housingCapacity +
                ", buildTime=" + buildTime +
                ", townHallLevelRequired=" + townHallLevelRequired +
                ", resourceRequired=" + resourceRequired +
                ", buildingCost=" + buildingCost +
                '}';
    }
}