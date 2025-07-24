package config.data;

import java.util.HashMap;
import java.util.Map;

/**
 * POJO for town hall data configuration
 */
public class TownHallData {
    private int baseHitPoints;
    private Size size;
    private int baseGoldCapacity;
    private int baseOilCapacity;
    private Map<String, Integer> maxBuilding;
    private ResourceType resourceRequired;
    private int buildTime;
    private int buildingCost;

    /**
     * Default constructor
     */
    public TownHallData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.baseGoldCapacity = 0;
        this.baseOilCapacity = 0;
        this.maxBuilding = new HashMap<>();
        this.resourceRequired = ResourceType.NONE;
        this.buildTime = 0;
        this.buildingCost = 0;
    }

    /**
     * Constructor with all fields
     */
    public TownHallData(int baseHitPoints, Size size, int baseGoldCapacity, int baseOilCapacity,
            Map<String, Integer> maxBuilding, ResourceType resourceRequired,
            int buildTime, int buildingCost) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
        this.baseGoldCapacity = baseGoldCapacity;
        this.baseOilCapacity = baseOilCapacity;
        this.maxBuilding = maxBuilding;
        this.resourceRequired = resourceRequired;
        this.buildTime = buildTime;
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

    public int getBaseGoldCapacity() {
        return baseGoldCapacity;
    }

    public void setBaseGoldCapacity(int baseGoldCapacity) {
        this.baseGoldCapacity = baseGoldCapacity;
    }

    public int getBaseOilCapacity() {
        return baseOilCapacity;
    }

    public void setBaseOilCapacity(int baseOilCapacity) {
        this.baseOilCapacity = baseOilCapacity;
    }

    public Map<String, Integer> getMaxBuilding() {
        return maxBuilding;
    }

    public void setMaxBuilding(Map<String, Integer> maxBuilding) {
        this.maxBuilding = maxBuilding;
    }

    public ResourceType getResourceRequired() {
        return resourceRequired;
    }

    public void setResourceRequired(ResourceType resourceRequired) {
        this.resourceRequired = resourceRequired;
    }

    public int getBuildTime() {
        return buildTime;
    }

    public void setBuildTime(int buildTime) {
        this.buildTime = buildTime;
    }

    public int getBuildingCost() {
        return buildingCost;
    }

    public void setBuildingCost(int buildingCost) {
        this.buildingCost = buildingCost;
    }

    @Override
    public String toString() {
        return "TownHallData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", baseGoldCapacity=" + baseGoldCapacity +
                ", baseOilCapacity=" + baseOilCapacity +
                ", maxBuilding=" + maxBuilding +
                ", resourceRequired=" + resourceRequired +
                ", buildTime=" + buildTime +
                ", buildingCost=" + buildingCost +
                '}';
    }
}