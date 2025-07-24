package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import cmd.receive.map.*;
import config.ConfigManager;
import config.data.*;
import model.MapLayout;
import model.Player;
import model.PlayerInfo;
import model.Resources;
import model.building.*;
import model.building.ResourceStorage;
import model.util.Position;
import model.enums.BuildingOperationalState;
import model.enums.ResourceGeneratorStatus;
import model.result.*;
import util.LoggerUtil;
import util.PositionValidator;
import util.server.ServerConstant;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service for handling map-related operations including building completion.
 * Centralizes map business logic that was previously in MapHandler.
 */
public class MapService {

    private static MapService instance;

    private MapService() {
    }

    public static synchronized MapService getInstance() {
        if (instance == null) {
            instance = new MapService();
        }
        return instance;
    }

    /**
     * Processes a build complete request from a client.
     * This method handles all the business logic for completing a building
     * construction.
     * 
     * @param user    The user making the request
     * @param request The build complete request containing building ID and builder
     *                index
     * @return true if the operation was successful, false otherwise
     */
    public boolean processBuildComplete(User user, RequestBuildComplete request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing build complete request for user: {} buildingID: {} builderIndex: {}",
                user.getName(), request.getBuildingID());

        try {
            if (!validateBuildCompleteRequest(user, request)) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Build complete request validation failed for user: {}", user.getName());
                return false;
            }

