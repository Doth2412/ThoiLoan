package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import cmd.receive.battle.RequestBattleResult;
import config.data.*;
import model.Player;
import model.PlayerInfo;
import model.PlayerMapData;
import model.Resources;
import model.result.BattleResult;
import util.LoggerUtil;
import util.server.ServerConstant;
import config.ConfigManager;

import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

public class BattleService {

    private static BattleService instance;

    private BattleService() {
    }

    public static synchronized BattleService getInstance() {
        if (instance == null) {
            instance = new BattleService();
        }
        return instance;
    }

    public BattleResult processBattleResult(User user, RequestBattleResult request){
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "BattleService.processBattleResult called for user: {}, stars: {}, lootedGold: {}, lootedElixir: {}",
                user.getName(), request.getStars(), request.getLootedGold(), request.getLootedElixir());
        try{
            PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (playerInfo == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: PlayerInfo not found for user: {}", user.getName());
                return BattleResult.serviceFailure("PlayerInfo not found");
            }

            Player player = playerInfo.getPlayer();
            if (player == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player object not found for user: {}", user.getName());
                return BattleResult.serviceFailure("Player object not found");
            }

            Resources resources = player.getResources();
            if (resources == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "MapService: Player resources not found for player ID: {}", player.getPlayerID());
                return BattleResult.serviceFailure("Player resources not found");
            }

            // Get map configuration
            DungeonConfig dungeonConfig = ConfigManager.getInstance().getDungeonConfigs();
            DungeonMap dungeonMap = dungeonConfig.getDungeonMap(request.getMapIndex() + ".map");

            if (dungeonMap == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "BattleService: Dungeon map not found for index: {}", request.getMapIndex());
                return BattleResult.serviceFailure("Dungeon map not found");
            }

            // Calculate remaining resources
            Optional<PlayerMapData> existingMapData = player.getPlayerMaps().stream()
                    .filter(pmd -> pmd.getMapIndex() == request.getMapIndex())
                    .findFirst();
            DungeonResource mapResources;
            if (existingMapData.isPresent()) {
                mapResources = existingMapData.get().getRemainingResources();
            } else {
                mapResources = dungeonMap.getResourse();
            }

            if (request.getLootedGold() > mapResources.getGold() || request.getLootedElixir() > mapResources.getElixir()) {
                return BattleResult.serviceFailure("Looted amount exceeds available resources");
            }

            int remainingGold = mapResources.getGold() - request.getLootedGold();
            int remainingElixir = mapResources.getElixir() - request.getLootedElixir();

            DungeonResource remainingDungeonResources = new DungeonResource();
            remainingDungeonResources.setGold(Math.max(0, remainingGold));
            remainingDungeonResources.setElixir(Math.max(0, remainingElixir));

            // Update player's map data
            if (existingMapData.isPresent()) {
                PlayerMapData pmd = existingMapData.get();
                if (request.getStars() > pmd.getStars()) {
                    pmd.setStars(request.getStars());
                }
                pmd.setRemainingResources(remainingDungeonResources);
            } else {
                player.getPlayerMaps().add(new PlayerMapData(request.getMapIndex(), request.getStars(), remainingDungeonResources));
            }

            // Calculate total resource capacities from player's storage buildings
            int maxGoldCapacity = 0;
            int maxElixirCapacity = 0;

            BuildingConfig buildingConfig = ConfigManager.getInstance().getBuildingConfigs();

            for (model.building.Building building : player.getBuildings()) {
                if (building.getBuildingID().startsWith("STO_")) { // Resource Storage buildings
                    Map<Integer, ResourceStorageData> storageDataMap = buildingConfig.getResourceStorageMap().get(building.getBuildingID());
                    if (storageDataMap != null) {
                        ResourceStorageData storageData = storageDataMap.get(building.getLevel());
                        if (storageData != null) {
                            if (storageData.getResourceStore() == ResourceType.GOLD) {
                                maxGoldCapacity += storageData.getBaseCapacity();
                            } else if (storageData.getResourceStore() == ResourceType.OIL) {
                                maxElixirCapacity += storageData.getBaseCapacity();
                            }
                        }
                    }
                } else if (building.getBuildingID().startsWith("TOW_")) { // Town Hall
                    Map<Integer, TownHallData> townHallDataMap = buildingConfig.getTownHallDataMap().get(building.getBuildingID());
                    if (townHallDataMap != null) {
                        TownHallData townHallData = townHallDataMap.get(building.getLevel());
                        if (townHallData != null) {
                            maxGoldCapacity += townHallData.getBaseGoldCapacity();
                            maxElixirCapacity += townHallData.getBaseOilCapacity();
                        }
                    }
                }
            }
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "BattleService: Calculated max capacities for user: ",
                    user.getName(), maxGoldCapacity, maxElixirCapacity);
            resources.setMaxGoldCapacity(maxGoldCapacity);
            resources.setMaxOilCapacity(maxElixirCapacity);

            resources.setGold(resources.getGold() + request.getLootedGold());
            resources.setOil(resources.getOil() + request.getLootedElixir());


        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Error processing battle result for user: " + user.getName() + ": " + e.getMessage(), e);
        }
        return BattleResult.success(request.getStars(), request.getLootedGold(), request.getLootedElixir());
    }
}
