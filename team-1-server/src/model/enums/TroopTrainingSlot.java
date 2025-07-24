package model.enums;

/**
 * Represents a single stack of troops in the training queue.
 * This class is designed to be easily serialized to/from JSON and matches the
 * client-side JavaScript object structure { troopType: "...", troopAmount: ... }.
 */
public class TroopTrainingSlot {
    private String troopType;
    private int troopAmount;

    // Default constructor for serialization frameworks like Gson/Jackson
    public TroopTrainingSlot() {
    }

    public TroopTrainingSlot(String troopType, int troopAmount) {
        this.troopType = troopType;
        this.troopAmount = troopAmount;
    }

    // Getters
    public String getTroopType() {
        return troopType;
    }

    public int getTroopAmount() {
        return troopAmount;
    }

    // Setters
    public void setTroopType(String troopType) {
        this.troopType = troopType;
    }

    public void setTroopAmount(int troopAmount) {
        this.troopAmount = troopAmount;
    }

    @Override
    public String toString() {
        return "TroopTrainingSlot{" +
                "troopType='" + troopType + '\'' +
                ", troopAmount=" + troopAmount +
                '}';
    }
}
