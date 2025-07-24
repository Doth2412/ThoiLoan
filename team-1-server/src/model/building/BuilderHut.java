package model.building;

import model.util.Position;
import model.enums.BuildingOperationalState;

/**
 * Builder Hut building that manages construction tasks
 */
public class BuilderHut extends Building {
    private boolean isAvailable;
    private BuildingTask currentTask;

    // Default constructor for Gson
    public BuilderHut() {
        super();
    }

    public BuilderHut(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState, boolean isAvailable,
            BuildingTask currentTask) {
        super(buildingIndex, buildingID, level, position, buildingState);
        this.isAvailable = isAvailable;
        this.currentTask = currentTask;
    }

    // Getters and Setters
    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public BuildingTask getCurrentTask() {
        return currentTask;
    }

    public void setCurrentTask(BuildingTask currentTask) {
        this.currentTask = currentTask;
    }

    @Override
    public String toString() {
        return "BuilderHut{" +
                "isAvailable=" + isAvailable +
                ", currentTask=" + currentTask +
                ", " + super.toString() +
                '}';
    }
}
