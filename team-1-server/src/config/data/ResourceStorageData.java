package config.data;

/**
 * POJO for resource storage data configuration
 */
public class ResourceStorageData {
    private int baseHitPoints;
    private Size size;
    private int baseCapacity;
    private ResourceType resourceStore;
    private ResourceType resourceRequired;
    private int buildingCost;
    private int buildTime;
    private int townHallLevelRequired;

    /**
     * Default constructor
     */
    public ResourceStorageData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.baseCapacity = 0;
        this.resourceStore = ResourceType.NONE;
        this.resourceRequired = ResourceType.NONE;
        this.buildingCost = 0;
        this.buildTime = 0;
        this.townHallLevelRequired = 0;
    }

    /**
     * Constructor with all fields
     */
    public ResourceStorageData(int baseHitPoints, Size size, int baseCapacity,
            ResourceType resourceStore, ResourceType resourceRequired,
            int buildingCost, int buildTime, int townHallLevelRequired) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
        this.baseCapacity = baseCapacity;
        this.resourceStore = resourceStore;
        this.resourceRequired = resourceRequired;
        this.buildingCost = buildingCost;
        this.buildTime = buildTime;
        this.townHallLevelRequired = townHallLevelRequired;
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

    public int getBaseCapacity() {
        return baseCapacity;
    }

    public void setBaseCapacity(int baseCapacity) {
        this.baseCapacity = baseCapacity;
    }

    public ResourceType getResourceStore() {
        return resourceStore;
    }

    public void setResourceStore(ResourceType resourceStore) {
        this.resourceStore = resourceStore;
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

    @Override
    public String toString() {
        return "ResourceStorageData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", baseCapacity=" + baseCapacity +
                ", resourceStore=" + resourceStore +
                ", resourceRequired=" + resourceRequired +
                ", buildingCost=" + buildingCost +
                ", buildTime=" + buildTime +
                ", townHallLevelRequired=" + townHallLevelRequired +
                '}';
    }
}