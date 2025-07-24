package model.result;

public class UpgradeBuildingCompleteResult {
    private boolean success;
    private String message;
    private int buildingIndex;
    private long upgradeTime;
    private String buildingTypeId;

    public UpgradeBuildingCompleteResult(boolean success, String message, int buildingIndex, String buildingTypeId) {
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingIndex = buildingIndex;
        this.buildingTypeId = buildingTypeId;
        this.upgradeTime = System.currentTimeMillis();
    }

    public UpgradeBuildingCompleteResult(String message) {
        this(false, message, -1, "");
    }

    public static UpgradeBuildingCompleteResult success(String buildingTypeId, int buildingIndex) {
        return new UpgradeBuildingCompleteResult(true, "Building upgrade completed successfully", buildingIndex,
                buildingTypeId);
    }

    public static UpgradeBuildingCompleteResult failure(String message) {
        return new UpgradeBuildingCompleteResult(false, message, -1, "");
    }

    public static UpgradeBuildingCompleteResult serviceFailure(String message) {
        return new UpgradeBuildingCompleteResult(false, message, -1, "");
    }

    public static UpgradeBuildingCompleteResult validationFailure(String message) {
        return new UpgradeBuildingCompleteResult(false, message, -1, "");
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public long getUpgradeTime() {
        return upgradeTime;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }
}
