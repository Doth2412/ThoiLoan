package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;

/**
 * Building that stores resources
 */
public class ResourceStorage extends Building {
    private int currentAmount;

    // Default constructor for Gson
    public ResourceStorage() {
        super();
    }

    public ResourceStorage(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState, int currentAmount) {
        super(buildingIndex, buildingID, level, position, buildingState);
        this.currentAmount = currentAmount;
    }

    // Getters and Setters
    public int getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(int currentAmount) {
        this.currentAmount = currentAmount;
    }

    @Override
    public String toString() {
        return "ResourceStorage{" +
                "currentAmount=" + currentAmount +
                ", " + super.toString() +
                '}';
    }
}
