package model.result;

/**
 * Result model for upgrade building operations
 * Encapsulates the outcome of building movement requests
 */
public class UpgradeBuildingResult {
    private boolean success;
    private String message;
    private int buildingIndex;
    private long upgradeTime;
    private String buildingTypeId;

    /**
     * Constructor for upgrade building result
     * 
     * @param success        Whether the upgrade operation was successful
     * @param message        Result message describing the outcome
     * @param buildingIndex  The index of the building that was upgraded
     * @param buildingTypeId The type ID of the building that was upgraded
     */
    public UpgradeBuildingResult(boolean success, String message, int buildingIndex, String buildingTypeId) {
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingIndex = buildingIndex;
        this.buildingTypeId = buildingTypeId;
        this.upgradeTime = System.currentTimeMillis();
    }

    /**
     * Convenience constructor for failed operations
     * 
     * @param message Error message describing the failure
     */
    public UpgradeBuildingResult(String message) {
        this(false, message, -1, "");
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

    public long getupgradeTime() {
        return upgradeTime;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    // Static helper methods for common result types

    /**
     * Creates a successful upgrade result
     * 
     * @param buildingTypeId The type ID of the building that was upgraded
     * @param buildingIndex  The index of the building that was upgraded
     * @return UpgradeBuildingResult with success status
     */
    public static UpgradeBuildingResult success(String buildingTypeId, int buildingIndex) {
        return new UpgradeBuildingResult(true, "SUCCESS", buildingIndex, buildingTypeId);
    }

    /**
     * Creates a validation failure result
     * 
     * @param message Error message
     * @return UpgradeBuildingResult with validation failure status
     */
    public static UpgradeBuildingResult validationFailure(String message) {
        return new UpgradeBuildingResult("VALIDATION_FAILED: " + message);
    }

    /**
     * Creates a service failure result
     * 
     * @param message Error message
     * @return UpgradeBuildingResult with service failure status
     */
    public static UpgradeBuildingResult serviceFailure(String message) {
        return new UpgradeBuildingResult("SERVICE_FAILED: " + message);
    }

    @Override
    public String toString() {
        return "UpgradeBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", buildingTypeId=" + buildingTypeId +
                ", upgradeTime=" + upgradeTime +
                '}';
    }
}
