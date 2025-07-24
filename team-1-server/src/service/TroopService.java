package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import cmd.receive.troops.RequestUpdateBarrackQueue;
import cmd.receive.troops.RequestUpdatePlayerArmy;
import model.Player;
import model.PlayerInfo;
import model.building.Barrack;
import model.building.Building;
import model.result.HarvestResourceResult;
import model.result.UpdateBarrackQueueResult;
import model.result.UpdatePlayerArmyResult;
import util.LoggerUtil;
import util.server.ServerConstant;

import java.util.List;

/**
 * Service for handling resource-related operations.
 * Centralizes resource business logic that was previously in ResourceHandler.
 */
public class TroopService {
    private static TroopService instance;

    private TroopService() {
    }

    public static synchronized TroopService getInstance() {
        if (instance == null) {
            instance = new TroopService();
        }
        return instance;
    }

    public UpdateBarrackQueueResult processUpdateBarrackQueue(User user, RequestUpdateBarrackQueue request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "ResourceService: Processing harvest request for user: {} buildingIndex: {}",
                user.getName(), request.getBuildingIndex());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: PlayerInfo not found for user: {}", user.getName());
                return UpdateBarrackQueueResult.validationFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Player object not found for user: {}", user.getName());
                return UpdateBarrackQueueResult.validationFailure("Player object not found");
            }

            playerInfo.saveModel(ServerConstant.PLAYER_INFO);


            Building building = validateBuildingExistsByIndex(player, request.getBuildingIndex());
            if (building == null || !(building instanceof Barrack)) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Invalid building index {} for user", request.getBuildingIndex(), user.getName());
                return UpdateBarrackQueueResult.validationFailure("Invalid building index");
            }
            Barrack barrack = (Barrack) building;
            barrack.setStateStartingTime(request.getStateStartingTime());
            barrack.setTrainingQueue(request.getTrainingQueue());

            LoggerUtil.log(ExtensionLogLevel.ERROR, "TROOP_SERVICE_DEBUG: Attempting to save barrack data. Queue is: " + barrack.getTrainingQueue().toString());

             PlayerDataService playerDataService = PlayerDataService.getInstance();
             boolean success = playerDataService.savePlayerDataOnLogout(user, "update_barrack_queue");

             if (success) {
                 LoggerUtil.log(ExtensionLogLevel.INFO,
                         "Successfully persisted barrack queue updates for user: {}", user.getName());
             } else {
                 LoggerUtil.log(ExtensionLogLevel.ERROR,
                         "Failed to persist barrack queue updates for user: {}", user.getName());
             }

            return UpdateBarrackQueueResult.success(
                    request.getBuildingType(),
                    request.getBuildingIndex(),
                    request.getStateStartingTime(),
                    request.getTrainingQueue()
            );

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "ResourceService: Exception processing harvest request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return UpdateBarrackQueueResult.serviceInvalid();
        }
    }

    public UpdatePlayerArmyResult processUpdatePlayerArmy(User user, RequestUpdatePlayerArmy request) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "ResourceService: Processing harvest request for user: {} buildingIndex: {}",
                user.getName(), request.getPlayerArmy());

        try {
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: PlayerInfo not found for user: {}", user.getName());
                return UpdatePlayerArmyResult.validationFailure("Player information not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "ResourceService: Player object not found for user: {}", user.getName());
                return UpdatePlayerArmyResult.validationFailure("Player object not found");
            }

            playerInfo.saveModel(ServerConstant.PLAYER_INFO);
            player.setArmy(request.getPlayerArmy());
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "ResourceService: Player army updated for user:"+ user.getName() +"with army: {}"+request.getPlayerArmy());

            PlayerDataService playerDataService = PlayerDataService.getInstance();
            boolean success = playerDataService.savePlayerDataOnLogout(user, "update_player_army");

            if (success) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Successfully persisted barrack queue updates for user: {}", user.getName());
            } else {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "Failed to persist barrack queue updates for user: {}", user.getName());
            }

            return UpdatePlayerArmyResult.success(
                    request.getPlayerArmy()
            );

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "ResourceService: Exception processing harvest request for user {}: {}",
                    user.getName(), e.getMessage(), e);
            return UpdatePlayerArmyResult.serviceInvalid();
        }
    }

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
}
