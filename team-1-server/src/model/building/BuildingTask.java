package model.building;

import model.enums.BuildingTaskType;

/**
 * Represents a building task (construction, upgrade, repair, etc.)
 * Used by BuilderHut to track current tasks
 */
public class BuildingTask {
    private String targetBuildingId; // Or int targetBuildingIndex
    private BuildingTaskType taskType;
    private long startTime; // Epoch milliseconds
    private long endTime; // Epoch milliseconds

    // Default constructor for Gson
    public BuildingTask() {
    }

    public BuildingTask(String targetBuildingId, BuildingTaskType taskType, long startTime, long endTime) {
        this.targetBuildingId = targetBuildingId;
        this.taskType = taskType;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public String getTargetBuildingId() {
        return targetBuildingId;
    }

    public void setTargetBuildingId(String targetBuildingId) {
        this.targetBuildingId = targetBuildingId;
    }

    public BuildingTaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(BuildingTaskType taskType) {
        this.taskType = taskType;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    @Override
    public String toString() {
        return "BuildingTask{" +
                "targetBuildingId='" + targetBuildingId + '\'' +
                ", taskType=" + taskType +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
