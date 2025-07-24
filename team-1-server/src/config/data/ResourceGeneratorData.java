package config.data;

/**
 * POJO for resource generator data configuration
 */
public class ResourceGeneratorData {
    private int baseHitPoints;
    private Size size;
    private int productivity;
    private int baseCapacity;
    private ResourceType resourceGenerate;
    private ResourceType resourceRequired;
    private int buildingCost;
    private int buildTime;
    private int townHallLevelRequired;

    /**
     * Default constructor
     */
    public ResourceGeneratorData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.productivity = 0;
        this.baseCapacity = 0;
        this.resourceGenerate = ResourceType.NONE;
        this.resourceRequired = ResourceType.NONE;
        this.buildingCost = 0;
        this.buildTime = 0;
        this.townHallLevelRequired = 0;
    }

    /**
     * Constructor with all fields
     */
    public ResourceGeneratorData(int baseHitPoints, Size size, int productivity,
            int baseCapacity, ResourceType resourceGenerate,
            ResourceType resourceRequired, int buildingCost,
            int buildTime, int townHallLevelRequired) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
        this.productivity = productivity;
        this.baseCapacity = baseCapacity;
        this.resourceGenerate = resourceGenerate;
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

    public int getProductivity() {
        return productivity;
    }

    public void setProductivity(int productivity) {
        this.productivity = productivity;
    }

    public int getBaseCapacity() {
        return baseCapacity;
    }

    public void setBaseCapacity(int baseCapacity) {
        this.baseCapacity = baseCapacity;
    }

    public ResourceType getResourceGenerate() {
        return resourceGenerate;
    }

    public void setResourceGenerate(ResourceType resourceGenerate) {
        this.resourceGenerate = resourceGenerate;
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
        return "ResourceGeneratorData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", productivity=" + productivity +
                ", baseCapacity=" + baseCapacity +
                ", resourceGenerate=" + resourceGenerate +
                ", resourceRequired=" + resourceRequired +
                ", buildingCost=" + buildingCost +
                ", buildTime=" + buildTime +
                ", townHallLevelRequired=" + townHallLevelRequired +
                '}';
    }
}