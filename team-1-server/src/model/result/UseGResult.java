package model.result;

import config.data.ResourceType;

/**
 * Represents the result of a resource harvesting operation.
 * Used to communicate success/failure and resource details between service and
 * handler.
 */
public class UseGResult {
    private final boolean success;
    private final String message;
    private final int usedAmount;
    private final ResourceType resourceType;

    private UseGResult(boolean success, String message, int usedAmount, ResourceType resourceType) {
        this.success = success;
        this.message = message;
        this.usedAmount = usedAmount;
        this.resourceType = resourceType;
    }

    public static UseGResult success(int usedAmount, ResourceType resourceType) {
        return new UseGResult(true, "Resource harvested successfully", usedAmount, resourceType);
    }

    public static UseGResult validationFailure(String message) {
        return new UseGResult(false, message, 0, ResourceType.NONE);
    }

    public static UseGResult serviceInvalid() {
        return new UseGResult(false, "Service error occurred", 0, ResourceType.NONE);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getUsedAmount() {
        return usedAmount;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

}
