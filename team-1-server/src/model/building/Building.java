package model.building;

import bitzero.server.extensions.ExtensionLogLevel;
import model.util.Position;
import model.enums.BuildingOperationalState;
import util.LoggerUtil;

import java.util.logging.Logger;

/**
 * Abstract base class for all buildings in the game
 * Uses Gson for JSON serialization with type information
 */
public abstract class Building {
    private int buildingIndex;
    private String buildingID;
    private int level;
    private Position position;
    private BuildingOperationalState buildingState;
    private long stateStartingTime;

    // Type field for Gson polymorphism
    private String type;

    // Default constructor for Gson
    public Building() {
        setType();
    }

    public Building(int buildingIndex, String buildingID, int level, Position position,
            BuildingOperationalState buildingState) {
        this.buildingIndex = buildingIndex;
        this.buildingID = buildingID;
        this.level = level;
        this.position = position;
        this.buildingState = buildingState;
        this.stateStartingTime = System.currentTimeMillis();
        setType();
    }

    // Set the type field based on the concrete class
    private void setType() {
        this.type = this.getClass().getSimpleName();
    }

    // Getters and Setters
    public int getBuildingIndex() {
        return buildingIndex;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    public String getBuildingID() {
        return buildingID;
    }

    public void setBuildingID(String buildingID) {
        this.buildingID = buildingID;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public BuildingOperationalState getBuildingState() {
        return buildingState;
    }

    public void setBuildingState(BuildingOperationalState buildingState) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "Setting building state to: " + buildingState);
        this.buildingState = buildingState;
    }

    public long getStateStartingTime() {
        return stateStartingTime;
    }

    public void setStateStartingTime(long stateStartingTime) {
        this.stateStartingTime = stateStartingTime;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Building{" +
                "buildingIndex=" + buildingIndex +
                ", buildingID='" + buildingID + '\'' +
                ", level=" + level +
                ", position=" + position +
                ", buildingState=" + buildingState +
                ", type='" + type + '\'' +
                '}';
    }
}
