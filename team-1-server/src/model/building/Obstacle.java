package model.building;

import model.util.Position;

/**
 * Represents an obstacle in the player's village
 * Obstacles are persistent map objects that players can remove by spending
 * resources
 */
public class Obstacle {
    private int obstacleIndex;
    private String obstacleID;
    private String type; // e.g., "OBS_1", "OBS_2", etc.
    private Position position;
    private boolean isRemoved; // Track if obstacle has been cleared by player

    // Type field for Gson polymorphism
    private String objectType;

    // Default constructor for Gson
    public Obstacle() {
        setObjectType();
    }

    public Obstacle(int obstacleIndex, String obstacleID, String type, Position position, boolean isRemoved) {
        this.obstacleIndex = obstacleIndex;
        this.obstacleID = obstacleID;
        this.type = type;
        this.position = position;
        this.isRemoved = isRemoved;
        setObjectType();
    }

    // Set the type field for Gson serialization
    private void setObjectType() {
        this.objectType = this.getClass().getSimpleName();
    }

    // Getters and Setters
    public int getObstacleIndex() {
        return obstacleIndex;
    }

    public void setObstacleIndex(int obstacleIndex) {
        this.obstacleIndex = obstacleIndex;
    }

    public String getObstacleID() {
        return obstacleID;
    }

    public void setObstacleID(String obstacleID) {
        this.obstacleID = obstacleID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public boolean isRemoved() {
        return isRemoved;
    }

    public void setRemoved(boolean removed) {
        isRemoved = removed;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }

    @Override
    public String toString() {
        return "Obstacle{" +
                "obstacleIndex=" + obstacleIndex +
                ", obstacleID='" + obstacleID + '\'' +
                ", type='" + type + '\'' +
                ", position=" + position +
                ", isRemoved=" + isRemoved +
                ", objectType='" + objectType + '\'' +
                '}';
    }
}
