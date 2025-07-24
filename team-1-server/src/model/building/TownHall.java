package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;

/**
 * Town Hall building that extends ResourceStorage
 * Central building of the player's base
 */
public class TownHall extends ResourceStorage {

    // Default constructor for Gson
    public TownHall() {
        super();
    }

    public TownHall(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState, int currentAmount) {
        super(buildingIndex, buildingID, level, position, buildingState, currentAmount);
    }

    @Override
    public String toString() {
        return "TownHall{" + super.toString() + '}';
    }
}
