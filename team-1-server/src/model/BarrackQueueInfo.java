package model;

// You can create this as a new file or as a nested class
// A simple "Plain Old Java Object" (POJO) to hold the data
public class BarrackQueueInfo {
    public int buildingIndex;
    public long startTime;
    public java.util.List<model.enums.TroopTrainingSlot> trainingQueue;

    public BarrackQueueInfo(int buildingIndex, long startTime, java.util.List<model.enums.TroopTrainingSlot> trainingQueue) {
        this.buildingIndex = buildingIndex;
        this.startTime = startTime;
        this.trainingQueue = trainingQueue;
    }
}