package model;

/**
 * Represents a request to build troops in a barrack
 */
public class TroopBuildRequest {
    private String troopID;
    private int quantity;

    // Default constructor for Gson
    public TroopBuildRequest() {
    }

    public TroopBuildRequest(String troopID, int quantity) {
        this.troopID = troopID;
        this.quantity = quantity;
    }

    // Getters and Setters
    public String getTroopID() {
        return troopID;
    }

    public void setTroopID(String troopID) {
        this.troopID = troopID;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "TroopBuildRequest{" +
                "troopID='" + troopID + '\'' +
                ", quantity=" + quantity +
                '}';
    }
}
