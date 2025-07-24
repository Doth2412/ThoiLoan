package model.result;

import config.data.ResourceType;

/**
 * Represents the result of a resource harvesting operation.
 * Used to communicate success/failure and resource details between service and
 * handler.
 */
public class HarvestResourceResult {
    private final boolean success;
    private final String message;
    private final int resourceAmount;
    private final ResourceType resourceType;
    private final long harvestTime;

    private HarvestResourceResult(boolean success, String message, int resourceAmount, ResourceType resourceType,
            long harvestTime) {
        this.success = success;
        this.message = message;
        this.resourceAmount = resourceAmount;
        this.resourceType = resourceType;
        this.harvestTime = harvestTime;
    }

    public static HarvestResourceResult success(int resourceAmount, ResourceType resourceType, long harvestTime) {
        return new HarvestResourceResult(true, "Resource harvested successfully", resourceAmount, resourceType,
                harvestTime);
    }

    public static HarvestResourceResult validationFailure(String message) {
        return new HarvestResourceResult(false, message, 0, ResourceType.NONE, 0);
    }

    public static HarvestResourceResult serviceInvalid() {
        return new HarvestResourceResult(false, "Service error occurred", 0, ResourceType.NONE, 0);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getResourceAmount() {
        return resourceAmount;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public long getHarvestTime() {
        return harvestTime;
    }
}
