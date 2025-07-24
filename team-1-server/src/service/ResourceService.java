package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import cmd.receive.resources.RequestHarvestResource;
import cmd.receive.resources.RequestUseG;
import config.data.ResourceType;
import model.Player;
import model.PlayerInfo;
import model.building.Building;
import model.building.ResourceGenerator;
import model.result.HarvestResourceResult;
import model.result.UseGResult;
import util.LoggerUtil;
import util.server.ServerConstant;
import model.enums.ResourceGeneratorStatus;
import model.Resources;

/**
 * Service for handling resource-related operations.
 * Centralizes resource business logic that was previously in ResourceHandler.
 */
public class ResourceService {
    private static ResourceService instance;

    private ResourceService() {
    }

    public static synchronized ResourceService getInstance() {
        if (instance == null) {
            instance = new ResourceService();
        }
        return instance;
    }

    /**
     * Persist the player's data after resource harvesting
     * 
     * @param user   The user whose data should be persisted
     * @param result The result of the harvesting operation
     * @return true if persistence was successful, false otherwise
     */
    private boolean persistHarvestChanges(User user, HarvestResourceResult result) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "ResourceService.persistHarvestChanges: Persisting resource harvest changes for user: {}",
                user.getName());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null || !playerInfo.hasValidPlayerData()) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService.persistHarvestChanges: Invalid PlayerInfo for user: {} - cannot persist data",
                        user.getName());
                return false;
            }

            playerInfo.updateLogoutTime();
            PlayerDataService playerDataService = PlayerDataService.getInstance();
            boolean success = playerDataService.savePlayerDataOnLogout(user, "resource_harvest");

            if (success) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "ResourceService.persistHarvestChanges: Player data persisted successfully for user: {} after resource harvest",
                        user.getName());
            } else {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService.persistHarvestChanges: Failed to persist player data for user: {} after resource harvest",
                        user.getName());
            }

            return success;

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "ResourceService.persistHarvestChanges: Exception occurred while persisting data for user: {} - {}",
                    user.getName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Processes a resource harvest request from a client.
     * Validates the request and updates the player's resources.
     * 
     * @param user    The user making the request
     * @param request The harvest request containing building index
     * @return HarvestResourceResult indicating the operation outcome
     */
    public HarvestResourceResult processHarvestResource(User user, RequestHarvestResource request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "ResourceService: Processing harvest request for user: {} buildingIndex: {}",
                user.getName(), request.getBuildingIndex());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: PlayerInfo not found for user: {}", user.getName());
                return HarvestResourceResult.validationFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Player object not found for user: {}", user.getName());
                return HarvestResourceResult.validationFailure("Player object not found");
            }

            int resourceAmount = request.getAmountHarvested();
            updatePlayerResources(player, request.getResourceType(), resourceAmount);

            try {
                Building building = player.getBuildings().get(request.getBuildingIndex());
                if (building instanceof ResourceGenerator) {
                    ResourceGenerator resourceGenerator = (ResourceGenerator) building;
                    resourceGenerator.setCurrentAmount(0);
                    resourceGenerator.setLastCollectionTime(System.currentTimeMillis());
                    resourceGenerator.setHarvestable(false);
                    building.setStateStartingTime(System.currentTimeMillis());
                }
            } catch (IndexOutOfBoundsException e) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Invalid building index {} for user: {}",
                        request.getBuildingIndex(), user.getName());
                return HarvestResourceResult.validationFailure("Invalid building index");
            }

            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Failed to persist player data for user: {}", user.getName());
                return HarvestResourceResult.serviceInvalid();
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "ResourceService: Successfully harvested {} {} for user: {}",
                    resourceAmount, request.getResourceType(), user.getName());

            return HarvestResourceResult.success(
                    resourceAmount,
                    request.getResourceType(),
                    System.currentTimeMillis());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "ResourceService: Exception processing harvest request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return HarvestResourceResult.serviceInvalid();
        }
    }

    public UseGResult processUseG(User user, RequestUseG request) {
        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: PlayerInfo not found for user: {}", user.getName());
                return UseGResult.validationFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Player object not found for user: {}", user.getName());
                return UseGResult.validationFailure("Player object not found");
            }

            // Deduct g from player's storage
            int resourceAmount = request.getAmountUsed();
            updatePlayerResources(player, ResourceType.GEMS, - resourceAmount);
            if(request.getResourceType() == ResourceType.GOLD) {
                updatePlayerResources(player, request.getResourceType(), resourceAmount * 300);
            } else if(request.getResourceType() == ResourceType.OIL) {
                updatePlayerResources(player, request.getResourceType(), resourceAmount * 250);
            }

            if (!persistPlayerData(user)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Failed to persist player data for user: {}", user.getName());
                return UseGResult.serviceInvalid();
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "ResourceService: Successfully harvested {} {} for user: {}",
                    resourceAmount, request.getResourceType(), user.getName());

            return UseGResult.success(
                    resourceAmount,
                    request.getResourceType());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "ResourceService: Exception processing harvest request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return UseGResult.serviceInvalid();
        }
    }

    private Building validateResourceBuilding(Player player, int buildingIndex) {
        if (buildingIndex < 0 || buildingIndex >= player.getBuildings().size()) {
            return null;
        }

        Building building = player.getBuildings().get(buildingIndex);
        if (building == null || !(building instanceof ResourceGenerator)) {
            return null;
        }

        ResourceGenerator generator = (ResourceGenerator) building;
        return generator.getGeneratorState() == ResourceGeneratorStatus.GENERATING ? generator : null;
    }

    private void updatePlayerResources(Player player, ResourceType resourceType, int amount) {
        Resources resources = player.getResources();
        if (resources == null) {
            resources = new Resources();
            player.setResources(resources);
        }

        // Update the appropriate resource based on type
        switch (resourceType) {
            case GOLD:
                resources.setGold(resources.getGold() + amount);
                break;
            case OIL:
                resources.setOil(resources.getOil() + amount);
                break;
            case GEMS:
                resources.setGems(resources.getGems() + amount);
                break;
            case NONE:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "ResourceService: Invalid resource type: NONE");
                break;
            default:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "ResourceService: Unknown resource type: {}", resourceType);
                break;
        }
    }

    private boolean persistPlayerData(User user) {
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
                        "MapService: Player data persisted successfully for user: {} after building completion",
                        user.getName());

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
}
