package model.result;

import model.enums.TroopTrainingSlot;

import java.util.List;

/**
 * Result model for upgrade building operations
 * Encapsulates the outcome of building movement requests
 */
public class UpdatePlayerArmyResult {
    private boolean success;
    private String message;
    private List<TroopTrainingSlot> playerArmy;

    /**
     * Constructor for upgrade building result
     *
     * @param success        Whether the upgrade operation was successful
     * @param message        Result message describing the outcome
     */
    private UpdatePlayerArmyResult(boolean success, String message, List<TroopTrainingSlot> playerArmy) {
        this.success = success;
        this.message = message;
        this.playerArmy = playerArmy;
    }

    // Static helper methods for common result types
    public static UpdatePlayerArmyResult success(List<TroopTrainingSlot> playerArmy) {
        return new UpdatePlayerArmyResult(true, "Update player army successfully", playerArmy);
    }

    /**
     * Creates a validation failure result
     *
     * @param message Error message
     * @return UpgradeBuildingResult with validation failure status
     */
    public static UpdatePlayerArmyResult validationFailure(String message) {
        return new UpdatePlayerArmyResult(false, message, null);
    }

    /**
     * Creates a service failure result
     * @return UpgradeBuildingResult with service failure status
     */
    public static UpdatePlayerArmyResult serviceInvalid() {
        return new UpdatePlayerArmyResult(false, "Service error occurred ", null);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }


    public List<TroopTrainingSlot> getPlayerArmy() {
        return playerArmy;
    }

    @Override
    public String toString() {
        return "UpgradeBuildingResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", playerArmy=" + playerArmy +
                '}';
    }
}
