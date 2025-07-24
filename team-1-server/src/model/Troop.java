package model;

/**
 * Represents a troop unit with training information
 */
public class Troop {
    private int troopIndex;
    private String troopID;
    private long troopTrainingStartTime; // Epoch milliseconds
    private long troopTrainingEndTime; // Epoch milliseconds

    // Default constructor for Gson
    public Troop() {
    }

    public Troop(int troopIndex, String troopID, long troopTrainingStartTime, long troopTrainingEndTime) {
        this.troopIndex = troopIndex;
        this.troopID = troopID;
        this.troopTrainingStartTime = troopTrainingStartTime;
        this.troopTrainingEndTime = troopTrainingEndTime;
    }

    // Getters and Setters
    public int getTroopIndex() {
        return troopIndex;
    }

    public void setTroopIndex(int troopIndex) {
        this.troopIndex = troopIndex;
    }

    public String getTroopID() {
        return troopID;
    }

    public void setTroopID(String troopID) {
        this.troopID = troopID;
    }

    public long getTroopTrainingStartTime() {
        return troopTrainingStartTime;
    }

    public void setTroopTrainingStartTime(long troopTrainingStartTime) {
        this.troopTrainingStartTime = troopTrainingStartTime;
    }

    public long getTroopTrainingEndTime() {
        return troopTrainingEndTime;
    }

    public void setTroopTrainingEndTime(long troopTrainingEndTime) {
        this.troopTrainingEndTime = troopTrainingEndTime;
    }

    @Override
    public String toString() {
        return "Troop{" +
                "troopIndex=" + troopIndex +
                ", troopID='" + troopID + '\'' +
                ", troopTrainingStartTime=" + troopTrainingStartTime +
                ", troopTrainingEndTime=" + troopTrainingEndTime +
                '}';
    }
}
