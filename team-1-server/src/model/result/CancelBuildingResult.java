package model.result;

/**
 * Result model for cancel building operations
 * Encapsulates the outcome of building cancellation requests
 */
public class CancelBuildingResult {
    private boolean success;
    private String message;
    private String buildingTypeId; // Type of building that was cancelled
    private int buildingIndex; // Index of the building that was cancelled
    private int refundedGold; // Amount of gold refunded to the player
    private int refundedOil; // Amount of oil refunded to the player
    private long cancellationTime;

    /**
     * Constructor for cancel building result
     * 
     * @param success        Whether the cancellation operation was successful
     * @param message        Result message describing the outcome
     * @param buildingTypeId The type of building that was cancelled
     * @param buildingIndex  The index of the building that was cancelled
     * @param refundedGold   The amount of gold refunded to the player
     * @param refundedOil    The amount of oil refunded to the player
     */
    public CancelBuildingResult(boolean success, String message,
            int buildingIndex, int refundedGold, int refundedOil) {
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingIndex = buildingIndex;
        this.refundedGold = refundedGold;
        this.refundedOil = refundedOil;
        this.cancellationTime = System.currentTimeMillis();
    }

    /**
     * Convenience constructor for failed operations
     * 
     * @param message Error message describing the failure
     */
    public CancelBuildingResult(String message) {
        this(false, message, -1, 0, 0);
    }

    // Static factory methods for common results
    public static CancelBuildingResult success(int buildingIndex,
            int refundedGold, int refundedOil) {
        return new CancelBuildingResult(true, "SUCCESS", buildingIndex,
                refundedGold, refundedOil);
    }

    public static CancelBuildingResult buildingNotFound(int buildingIndex) {
        return new CancelBuildingResult("Building with index " + buildingIndex + " not found");
    }

    public static CancelBuildingResult buildingNotUnderConstruction(String buildingTypeId) {
        return new CancelBuildingResult("Building " + buildingTypeId + " is not under construction");
    }

    public static CancelBuildingResult builderNotFound(int buildingIndex) {
        return new CancelBuildingResult("Builder working on building " + buildingIndex + " not found");
    }

    public static CancelBuildingResult serviceFailure(String message) {
        return new CancelBuildingResult("Service error: " + message);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public int getRefundedGold() {
        return refundedGold;
    }

    public int getRefundedOil() {
        return refundedOil;
    }

    public long getCancellationTime() {
        return cancellationTime;
    }

    @Override
    public String toString() {
        return "CancelBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingTypeId='" + buildingTypeId + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", refundedGold=" + refundedGold +
                ", refundedOil=" + refundedOil +
                ", cancellationTime=" + cancellationTime +
                '}';
    }
}
