package model.result;

/**
 * Result model for buy building operations
 * Encapsulates the outcome of building purchase requests
 */
public class BuyBuildingResult {
    private boolean success;
    private String message;
    private String buildingId; // Unique ID assigned to the new building
    private String buildingTypeId; // Type of building that was purchased
    private int positionX;
    private int positionY;
    private long purchaseTime;

    /**
     * Constructor for buy building result
     * 
     * @param success        Whether the purchase operation was successful
     * @param message        Result message describing the outcome
     * @param buildingId     The unique ID assigned to the new building
     * @param buildingTypeId The type of building that was purchased
     * @param positionX      The X coordinate where the building was placed
     * @param positionY      The Y coordinate where the building was placed
     */
    public BuyBuildingResult(boolean success, String message, String buildingId,
            String buildingTypeId, int positionX, int positionY) {
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingId = buildingId != null ? buildingId : "";
        this.buildingTypeId = buildingTypeId != null ? buildingTypeId : "";
        this.positionX = positionX;
        this.positionY = positionY;
        this.purchaseTime = System.currentTimeMillis();
    }

    /**
     * Convenience constructor for failed operations
     * 
     * @param message Error message describing the failure
     */
    public BuyBuildingResult(String message) {
        this(false, message, "", "", -1, -1);
    }

    // Static factory methods for common results
    public static BuyBuildingResult success(String buildingId, String buildingTypeId,
            int positionX, int positionY) {
        return new BuyBuildingResult(true, "SUCCESS", buildingId, buildingTypeId,
                positionX, positionY);
    }

    public static BuyBuildingResult insufficientResources(String buildingTypeId) {
        return new BuyBuildingResult("Insufficient resources to purchase " + buildingTypeId);
    }

    public static BuyBuildingResult invalidPosition() {
        return new BuyBuildingResult("Invalid building position");
    }

    public static BuyBuildingResult serviceFailure(String message) {
        return new BuyBuildingResult("Service error: " + message);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getPositionX() {
        return positionX;
    }

    public int getPositionY() {
        return positionY;
    }

    public long getPurchaseTime() {
        return purchaseTime;
    }

    @Override
    public String toString() {
        return "BuyBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingId='" + buildingId + '\'' +
                ", buildingTypeId='" + buildingTypeId + '\'' +
                ", position=(" + positionX + "," + positionY + ")" +
                ", purchaseTime=" + purchaseTime +
                '}';
    }
}
