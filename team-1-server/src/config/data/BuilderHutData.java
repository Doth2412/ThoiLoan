package config.data;

/**
 * POJO for builder hut data configuration
 */
public class BuilderHutData {
    private int baseHitPoints;
    private Size size;
    private ResourceType resourceRequired;
    private int buildingCost;

    /**
     * Default constructor
     */
    public BuilderHutData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.resourceRequired = ResourceType.NONE;
        this.buildingCost = 0;
    }

    /**
     * Constructor with all fields
     */
    public BuilderHutData(int baseHitPoints, Size size, ResourceType resourceRequired, int buildingCost) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
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
        return "BuilderHutData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", resourceRequired=" + resourceRequired +
                ", buildingCost=" + buildingCost +
                '}';
    }
}