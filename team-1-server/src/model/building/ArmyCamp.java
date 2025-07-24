package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;
import model.Troop;
import java.util.List;
import java.util.ArrayList;

/**
 * Army Camp building that manages troops
 */
public class ArmyCamp extends Building {
    private List<Troop> managingTroop;

    // Default constructor for Gson
    public ArmyCamp() {
        super();
        this.managingTroop = new ArrayList<>();
    }

    public ArmyCamp(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState, List<Troop> managingTroop) {
        super(buildingIndex, buildingID, level, position, buildingState);
        this.managingTroop = managingTroop != null ? managingTroop : new ArrayList<>();
    }

    // Getters and Setters
    public List<Troop> getManagingTroop() {
        return managingTroop;
    }

    public void setManagingTroop(List<Troop> managingTroop) {
        this.managingTroop = managingTroop != null ? managingTroop : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "ArmyCamp{" +
                "managingTroop=" + managingTroop +
                ", " + super.toString() +
                '}';
    }
}
