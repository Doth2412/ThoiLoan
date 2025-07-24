package model.result;

/**
 * Result model for cancel building operations
 * Encapsulates the outcome of building cancellation requests
 */
public class RemoveObstacleCompleteResult {
    private boolean success;
    private String message;
    private String obstacleType; // Type of building that was cancelled
    private int obstacleIndex; // Index of the building that was cancelled

    /**
     * Constructor for cancel building result
     *
     * @param success        Whether the cancellation operation was successful
     * @param message        Result message describing the outcome
     */
    public RemoveObstacleCompleteResult(boolean success, String message, String obstacleType,
                                        int obstacleIndex) {
        this.success = success;
        this.message = message != null ? message : "";
        this.obstacleType = obstacleType;
        this.obstacleIndex = obstacleIndex;
    }

    /**
     * Convenience constructor for failed operations
     *
     * @param message Error message describing the failure
     */
    public RemoveObstacleCompleteResult(String message) {
        this(false, message, null, -1);
    }

    // Static factory methods for common results
    public static RemoveObstacleCompleteResult success(String obstacleType,
                                                       int obstacleIndex) {
        return new RemoveObstacleCompleteResult(true, "SUCCESS", obstacleType,
                obstacleIndex);
    }

    public static RemoveObstacleCompleteResult obstacleNotFound(int obstacleIndex) {
        return new RemoveObstacleCompleteResult("Obstalce with index " + obstacleIndex + " not found");
    }

    public static RemoveObstacleCompleteResult serviceFailure(String message) {
        return new RemoveObstacleCompleteResult("Service error: " + message);
    }

    public static RemoveObstacleCompleteResult insufficientResources(String obstacleType, int obstacleIndex) {
        return new RemoveObstacleCompleteResult("Insufficient resources to remove " + obstacleType + " with index " + obstacleIndex);
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


    @Override
    public String toString() {
        return "CancelBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", obstacleType='" + obstacleType + '\'' +
                ", obstacleIndex=" + obstacleIndex;
    };
}
