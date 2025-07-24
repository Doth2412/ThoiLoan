package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;
import model.enums.ResourceGeneratorStatus;
import config.data.ResourceType;

/**
 * Building that generates resources over time
 */
public class ResourceGenerator extends Building {
    private int currentAmount;
    private boolean isHarvestable;
    private ResourceGeneratorStatus generatorState;
    private long lastCollectionTime;
    private double productionRate;
    private double capacity;
    private ResourceType resourceType;

    public ResourceGenerator() {
        super();
        this.lastCollectionTime = System.currentTimeMillis();
    }

    public ResourceGenerator(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState, int currentAmount,
            boolean isHarvestable, ResourceGeneratorStatus generatorState,
            double productionRate, double capacity, ResourceType resourceType) {
        super(buildingIndex, buildingID, level, position, buildingState);
        this.currentAmount = currentAmount;
        this.isHarvestable = isHarvestable;
        this.generatorState = generatorState;
        this.productionRate = productionRate;
        this.capacity = capacity;
        this.resourceType = resourceType;
        this.lastCollectionTime = System.currentTimeMillis();
    }

    // Getters and Setters
    public int getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(int currentAmount) {
        this.currentAmount = currentAmount;
    }

    public boolean isHarvestable() {
        return isHarvestable;
    }

    public void setHarvestable(boolean harvestable) {
        isHarvestable = harvestable;
    }

    public ResourceGeneratorStatus getGeneratorState() {
        return generatorState;
    }

    public void setGeneratorState(ResourceGeneratorStatus generatorState) {
        this.generatorState = generatorState;
    }

    public long getLastCollectionTime() {
        return lastCollectionTime;
    }

    public void setLastCollectionTime(long lastCollectionTime) {
        this.lastCollectionTime = lastCollectionTime;
    }

    public double getProductionRate() {
        return productionRate;
    }

    public void setProductionRate(double productionRate) {
        this.productionRate = productionRate;
    }

    public double getCapacity() {
        return capacity;
    }

    public void setCapacity(double capacity) {
        this.capacity = capacity;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    @Override
    public String toString() {
        return "ResourceGenerator{" +
                "currentAmount=" + currentAmount +
                ", isHarvestable=" + isHarvestable +
                ", generatorState=" + generatorState +
                ", lastCollectionTime=" + lastCollectionTime +
                ", productionRate=" + productionRate +
                ", capacity=" + capacity +
                ", resourceType='" + resourceType + '\'' +
                ", " + super.toString() +
                '}';
    }
}
