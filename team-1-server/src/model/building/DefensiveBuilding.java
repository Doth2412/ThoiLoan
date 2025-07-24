package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;

/**
 * Defensive building for base protection
 */
public class DefensiveBuilding extends Building {

    // Default constructor for Gson
    public DefensiveBuilding() {
        super();
    }

    public DefensiveBuilding(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState) {
        super(buildingIndex, buildingID, level, position, buildingState);
    }

    @Override
    public String toString() {
        return "DefensiveBuilding{" + super.toString() + '}';
    }
}
