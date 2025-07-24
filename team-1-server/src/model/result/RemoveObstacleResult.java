package model.result;

/**
 * Result model for cancel building operations
 * Encapsulates the outcome of building cancellation requests
 */
public class RemoveObstacleResult {
    private boolean success;
    private String message;
    private String obstacleType; // Type of building that was cancelled
    private int obstacleIndex; // Index of the building that was cancelled
    private int usedGold; // Amount of gold refunded to the player
    private int usedOil; // Amount of oil refunded to the player
    private long removeStartTime;

    /**
     * Constructor for cancel building result
     *
     * @param success        Whether the cancellation operation was successful
     * @param message        Result message describing the outcome
     */
    public RemoveObstacleResult(boolean success, String message, String obstacleType,
                                int obstacleIndex, int usedGold, int usedOil, long removeStartTime) {
        this.success = success;
        this.message = message != null ? message : "";
        this.obstacleType = obstacleType;
        this.obstacleIndex = obstacleIndex;
        this.usedGold = usedGold;
        this.usedOil = usedOil;
        this.removeStartTime = removeStartTime;
    }

    /**
     * Convenience constructor for failed operations
     *
     * @param message Error message describing the failure
     */
    public RemoveObstacleResult(String message) {
        this(false, message, null, -1, 0, 0, 0L);
    }

    // Static factory methods for common results
    public static RemoveObstacleResult success(String obstacleType,
                                               int obstacleIndex, int usedGold, int usedOil, long removeStartTime) {
        return new RemoveObstacleResult(true, "SUCCESS", obstacleType,
                obstacleIndex, usedGold, usedOil, removeStartTime);
    }

    public static RemoveObstacleResult obstacleNotFound(int obstacleIndex) {
        return new RemoveObstacleResult("Obstalce with index " + obstacleIndex + " not found");
    }

    public static RemoveObstacleResult serviceFailure(String message) {
        return new RemoveObstacleResult("Service error: " + message);
    }

    public static RemoveObstacleResult insufficientResources(String obstacleType, int obstacleIndex) {
        return new RemoveObstacleResult("Insufficient resources to remove " + obstacleType + " with index " + obstacleIndex);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getObstacleType() {
        return obstacleType;
    }
    public int getObstacleIndex() {
        return obstacleIndex;
    }
    public int getUsedGold() {
        return usedGold;
    }
    public int getUsedOil() {
        return usedOil;
    }
    public long getRemoveStartTime() {
        return removeStartTime;
    }


    @Override
    public String toString() {
        return "CancelBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", obstacleType='" + obstacleType + '\'' +
                ", obstacleIndex=" + obstacleIndex +
                ", usedGold=" + usedGold +
                ", usedOil=" + usedOil +
                ", removeStartTime=" + removeStartTime;
    };
}
