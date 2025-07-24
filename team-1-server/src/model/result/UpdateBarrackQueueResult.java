package model.result;

import config.data.ResourceType;
import model.enums.TroopTrainingSlot;

import java.util.List;

/**
 * Result model for upgrade building operations
 * Encapsulates the outcome of building movement requests
 */
public class UpdateBarrackQueueResult {
    private boolean success;
    private String message;
    private int buildingIndex;
    private String buildingType;
    private long startTime;
    private List<TroopTrainingSlot> trainingQueue;

    /**
     * Constructor for upgrade building result
     *
     * @param success        Whether the upgrade operation was successful
     * @param message        Result message describing the outcome
     * @param buildingIndex  The index of the building that was upgraded
     * @param buildingType The type ID of the building that was upgraded
     */
    private UpdateBarrackQueueResult(boolean success, String message, String buildingType, int buildingIndex,
                                    long startTime, List<TroopTrainingSlot> trainingQueue) {
        this.success = success;
        this.message = message;
        this.buildingType = buildingType;
        this.buildingIndex = buildingIndex;
        this.startTime = startTime;
        this.trainingQueue = trainingQueue;
    }

    // Static helper methods for common result types
    public static UpdateBarrackQueueResult success(String buildingType, int buildingIndex,
                                             long startTime, List<TroopTrainingSlot> trainingQueue) {
        return new UpdateBarrackQueueResult(true, "Update queue successfully",
                buildingType, buildingIndex, startTime, trainingQueue);
    }

    /**
     * Creates a validation failure result
     *
     * @param message Error message
     * @return UpgradeBuildingResult with validation failure status
     */
    public static UpdateBarrackQueueResult validationFailure(String message) {
        return new UpdateBarrackQueueResult(false, message, "", 0, 0L, null);
    }

    /**
     * Creates a service failure result
     * @return UpgradeBuildingResult with service failure status
     */
    public static UpdateBarrackQueueResult serviceInvalid() {
        return new UpdateBarrackQueueResult(false, "Service error occurred ", "", 0, 0L, null);
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

    public long getStartTime() {
        return startTime;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public List<TroopTrainingSlot> getTrainingQueue() {
        return trainingQueue;
    }

    @Override
    public String toString() {
        return "UpgradeBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", buildingTypeId=" + buildingType +
                ", upgradeTime=" + startTime +
                '}';
    }
}
