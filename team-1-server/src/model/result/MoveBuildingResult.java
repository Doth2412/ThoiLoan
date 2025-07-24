package model.result;

/**
 * Result model for move building operations
 * Encapsulates the outcome of building movement requests
 */
public class MoveBuildingResult {
    private boolean success;
    private String message;
    private int buildingIndex;
    private int oldPositionX;
    private int oldPositionY;
    private int newPositionX;
    private int newPositionY;
    private long moveTime;

    /**
     * Constructor for move building result
     * 
     * @param success       Whether the move operation was successful
     * @param message       Result message describing the outcome
     * @param buildingIndex The index of the building that was moved
     * @param oldPositionX  The old X coordinate of the building
     * @param oldPositionY  The old Y coordinate of the building
     * @param newPositionX  The new X coordinate of the building
     * @param newPositionY  The new Y coordinate of the building
     */
    public MoveBuildingResult(boolean success, String message, int buildingIndex,
            int oldPositionX, int oldPositionY, int newPositionX, int newPositionY) {
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingIndex = buildingIndex;
        this.oldPositionX = oldPositionX;
        this.oldPositionY = oldPositionY;
        this.newPositionX = newPositionX;
        this.newPositionY = newPositionY;
        this.moveTime = System.currentTimeMillis();
    }

    /**
     * Convenience constructor for failed operations
     * 
     * @param message Error message describing the failure
     */
    public MoveBuildingResult(String message) {
        this(false, message, -1, -1, -1, -1, -1);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public int getOldPositionX() {
        return oldPositionX;
    }

    public int getOldPositionY() {
        return oldPositionY;
    }

    public int getNewPositionX() {
        return newPositionX;
    }

    public int getNewPositionY() {
        return newPositionY;
    }

    public long getMoveTime() {
        return moveTime;
    }

    // Static helper methods for common result types

    /**
     * Creates a successful move result
     * 
     * @param buildingIndex The index of the building that was moved
     * @param oldPositionX  The old X coordinate
     * @param oldPositionY  The old Y coordinate
     * @param newPositionX  The new X coordinate
     * @param newPositionY  The new Y coordinate
     * @return MoveBuildingResult with success status
     */
    public static MoveBuildingResult success(int buildingIndex, int oldPositionX, int oldPositionY,
            int newPositionX, int newPositionY) {
        return new MoveBuildingResult(true, "SUCCESS", buildingIndex,
                oldPositionX, oldPositionY, newPositionX, newPositionY);
    }

    /**
     * Creates a validation failure result
     * 
     * @param message Error message
     * @return MoveBuildingResult with validation failure status
     */
    public static MoveBuildingResult validationFailure(String message) {
        return new MoveBuildingResult("VALIDATION_FAILED: " + message);
    }

    /**
     * Creates a service failure result
     * 
     * @param message Error message
     * @return MoveBuildingResult with service failure status
     */
    public static MoveBuildingResult serviceFailure(String message) {
        return new MoveBuildingResult("SERVICE_FAILED: " + message);
    }

    @Override
    public String toString() {
        return "MoveBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", oldPosition=(" + oldPositionX + "," + oldPositionY + ")" +
                ", newPosition=(" + newPositionX + "," + newPositionY + ")" +
                ", moveTime=" + moveTime +
                '}';
    }
}
