package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;
import model.Troop;
import java.util.List;
import java.util.ArrayList;

/**
 * Army Camp building that manages troops
 */
public class ClanCastle extends Building {
    private List<Troop> managingTroop;

    // Default constructor for Gson
    public ClanCastle() {
        super();
    }

    public ClanCastle(int buildingIndex, String buildingID, int level, Position position,
                    BuildingOperationalState buildingState) {
        super(buildingIndex, buildingID, level, position, buildingState);
    }

    @Override
    public String toString() {
        return "ClanCastle{" +
                ", " + super.toString() +
                '}';
    }
}