            // Update the player's state
            if (!updatePlayerState(user, request)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to update player state for user: {}", user.getName());
                return false;
            }
            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist player data for user: {}", user.getName());
                return false;
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "MapService: Build complete request successfully processed for user: {}", user.getName());
            return true;
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception processing build complete request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Handles move building requests from clients.
     * This method orchestrates the complete building movement operation including
     * validation, state updates, and data persistence.
     * 
     * @param user    The user making the request
     * @param request The move building request containing building index and new
     *                position
     * @return MoveBuildingResult containing the operation outcome
     */
    public MoveBuildingResult handleMoveBuilding(User user, RequestMoveBuilding request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing move building request for user: {} buildingIndex: {} newPosition: ({}, {})",
                user.getName(), request.getBuildingIndex(), request.getNewPositionX(), request.getNewPositionY());

        try {
            MoveBuildingResult validationResult = validateMoveBuildingRequest(user, request);
            if (!validationResult.isSuccess()) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Move building request validation failed for user: {} - {}",
                        user.getName(), validationResult.getMessage());
                return validationResult;
            }

            MoveBuildingResult updateResult = updateBuildingPosition(user, request);
            if (!updateResult.isSuccess()) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to update building position for user: {} - {}",
                        user.getName(), updateResult.getMessage());
                return updateResult;
            }

            if (!persistMoveBuildingChanges(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist move building changes for user: {}", user.getName());
                return MoveBuildingResult.serviceFailure("Database persistence failed");
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "MapService: Successfully processed move building request for user: {} buildingIndex: {}",
                    user.getName(), request.getBuildingIndex());

            return updateResult;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception processing move building request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return MoveBuildingResult.serviceFailure("Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Handles buy building requests from clients.
     * This method orchestrates the complete building purchase operation including
     * validation, state updates, and data persistence.
     * 
     * @param user    The user making the request
     * @param request The buy building request containing building type and position
     * @return BuyBuildingResult containing the operation outcome
     */
    public BuyBuildingResult handleBuyBuilding(User user, RequestBuyBuilding request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing buy building request for user: {} buildingType: {} position: ({}, {})",
                user.getName(), request.getBuildingTypeId(), request.getPositionX(), request.getPositionY());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return BuyBuildingResult.serviceFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return BuyBuildingResult.serviceFailure("Player object not found");
            }

            int buildingLevel = 1; //always buy lv1 building
            BuildingConfig buildingConfig = ConfigManager.getInstance().getBuildingConfigs();
            if (!validateBuildingTypeAndCost(player, request.getBuildingTypeId(), buildingConfig, buildingLevel)) {
                return BuyBuildingResult.insufficientResources(request.getBuildingTypeId());
            }

            Size buildingSize = getBuildingSizeFromConfig(request.getBuildingTypeId(), 1);
            if (buildingSize == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Could not get size configuration for building type: {}",
                        request.getBuildingTypeId());
                return BuyBuildingResult.serviceFailure("Invalid building configuration");
            }

            int posX = request.getPositionX();
            int posY = request.getPositionY();

            if (!isPositionWithinMapBounds(posX, posY, buildingSize.getWidth(), buildingSize.getHeight())) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Position ({}, {}) is outside map bounds", posX, posY);
                return BuyBuildingResult.invalidPosition();
            }

            if (isPositionOccupied(player, posX, posY, buildingSize.getWidth(), buildingSize.getHeight(), -1)) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Position ({}, {}) is occupied by another building", posX, posY);
                return BuyBuildingResult.invalidPosition();
            }

            Building newBuilding = createBuilding(player, request.getBuildingTypeId(), posX, posY);
            if (newBuilding == null) {
                return BuyBuildingResult.serviceFailure("Failed to create building");
            }

            if ("BDH_1".equals(request.getBuildingTypeId())) {
                newBuilding.setBuildingState(BuildingOperationalState.OPERATING); //BDH does not need to be constructed
            } else {
                newBuilding.setBuildingState(BuildingOperationalState.CONSTRUCTING);
                if (!assignBuilderToBuilding(player, newBuilding)) {
                    return BuyBuildingResult.serviceFailure("No builders available");
                }
            }

            if (!deductResourcesAndAddBuilding(player, newBuilding, buildingConfig)) {
                return BuyBuildingResult.serviceFailure("Failed to update player state");
            }

            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist changes for user: {}", user.getName());
                return BuyBuildingResult.serviceFailure("Failed to save changes");
            }

            return BuyBuildingResult.success(
                    newBuilding.getBuildingID(),
                    request.getBuildingTypeId(),
                    posX,
                    posY);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception processing buy building request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return BuyBuildingResult.serviceFailure("Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Handles cancel building requests from clients.
     * This method orchestrates the complete building cancellation operation
     * including
     * validation, resource refund calculation, state updates, and data persistence.
     * 
     * @param user    The user making the request
     * @param request The cancel building request containing building type and index
     * @return CancelBuildingResult containing the operation outcome
     */
    public CancelBuildingResult handleCancelBuilding(User user, RequestCancelBuyBuilding request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing cancel building request for user: {} buildingType: {} buildingIndex: {}",
                user.getName(), request.getBuildingIndex());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return CancelBuildingResult.serviceFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return CancelBuildingResult.serviceFailure("Player object not found");
            }

            Building targetBuilding = validateBuildingExistsByIndex(player, request.getBuildingIndex());
            if (targetBuilding == null) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Building with index {} not found for user: {}",
                        request.getBuildingIndex(), user.getName());
                return CancelBuildingResult.buildingNotFound(request.getBuildingIndex());
            }

            if (targetBuilding.getBuildingState() != BuildingOperationalState.CONSTRUCTING) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Building {} is not under construction, current state: {}",
                        targetBuilding.getBuildingID(), targetBuilding.getBuildingState());
                return CancelBuildingResult.buildingNotUnderConstruction(targetBuilding.getBuildingID());
            }

            BuildingConfig buildingConfig = ConfigManager.getInstance().getBuildingConfigs();
            int[] refundAmounts = calculateRefund(targetBuilding.getBuildingID(), buildingConfig);
            int goldRefund = refundAmounts[0];
            int oilRefund = refundAmounts[1];

            if (!freeUpBuilderForBuilding(player, targetBuilding.getBuildingID())) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Could not free up builder for building {}", targetBuilding.getBuildingID());
            }

            if (!removeBuildingAndRefundResources(player, request.getBuildingIndex(), goldRefund, oilRefund)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to remove building and refund resources for user: {}", user.getName());
                return CancelBuildingResult.serviceFailure("Failed to update player state");
            }

            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist changes for user: {}", user.getName());
                return CancelBuildingResult.serviceFailure("Failed to save changes");
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "MapService: Successfully cancelled building {} for user: {}, refunded gold: {}, oil: {}",
                    targetBuilding.getBuildingID(), user.getName(), goldRefund, oilRefund);

            return CancelBuildingResult.success(
                    request.getBuildingIndex(),
                    goldRefund,
                    oilRefund);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception processing cancel building request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return CancelBuildingResult.serviceFailure("Unexpected error: " + e.getMessage());
        }
    }

    public UpgradeBuildingResult handleUpgradeBuilding(User user, RequestUpgradeBuilding request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing upgrade building request for user: {} buildingType: {} buildingIndex: {}",
                user.getName(), request.getBuildingTypeId(), request.getBuildingIndex());

        // Step 1: Get player info and validate request
        PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
        if (playerInfo == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: PlayerInfo not found for user: {}", user.getName());
            return UpgradeBuildingResult.serviceFailure("Player information not found");
        }

        Player player = playerInfo.getPlayer();
        if (player == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player object not found for user: {}", user.getName());
            return UpgradeBuildingResult.serviceFailure("Player object not found");
        }

        Building targetBuilding = validateBuildingExistsByIndex(player, request.getBuildingIndex());
        if (targetBuilding == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Building with index {} not found for user: {}",
                    request.getBuildingIndex(), user.getName());
            return UpgradeBuildingResult.validationFailure(
                    "Building with index " + request.getBuildingIndex() + " not found");
        }

        // Validate building is eligible for upgrade
        if (!validateUpgradeBuilding(player, targetBuilding.getBuildingID(), targetBuilding.getBuildingIndex())) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Building {} is not eligible for upgrade", targetBuilding.getBuildingID());
            return UpgradeBuildingResult.validationFailure(
                    "Building " + targetBuilding.getBuildingID() + " is not eligible for upgrade");
        }
        BuildingConfig config = ConfigManager.getInstance().getBuildingConfigs();

        deductResourcesForUpgrade(player, targetBuilding, config);
        targetBuilding.setBuildingState(BuildingOperationalState.UPGRADING);
        targetBuilding.setStateStartingTime(System.currentTimeMillis());

        if (!persistPlayerData(user)) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Failed to persist changes for user: {}", user.getName());
            return UpgradeBuildingResult.serviceFailure("Failed to save changes");
        }

        return UpgradeBuildingResult.success(targetBuilding.getBuildingID(), targetBuilding.getBuildingIndex());
    }

    public UpgradeBuildingCompleteResult handleUpgradeBuildingComplete(User user,
            RequestUpgradeBuildingComplete request) {
        // Step 1: Get player info and validate request
        PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
        if (playerInfo == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: PlayerInfo not found for user: {}", user.getName());
            return UpgradeBuildingCompleteResult.serviceFailure("Player information not found");
        }

        Player player = playerInfo.getPlayer();
        if (player == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player object not found for user: {}", user.getName());
            return UpgradeBuildingCompleteResult.serviceFailure("Player object not found");
        }

        Building targetBuilding = validateBuildingExistsByIndex(player, request.getBuildingIndex());
        if (targetBuilding == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Building with index {} not found for user: {}",
                    request.getBuildingIndex(), user.getName());
            return UpgradeBuildingCompleteResult.validationFailure(
                    "Building with index " + request.getBuildingIndex() + " not found");
        }
        targetBuilding.setLevel(targetBuilding.getLevel() + 1);
        targetBuilding.setBuildingState(BuildingOperationalState.OPERATING);

        // Update resource caps after building upgrade
        player.updateResourceCaps();

        return UpgradeBuildingCompleteResult.success(targetBuilding.getBuildingID(), targetBuilding.getBuildingIndex());
    }

    /**
     * Validates the build complete request
     * 
     * @param user    The user making the request
     * @param request The build complete request
     * @return true if validation passes, false otherwise
     */
    private boolean validateBuildCompleteRequest(User user, RequestBuildComplete request) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService: Validating build complete request for user: {}", user.getName());

        PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
        if (playerInfo == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: PlayerInfo not found for user: {}", user.getName());
            return false;
        }


        if (request.getBuildingID() == null || request.getBuildingID().trim().isEmpty()) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Invalid building ID for user: {}", user.getName());
            return false;
        }

        if (playerInfo.getPlayer() == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player object not found in PlayerInfo for user: {}", user.getName());
            return false;
        }

        if (!validateBuildingExists(playerInfo.getPlayer(), request.getBuildingID())) {
            return false;
        }

        if (!validateBuildingUnderConstruction(playerInfo.getPlayer(), request.getBuildingID(), request.getBuildingIndex())) {
            return false;
        }

        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Build complete request validation passed for user: {}", user.getName());
        return true;
    }

    public RemoveObstacleResult handleRemoveObstacle(User user, RequestRemoveObstacle request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing remove obstacle request buildingType: " + request.getObstacleType()
                + " with index: " + request.getObstacleIndex());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return RemoveObstacleResult.serviceFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return RemoveObstacleResult.serviceFailure("Player object not found");
            }

            model.Obstacle obstacle = getObstacleByIndex(player, request.getObstacleIndex());
            if (obstacle == null) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Obstacle with index {} not found for user: {}",
                        request.getObstacleIndex(), user.getName());
                return RemoveObstacleResult.obstacleNotFound(request.getObstacleIndex());
            }

            Resources playerResources = player.getResources();
            int usedGold = 0;
            int usedOil = 0;
            Map<String, Map<Integer, ObstacleData>> obstacleDataMap = ConfigManager.getInstance().getBuildingConfigs().getObstacleDataMap();
            ObstacleData data = obstacleDataMap.get(request.getObstacleType()).get(1);
            if (data == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Obstacle data not found for type: {}", request.getObstacleType());
                return RemoveObstacleResult.serviceFailure("Obstacle data not found");
            }
            if (data.getResourceRequired() == ResourceType.GOLD) {
                usedGold = data.getRemoveCost();
                if (playerResources.getGold() < usedGold) {
                    LoggerUtil.log(ExtensionLogLevel.WARN,
                            "MapService: Not enough gold to remove obstacle for user: {}",
                            user.getName());
                    return RemoveObstacleResult.insufficientResources("gold", usedGold);
                }
            } else if (data.getResourceRequired() == ResourceType.OIL) {
                usedOil = data.getRemoveCost();
                if (playerResources.getOil() < usedOil) {
                    LoggerUtil.log(ExtensionLogLevel.WARN,
                            "MapService: Not enough oil to remove obstacle for user: {}",
                            user.getName());
                    return RemoveObstacleResult.insufficientResources("oil", usedOil);
                }
            } else {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Invalid resource type for obstacle removal: {}", data.getResourceRequired());
                return RemoveObstacleResult.serviceFailure("Invalid resource type for obstacle removal");
            }

            obstacle.setRemoveStartTime(System.currentTimeMillis());
            obstacle.setRemoved(true);
            if (usedGold > 0) {
                playerResources.setGold(playerResources.getGold() - usedGold);
            }
            if (usedOil > 0) {
                playerResources.setOil(playerResources.getOil() - usedOil);
            }

            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist changes for user: {}", user.getName());
                return RemoveObstacleResult.serviceFailure("Failed to save changes");
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "MapService: Successfully start remove obstacle with gold: " + usedGold
                            + " or oil: " + usedOil);

            // Return success result with cancellation details
            return RemoveObstacleResult.success(
                    request.getObstacleType(),
                    request.getObstacleIndex(),
                    usedGold,
                    usedOil,
                    System.currentTimeMillis());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception processing cancel building request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return RemoveObstacleResult.serviceFailure("Unexpected error: " + e.getMessage());
        }
    }

    public RemoveObstacleCompleteResult handleRemoveObstacleComplete(User user, RequestRemoveObstacleComplete request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapService: Processing remove obstacle request buildingType: " + request.getObstacleType()
                        + " with index: " + request.getObstacleIndex());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return RemoveObstacleCompleteResult.serviceFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return RemoveObstacleCompleteResult.serviceFailure("Player object not found");
            }

            model.Obstacle obstacle = getObstacleByIndex(player, request.getObstacleIndex());
            if (obstacle == null) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Obstacle with index {} not found for user: {}",
                        request.getObstacleIndex(), user.getName());
                return RemoveObstacleCompleteResult.obstacleNotFound(request.getObstacleIndex());
            }

            //remove the obstacle from the obstacle list of the player
            player.getObstacles().remove(request.getObstacleIndex());

            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist changes for user: {}", user.getName());
                return RemoveObstacleCompleteResult.serviceFailure("Failed to save changes");
            }

            return RemoveObstacleCompleteResult.success(
                    request.getObstacleType(),
                    request.getObstacleIndex());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception processing cancel building request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return RemoveObstacleCompleteResult.serviceFailure("Unexpected error: " + e.getMessage());
        }
    }

    private model.Obstacle getObstacleByIndex(Player player, int obstacleIndex) {
        List<model.Obstacle> obstacles = player.getObstacles();
        if (obstacles == null || obstacleIndex < 0 || obstacleIndex >= obstacles.size()) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Invalid obstacle index: {}", obstacleIndex);
            return null;
        }
        return obstacles.get(obstacleIndex);
    }

    /**
     * Step 5: Updates the player's state after building completion
     * 
     * @param user    The user whose state should be updated
     * @param request The build complete request
     * @return true if update was successful, false otherwise
     */
    private boolean updatePlayerState(User user, RequestBuildComplete request) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService: Updating player state for user: {}", user.getName());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return false;
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return false;
            }

            if (!updateBuildingState(player, request.getBuildingID(), request.getBuildingIndex())) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapService: Failed to update building state for user: {}", user.getName());
                return false;
            }

            // Update resource caps after building state changes
            player.updateResourceCaps();

            player.setLogoutTime(System.currentTimeMillis());

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "MapService: Player state updated successfully for user: {} - Building {} completed by builder {}",
                    user.getName(), request.getBuildingID(), request.getBuildingIndex());
            return true;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception updating player state for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Updates the building's operational state from CONSTRUCTING to OPERATING
     * @param player     The player object
     * @param buildingID The building ID to update
     * @return true if update was successful, false otherwise
     */
    private boolean updateBuildingState(Player player, String buildingID, int buildingIndex) {
        List<Building> buildings = player.getBuildings();
        if (buildings == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player buildings list is null");
            return false;
        }

        for (Building building : buildings) {
            if (buildingID.equals(building.getBuildingID()) && buildingIndex == building.getBuildingIndex()) {
                building.setBuildingState(BuildingOperationalState.OPERATING);

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapService: Building {} state updated to OPERATING", buildingID);
                return true;
            }
        }

        LoggerUtil.log(ExtensionLogLevel.ERROR,
                "MapService: Building {} not found for state update", buildingID);
        return false;
    }

    private boolean freeUpBuilder(Player player, int builderIndex, String buildingID) {
        return true;
    }

    /**
     * Step 6: Persists the player's data to the database
     * Enhanced with building completion specific validations and error handling
     * 
     * @param user The user whose data should be persisted
     * @return true if persistence was successful, false otherwise
     */
    private boolean persistPlayerData(User user) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService: Persisting player data for user: {}", user.getName());

        try {

            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null || !playerInfo.hasValidPlayerData()) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Invalid PlayerInfo for user: {} - cannot persist data", user.getName());
                return false;
            }

            // Update logout time before persistence to ensure the latest state is saved
            if (playerInfo.getPlayer() != null) {
                playerInfo.getPlayer().setLogoutTime(System.currentTimeMillis());
                playerInfo.updateLogoutTime(); // Also update in PlayerInfo
            }

            PlayerDataService playerDataService = PlayerDataService.getInstance();
            boolean success = playerDataService.savePlayerDataOnLogout(user, "build_complete");

            if (success) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapService: Player data persisted successfully for user: " + user.getName());

            } else {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Failed to persist player data for user: {}", user.getName());
            }

            return success;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception persisting player data for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Validates that the building exists in the player's building list
     * 
     * @param player     The player object
     * @param buildingID The building ID to check
     * @return true if building exists, false otherwise
     */
    private boolean validateBuildingExists(Player player, String buildingID) {
        List<Building> buildings = player.getBuildings();
        if (buildings == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player buildings list is null");
            return false;
        }

        for (Building building : buildings) {
            if (buildingID.equals(building.getBuildingID())) {
                LoggerUtil.log(ExtensionLogLevel.DEBUG,
                        "MapService: Building {} found in player's buildings", buildingID);
                return true;
            }
        }

        LoggerUtil.log(ExtensionLogLevel.WARN,
                "MapService: Building {} not found in player's buildings", buildingID);
        return false;
    }

    /**
     * Validates that the building is under construction
     * 
     * @param player     The player object
     * @param buildingID The building ID to check
     * @return true if building is under construction, false otherwise
     */
    private boolean validateBuildingUnderConstruction(Player player, String buildingID, int buildingIndex) {
        List<Building> buildings = player.getBuildings();
        if (buildings == null) {
            return false;
        }

        for (Building building : buildings) {
            if (!(buildingIndex == building.getBuildingIndex())) {
                continue;
            }

            BuildingOperationalState state = building.getBuildingState();
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Checking construction state for" +
                    state);
            if (state != BuildingOperationalState.CONSTRUCTING) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Building {} is not under construction, current state: {}",
                        buildingID, state);
                return false;
            }

            LoggerUtil.log(ExtensionLogLevel.DEBUG,
                    "MapService: Building {} is under construction", buildingID);
            return true;
        }

        LoggerUtil.log(ExtensionLogLevel.WARN,
                "MapService: Building {} not found for construction state check", buildingID);
        return false;
    }


    // === MOVE BUILDING OPERATION METHODS  ===

    /**
     * Step 4: Validates the move building request
     * 
     * @param user    The user making the request
     * @param request The move building request
     * @return MoveBuildingResult indicating validation outcome
     */
    private MoveBuildingResult validateMoveBuildingRequest(User user, RequestMoveBuilding request) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService: Validating move building request for user: {}", user.getName());

        // Get player info from user properties
        PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
        if (playerInfo == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: PlayerInfo not found for user: {}", user.getName());
            return MoveBuildingResult.validationFailure("Player information not found");
        }

        Player player = playerInfo.getPlayer();
        if (player == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player object not found for user: {}", user.getName());
            return MoveBuildingResult.validationFailure("Player object not found");
        }

        // Validate building exists and get building reference
        Building targetBuilding = validateBuildingExistsByIndex(player, request.getBuildingIndex());
        if (targetBuilding == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Building with index {} not found for user: {}",
                    request.getBuildingIndex(), user.getName());
            return MoveBuildingResult.validationFailure("Building not found");
        }

        // Validate new position is within map bounds
        int newX = request.getNewPositionX();
        int newY = request.getNewPositionY();

        // Get building dimensions for validation
        int buildingWidth = getBuildingWidth(targetBuilding);
        int buildingHeight = getBuildingHeight(targetBuilding);

        if (!isPositionWithinMapBounds(newX, newY, buildingWidth, buildingHeight)) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Invalid position ({}, {}) - outside map bounds for building {}",
                    newX, newY, targetBuilding.getBuildingID());
            return MoveBuildingResult.validationFailure("Position outside map bounds");
        }

        // Validate new position is not occupied by other buildings
        if (isPositionOccupied(player, newX, newY, buildingWidth, buildingHeight, targetBuilding.getBuildingIndex())) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Position ({}, {}) is occupied by another building",
                    newX, newY);
            return MoveBuildingResult.validationFailure("Position occupied by another building");
        }

        // Store old position for the result
        Position oldPosition = targetBuilding.getPosition();
        int oldX = oldPosition != null ? oldPosition.getX() : 0;
        int oldY = oldPosition != null ? oldPosition.getY() : 0;

        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService: Move building request validation passed for user: {} buildingIndex: {}",
                user.getName(), request.getBuildingIndex());

        return MoveBuildingResult.success(request.getBuildingIndex(), oldX, oldY,
                request.getNewPositionX(), request.getNewPositionY());
    }

    /**
     * Updates the building's position in player state
     * 
     * @param user    The user whose building should be moved
     * @param request The move building request
     * @return MoveBuildingResult indicating update outcome
     */
    private MoveBuildingResult updateBuildingPosition(User user, RequestMoveBuilding request) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService: Updating building position for user: {} buildingIndex: {}",
                user.getName(), request.getBuildingIndex());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return MoveBuildingResult.serviceFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return MoveBuildingResult.serviceFailure("Player object not found");
            }

            // Find the building by index
            Building targetBuilding = validateBuildingExistsByIndex(player, request.getBuildingIndex());
            if (targetBuilding == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Building with index {} not found during position update for user: {}",
                        request.getBuildingIndex(), user.getName());
                return MoveBuildingResult.serviceFailure("Building not found for position update");
            }

            Position oldPosition = targetBuilding.getPosition();
            int oldX = oldPosition != null ? oldPosition.getX() : 0;
            int oldY = oldPosition != null ? oldPosition.getY() : 0;

            Position newPosition = new Position(request.getNewPositionX(), request.getNewPositionY());
            targetBuilding.setPosition(newPosition);

            player.setLogoutTime(System.currentTimeMillis());

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "MapService: Successfully updated building {} position from ({}, {}) to ({}, {}) for user: {}",
                    targetBuilding.getBuildingID(), oldX, oldY,
                    request.getNewPositionX(), request.getNewPositionY(), user.getName());

            return MoveBuildingResult.success(request.getBuildingIndex(), oldX, oldY,
                    request.getNewPositionX(), request.getNewPositionY());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Exception updating building position for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return MoveBuildingResult.serviceFailure("Unexpected error during position update: " + e.getMessage());
        }
    }

    /**
     * Persists the move building changes to database
     * 
     * @param user The user whose data should be persisted
     * @return true if persistence was successful, false otherwise
     */
    private boolean persistMoveBuildingChanges(User user) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "MapService.persistMoveBuildingChanges: Persisting move building changes for user: {}",
                user.getName());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null || !playerInfo.hasValidPlayerData()) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService.persistMoveBuildingChanges: Invalid PlayerInfo for user: {} - cannot persist data",
                        user.getName());
                return false;
            }

            // Update logout time before persistence to ensure the latest state is saved
            if (playerInfo.getPlayer() != null) {
                playerInfo.getPlayer().setLogoutTime(System.currentTimeMillis());
                playerInfo.updateLogoutTime();
            }

            PlayerDataService playerDataService = PlayerDataService.getInstance();
            boolean success = playerDataService.savePlayerDataOnLogout(user, "move_building");

            if (success) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapService.persistMoveBuildingChanges: Player data persisted successfully for user: {} after building move",
                        user.getName());
            } else {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService.persistMoveBuildingChanges: Failed to persist player data for user: {} after building move",
                        user.getName());
            }

            return success;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService.persistMoveBuildingChanges: Exception occurred while persisting data for user: {} - {}",
                    user.getName(), e.getMessage(), e);
            return false;
        }
    }

    // === MOVE BUILDING HELPER METHODS ===
    /**
     * Validates that a building exists for the given building index
     * 
     * @param player        The player whose buildings to check
     * @param buildingIndex The index of the building to find
     * @return The building if found, null otherwise
     */
    private Building validateBuildingExistsByIndex(Player player, int buildingIndex) {
        List<Building> buildings = player.getBuildings();
        if (buildings == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: No buildings found for player");
            return null;
        }

        for (Building building : buildings) {
            if (building.getBuildingIndex() == buildingIndex) {
                return building;
            }
        }

        LoggerUtil.log(ExtensionLogLevel.WARN,
                "MapService: Building with index {} not found", buildingIndex);
        return null;
    }

    /**
     * Checks if a position is within the map bounds considering building dimensions
     * 
     * @param x              The X coordinate
     * @param y              The Y coordinate
     * @param buildingWidth  The width of the building
     * @param buildingHeight The height of the building
     * @return true if position is within bounds, false otherwise
     */
    private boolean isPositionWithinMapBounds(int x, int y, int buildingWidth, int buildingHeight) {
        // Use centralized bounds checking
        boolean withinBounds = PositionValidator.isWithinMapBounds(x, y, buildingWidth, buildingHeight);

        if (!withinBounds) {
            LoggerUtil.log(ExtensionLogLevel.DEBUG,
                    "MapService: Position ({}, {}) with size ({}, {}) is outside map bounds ({}, {})",
                    x, y, buildingWidth, buildingHeight, MapLayout.MAP_WIDTH, MapLayout.MAP_HEIGHT);
        }

        return withinBounds;
    }

    /**
     * Checks if a position is occupied by other buildings (excluding the building
     * being moved)
     * 
     * @param player               The player whose buildings to check
     * @param x                    The X coordinate to check
     * @param y                    The Y coordinate to check
     * @param buildingWidth        The width of the building being placed
     * @param buildingHeight       The height of the building being placed
     * @param excludeBuildingIndex The building index to exclude from collision
     *                             check
     * @return true if position is occupied, false otherwise
     */
    private boolean isPositionOccupied(Player player, int x, int y, int buildingWidth, int buildingHeight,
            int excludeBuildingIndex) {
        List<Building> buildings = player.getBuildings();
        if (buildings == null) {
            return false;
        }

        // Convert buildings to Positionable list using adapters
        List<PositionValidator.Positionable> positionableBuildings = new ArrayList<>();
        PositionValidator.Positionable excludeBuilding = null;

        for (Building building : buildings) {
            int otherWidth = getBuildingWidth(building);
            int otherHeight = getBuildingHeight(building);
            PositionValidator.BuildingAdapter adapter = new PositionValidator.BuildingAdapter(building, otherWidth,
                    otherHeight);

            // Track the building to exclude
            if (building.getBuildingIndex() == excludeBuildingIndex) {
                excludeBuilding = adapter;
            }

            positionableBuildings.add(adapter);
        }

        // Use centralized collision detection
        return PositionValidator.hasCollisionWithObjects(x, y, buildingWidth, buildingHeight,
                positionableBuildings, excludeBuilding);
    }

    /**
     * Gets the width of a building from its configuration
     * 
     * @param building The building to get width for
     * @return The building width, defaults to 1 if not found
     */
    private int getBuildingWidth(Building building) {
        try {
            Size buildingSize = getBuildingSizeFromConfig(building.getBuildingID(), building.getLevel());
            return buildingSize != null ? buildingSize.getWidth() : 1;
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Failed to get building width for buildingID {}: {}",
                    building.getBuildingID(), e.getMessage());
            return 1; // Default width
        }
    }

    /**
     * Gets the height of a building from its configuration
     * 
     * @param building The building to get height for
     * @return The building height, defaults to 1 if not found
     */
    private int getBuildingHeight(Building building) {
        try {
            Size buildingSize = getBuildingSizeFromConfig(building.getBuildingID(), building.getLevel());
            return buildingSize != null ? buildingSize.getHeight() : 1;
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Failed to get building height for buildingID {}: {}",
                    building.getBuildingID(), e.getMessage());
            return 1; // Default height
        }
    }

    /**
     * Gets the Size configuration for a building based on its ID and level
     * 
     * @param buildingID The building ID (e.g., "TOW_1", "BAR_1", etc.)
     * @param level      The building level
     * @return The Size object from configuration, or null if not found
     */
    private Size getBuildingSizeFromConfig(String buildingID, int level) {
        if (buildingID == null) {
            return null;
        }

        try {
            BuildingConfig buildingConfig = ConfigManager.getInstance().getBuildingConfigs();

            // Determine building type from ID and get from appropriate configuration map
            if (buildingID.startsWith("TOW_")) {
                // Town Hall
                Map<String, Map<Integer, TownHallData>> townHallMap = buildingConfig.getTownHallDataMap();
                if (townHallMap.containsKey(buildingID) && townHallMap.get(buildingID).containsKey(level)) {
                    TownHallData data = townHallMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            } else if (buildingID.startsWith("BAR_")) {
                // Barracks
                Map<String, Map<Integer, BarrackData>> barrackMap = buildingConfig.getBarrackDataMap();
                if (barrackMap.containsKey(buildingID) && barrackMap.get(buildingID).containsKey(level)) {
                    BarrackData data = barrackMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            } else if (buildingID.startsWith("AMC_")) {
                // Army Camp
                Map<String, Map<Integer, ArmyCampData>> armyCampMap = buildingConfig.getArmyCampDataMap();
                if (armyCampMap.containsKey(buildingID) && armyCampMap.get(buildingID).containsKey(level)) {
                    ArmyCampData data = armyCampMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            } else if (buildingID.startsWith("RES_")) {
                // Resource Storage
                Map<String, Map<Integer, ResourceGeneratorData>> generatorMap = buildingConfig
                        .getResourceGeneratorMap();
                if (generatorMap.containsKey(buildingID) && generatorMap.get(buildingID).containsKey(level)) {
                    ResourceGeneratorData data = generatorMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            } else if (buildingID.startsWith("STO_")) {
                // Laboratory
                Map<String, Map<Integer, ResourceStorageData>> storageMap = buildingConfig.getResourceStorageMap();
                if (storageMap.containsKey(buildingID) && storageMap.get(buildingID).containsKey(level)) {
                    ResourceStorageData data = storageMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            } else if (buildingID.startsWith("BDH_")) {
                // Builder Hut
                Map<String, Map<Integer, BuilderHutData>> builderHutMap = buildingConfig.getBuilderHutDataMap();
                if (builderHutMap.containsKey(buildingID) && builderHutMap.get(buildingID).containsKey(level)) {
                    BuilderHutData data = builderHutMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            } else if (buildingID.startsWith("DEF_")) {
                // Defensive Buildings (including Cannons)
                Map<String, Map<Integer, DefensiveBuildingData>> defenseMap = buildingConfig
                        .getDefensiveBuildingDataMap();
                if (defenseMap.containsKey(buildingID) && defenseMap.get(buildingID).containsKey(level)) {
                    DefensiveBuildingData data = defenseMap.get(buildingID).get(level);
                    return data != null ? data.getSize() : null;
                }
            }

            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: No configuration found for buildingID" + buildingID);
            return null;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Error accessing building configuration for {} level {}: {}",
                    buildingID, level, e.getMessage());
            return null;
        }
    }

    /**
     * Validates building type exists and player has sufficient resources.
     */
    private boolean validateBuildingTypeAndCost(Player player, String buildingTypeId, BuildingConfig config,
            int buildingLevel) {
        Resources playerResources = player.getResources();
        if (playerResources == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "MapService: Player resources not found for player ID: ");
            return false;
        }

        int[] costs = getBuildingCost(buildingTypeId, buildingLevel, config);

        if (costs == null) {
            return false;
        }
        int goldCost = costs[0];
        int oilCost = costs[1];

        // GCheck if player has sufficient resources
        if (playerResources.getGold() < goldCost || playerResources.getOil() < oilCost) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Insufficient resources for building {}. Required: gold={}, oil={}. Available: gold={}, oil={}",
                    buildingTypeId, goldCost, oilCost, playerResources.getGold(), playerResources.getOil());
            return false;
        }

        // All validations passed
        return true;
    }

    /**
     * Retrieves the gold and oil cost for a specific building type and level from
     * configuration.
     * 
     * @param buildingTypeId The ID of the building (e.g., "TOW_1", "BAR_1")
     * @param buildingLevel  The level of the building
     * @param config         The building configuration object
     * @return An array `[goldCost, oilCost]`, or `null` if config is not found.
     */
    private int[] getBuildingCost(String buildingTypeId, int buildingLevel, BuildingConfig config) {
        try {
            int goldCost = 0;
            int oilCost = 0;

            if (buildingTypeId.startsWith("TOW_")) {
                Map<String, Map<Integer, TownHallData>> map = config.getTownHallDataMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    TownHallData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            } else if (buildingTypeId.startsWith("BAR_")) {
                Map<String, Map<Integer, BarrackData>> map = config.getBarrackDataMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    BarrackData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            } else if (buildingTypeId.startsWith("DEF_")) {
                Map<String, Map<Integer, DefensiveBuildingData>> map = config.getDefensiveBuildingDataMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    DefensiveBuildingData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            } else if (buildingTypeId.startsWith("RES_")) {
                Map<String, Map<Integer, ResourceGeneratorData>> map = config.getResourceGeneratorMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    ResourceGeneratorData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            } else if (buildingTypeId.startsWith("STO_")) {
                Map<String, Map<Integer, ResourceStorageData>> map = config.getResourceStorageMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    ResourceStorageData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            } else if (buildingTypeId.startsWith("BDH_")) {
                Map<String, Map<Integer, BuilderHutData>> map = config.getBuilderHutDataMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    BuilderHutData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            }
            else if (buildingTypeId.startsWith("AMC_")) {
                Map<String, Map<Integer, ArmyCampData>> map = config.getArmyCampDataMap();
                if (map.containsKey(buildingTypeId) && map.get(buildingTypeId).containsKey(buildingLevel)) {
                    ArmyCampData data = map.get(buildingTypeId).get(buildingLevel);
                    if (data.getResourceRequired() == ResourceType.OIL)
                        oilCost = data.getBuildingCost();
                    else
                        goldCost = data.getBuildingCost();
                    return new int[] { goldCost, oilCost };
                }
            }

            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Missing cost configuration for building type: {} level: {}",
                    buildingTypeId, buildingLevel);
            return null;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Error getting building cost for type: {} level: {}: {}",
                    buildingTypeId, buildingLevel, e.getMessage());
            return null;
        }
    }

    private Building createBuilding(Player player, String buildingTypeId, int posX, int posY) {
        Building building;
        int buildingIndex = 0;
        List<Building> existingBuildings = player.getBuildings();
        if (existingBuildings != null) {
            for (Building existingBuilding : existingBuildings) {
                buildingIndex = Math.max(buildingIndex, existingBuilding.getBuildingIndex());
            }
        }
        buildingIndex++;

        if (buildingTypeId.startsWith("TOW_")) {
            building = new TownHall(
                    buildingIndex,
                    buildingTypeId,
                    1, // Starting level
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING,
                    5000 // Starting amount for town hall
            );
        } else if (buildingTypeId.startsWith("BAR_")) {
            building = new Barrack(
                    buildingIndex,
                    buildingTypeId,
                    1,
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING);
        } else if (buildingTypeId.startsWith("RES_")) {
            // Get resource generator config data
            BuildingConfig buildingConfig = ConfigManager.getInstance().getBuildingConfigs();
            Map<String, Map<Integer, ResourceGeneratorData>> resourceMap = buildingConfig.getResourceGeneratorMap();
            ResourceGeneratorData data = resourceMap.get(buildingTypeId).get(1);

            building = new ResourceGenerator(
                    buildingIndex,
                    buildingTypeId,
                    1, // Starting level
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING,
                    0, // Current amount
                    false, // Not harvestable initially
                    ResourceGeneratorStatus.GENERATING, // Start generating immediately
                    data.getProductivity(),
                    data.getBaseCapacity(),
                    data.getResourceGenerate());
        } else if (buildingTypeId.startsWith("BDH_")) {
            building = new BuilderHut(
                    buildingIndex,
                    buildingTypeId,
                    1, // Starting level
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING,
                    true, // Available
                    null // No current task
            );
        } else if (buildingTypeId.startsWith("STO_")) {
            building = new ResourceStorage(
                    buildingIndex,
                    buildingTypeId,
                    1,
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING,
                    0);
        } else if (buildingTypeId.startsWith("AMC_")) {
            building = new ArmyCamp(
                    buildingIndex,
                    buildingTypeId,
                    1, // Starting level
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING,
                    new ArrayList<>());
        } else if (buildingTypeId.startsWith("DEF_")) {
            building = new DefensiveBuilding(
                    buildingIndex,
                    buildingTypeId,
                    1, // Starting level
                    new Position(posX, posY),
                    BuildingOperationalState.CONSTRUCTING);
        } else {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Unsupported building type: {}", buildingTypeId);
            return null;
        }

        return building;
    }

    private boolean deductResourcesAndAddBuilding(Player player, Building newBuilding, BuildingConfig config) {
        try {
            int[] costs = getBuildingCost(newBuilding.getBuildingID(), 1, config);

            if (costs == null) {
                return false;
            }
            int goldCost = costs[0];
            int oilCost = costs[1];


            Resources resources = player.getResources();
            if (resources == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player resources not found for player ID: {}", player.getPlayerID());
                return false;
            }

            resources.setGold(resources.getGold() - goldCost);
            resources.setOil(resources.getOil() - oilCost);

            List<Building> buildings = player.getBuildings();
            if (buildings == null) {
                buildings = new ArrayList<>();
                player.setBuildings(buildings);
            }
            player.addBuilding(newBuilding);

            LoggerUtil.log(ExtensionLogLevel.DEBUG,
                    "MapService: Deducted gold: {}, oil: {} and added building {} for player {}",
                    goldCost, oilCost, newBuilding.getBuildingID(), player.getPlayerID());

            return true;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Error updating player resources and buildings for player {}: {}",
                    player.getPlayerID(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Assigns a builder to the new building (stub implementation)
     */
    private boolean assignBuilderToBuilding(Player player, Building newBuilding) {
        // Realized that we dont need to assign on server
        return true;
    }

    // === CANCEL BUILDING HELPER METHODS ===

    /**
     * Calculates the 50% refund amounts for cancelling a building.
     * Refactored to use the getBuildingCost helper method for clarity and to avoid
     * code duplication.
     * 
     * @param buildingID The building ID to calculate refund for (assumes level 1)
     * @param config     The building configuration
     * @return Array containing [goldRefund, oilRefund]
     */
    private int[] calculateRefund(String buildingID, BuildingConfig config) {
        try {
            int[] costs = getBuildingCost(buildingID, 1, config);
            if (costs == null) {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapService: Could not calculate refund for building {} because its cost could not be determined.",
                        buildingID);
                return new int[] { 0, 0 };
            }

            int goldCost = costs[0];
            int oilCost = costs[1];

            // Calculate 50% refund, rounding down
            int goldRefund = (int) Math.floor(goldCost * 0.5);
            int oilRefund = (int) Math.floor(oilCost * 0.5);

            LoggerUtil.log(ExtensionLogLevel.DEBUG,
                    "MapService: Calculated refund for {}: goldRefund={}, oilRefund={} (50% of original cost: gold={}, oil={})",
                    buildingID, goldRefund, oilRefund, goldCost, oilCost);

            return new int[] { goldRefund, oilRefund };

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Unexpected error calculating refund for building {}: {}",
                    buildingID, e.getMessage(), e);
            return new int[] { 0, 0 };
        }
    }

    /**
     * Frees up the builder working on the specified building
     * 
     * @param player     The player object
     * @param buildingID The building ID the builder is working on
     * @return true if builder was freed successfully, false otherwise
     */
    private boolean freeUpBuilderForBuilding(Player player, String buildingID) {
        List<Building> buildings = player.getBuildings();
        if (buildings == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Player buildings list is null");
            return false;
        }

        for (Building building : buildings) {
            if (building instanceof BuilderHut) {
                BuilderHut builderHut = (BuilderHut) building;
                BuildingTask currentTask = builderHut.getCurrentTask();

                if (currentTask != null && buildingID.equals(currentTask.getTargetBuildingId())) {
                    builderHut.setCurrentTask(null);
                    builderHut.setAvailable(true);

                    LoggerUtil.log(ExtensionLogLevel.DEBUG,
                            "MapService: Builder freed up after cancelling building {}", buildingID);
                    return true;
                }
            }
        }

        LoggerUtil.log(ExtensionLogLevel.WARN,
                "MapService: No builder found working on building {}", buildingID);
        return false;
    }

    /**
     * Removes the building from player's list and refunds resources
     * 
     * @param player        The player object
     * @param buildingIndex The index of the building to remove
     * @param goldRefund    Amount of gold to refund
     * @param oilRefund     Amount of oil to refund
     * @return true if operation was successful, false otherwise
     */
    private boolean removeBuildingAndRefundResources(Player player, int buildingIndex,
            int goldRefund, int oilRefund) {
        try {
            List<Building> buildings = player.getBuildings();
            if (buildings == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player buildings list is null");
                return false;
            }

            // Find and remove the building by index
            Building removedBuilding = null;
            for (int i = 0; i < buildings.size(); i++) {
                Building building = buildings.get(i);
                if (building.getBuildingIndex() == buildingIndex) {
                    removedBuilding = buildings.remove(i);
                    break;
                }
            }

            if (removedBuilding == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Building with index {} not found for removal", buildingIndex);
                return false;
            }

            // Refund resources to player
            Resources resources = player.getResources();
            if (resources == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player resources not found");
                return false;
            }

            resources.setGold(resources.getGold() + goldRefund);
            resources.setOil(resources.getOil() + oilRefund);

            LoggerUtil.log(ExtensionLogLevel.DEBUG,
                    "MapService: Removed building {} and refunded gold: {}, oil: {}",
                    removedBuilding.getBuildingID(), goldRefund, oilRefund);

            return true;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Error removing building and refunding resources: {}", e.getMessage());
            return false;
        }
    }

    // === UPGRADE BUILDING HELPER METHODS ===

    private boolean validateUpgradeBuilding(Player player, String buildingTypeId, int buildingIndex) {
        BuildingConfig config = ConfigManager.getInstance().getBuildingConfigs();
        if (config == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Building configuration not found");
            return false;
        }

        Building building = validateBuildingExistsByIndex(player, buildingIndex);
        if (building == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Building with index {} not found for upgrade", buildingIndex);
            return false;
        }

        int currentLevel = building.getLevel();
        int nextLevel = currentLevel + 1;

        if (!validateBuildingTypeAndCost(player, buildingTypeId, config, nextLevel)) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "MapService: Invalid building type or insufficient resources for upgrade to level {}: {}",
                    nextLevel, buildingTypeId);
            return false;
        }
        return true;
    }

    /**
     * Deducts the resource cost for a building upgrade from the player.
     * Refactored to use the getBuildingCost helper method, guard clauses, and to
     * correctly calculate upgrade cost for the next level.
     *
     * @param player         The player performing the upgrade.
     * @param targetBuilding The building to be upgraded.
     * @param config         The building configuration.
     * @return true if resources were successfully deducted, false otherwise.
     */
    private boolean deductResourcesForUpgrade(Player player, Building targetBuilding, BuildingConfig config) {
        try {
            int nextLevel = targetBuilding.getLevel() + 1;
            String buildingTypeId = targetBuilding.getBuildingID();

            int[] costs = getBuildingCost(buildingTypeId, nextLevel, config);

            if (costs == null) {
                return false;
            }
            int goldCost = costs[0];
            int oilCost = costs[1];

            Resources resources = player.getResources();
            if (resources == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player resources not found for player ID: {}", player.getPlayerID());
                return false;
            }

            resources.setGold(resources.getGold() - goldCost);
            resources.setOil(resources.getOil() - oilCost);

            LoggerUtil.log(ExtensionLogLevel.DEBUG,
                    "MapService: Deducted resources for upgrading {} to level {}. Gold: {}, Oil: {}",
                    buildingTypeId, nextLevel, goldCost, oilCost);

            return true;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "MapService: Error deducting resources for upgrade for player {}: {}",
                    player.getPlayerID(), e.getMessage(), e);
            return false;
        }
    }

}
