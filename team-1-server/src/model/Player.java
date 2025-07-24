package model;

import model.building.Building;
import model.building.ResourceStorage;
import model.building.TownHall;
import config.data.ResourceType;
import config.ConfigManager;
import config.data.BuildingConfig;
import config.data.ResourceStorageData;
import config.data.TownHallData;
import model.enums.BuildingOperationalState;
import model.enums.TroopTrainingSlot;
import model.result.TrainTroopResult;

import java.util.LinkedList;
import java.util.List;
import java.util.ArrayList;

/**
 * Represents a player in the game with all their data
 * Extended from the original Player class to include comprehensive game state
 */
public class Player {
    public String playerId; // Keep for backward compatibility
    private String sessionKey; // Added for authentication

    // Comprehensive player data fields
    private int playerID;
    private long logoutTime;
    private String username;
    private int prestigePoint;
    private Resources resources;
    private List<Building> buildings;
    private List<TroopTrainingSlot> army;
    private List<Obstacle> obstacles;
    private List<PlayerMapData> playerMaps;


    // Default constructor for Gson
    public Player() {
        this.buildings = new ArrayList<>();
        this.army = new LinkedList<>();
        this.obstacles = new ArrayList<>();
        this.playerMaps = new ArrayList<>();
    }

    public Player(String playerId) {
        this.playerId = playerId;
        this.sessionKey = null;
        this.buildings = new ArrayList<>();
        this.army = new LinkedList<>();
        this.obstacles = new ArrayList<>();
        this.playerMaps = new ArrayList<>();
    }

    public Player(int playerID, long logoutTime, String username, int prestigePoint,
            Resources resources, List<Building> buildings, List<TroopTrainingSlot> army) {
        this.playerID = playerID;
        this.playerId = String.valueOf(playerID); // Keep sync for compatibility
        this.logoutTime = logoutTime;
        this.username = username;
        this.prestigePoint = prestigePoint;
        this.resources = resources;
        this.buildings = buildings != null ? buildings : new ArrayList<>();
        this.army = army != null ? army : new LinkedList<>();
        this.obstacles = new ArrayList<>();
        this.playerMaps = new ArrayList<>();
        updateResourceCaps();
    }

    // Original session management methods
    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public boolean hasSession() {
        return sessionKey != null && !sessionKey.isEmpty();
    }

    // New comprehensive getters and setters
    public int getPlayerID() {
        return playerID;
    }

    public void setPlayerID(int playerID) {
        this.playerID = playerID;
        this.playerId = String.valueOf(playerID);
    }

    public long getLogoutTime() {
        return logoutTime;
    }

    public long getSentServerTime() {
        return System.currentTimeMillis();
    }

    public void setLogoutTime(long logoutTime) {
        this.logoutTime = logoutTime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getPrestigePoint() {
        return prestigePoint;
    }

    public void setPrestigePoint(int prestigePoint) {
        this.prestigePoint = prestigePoint;
    }

    public Resources getResources() {
        return resources;
    }

    public void setResources(Resources resources) {
        this.resources = resources;
    }

    public List<Building> getBuildings() {
        return buildings;
    }

    public void setBuildings(List<Building> buildings) {
        this.buildings = buildings != null ? buildings : new ArrayList<>();
        updateResourceCaps();
    }

    public void addBuilding(Building building) {
        if (this.buildings == null) {
            this.buildings = new ArrayList<>();
        }
        this.buildings.add(building);
        updateResourceCaps();
    }

    public List<TroopTrainingSlot> getArmy() {
        return army;
    }

    public void setArmy(List<TroopTrainingSlot> army) {
        this.army = army != null ? army : new ArrayList<>();
    }

    public List<Obstacle> getObstacles() {
        return obstacles;
    }

    public void setObstacles(List<Obstacle> obstacles) {
        this.obstacles = obstacles != null ? obstacles : new ArrayList<>();
    }

    public List<PlayerMapData> getPlayerMaps() {
        return playerMaps;
    }

    public void setPlayerMaps(List<PlayerMapData> playerMaps) {
        this.playerMaps = playerMaps;
    }

    @Override
    public String toString() {
        return "Player{" +
                "playerID=" + playerID +
                ", playerId='" + playerId + "'" +
                ", logoutTime=" + logoutTime +
                ", username='" + username + "'" +
                ", prestigePoint=" + prestigePoint +
                ", resources=" + resources +
                ", buildings=" + buildings +
                ", army=" + army +
                ", obstacles=" + obstacles +
                ", playerMaps=" + playerMaps +
                '}';
    }

    public int getMaxResourceCapacity(ResourceType resourceType) {
        int maxCapacity = 0;
        BuildingConfig buildingConfig = ConfigManager.getInstance().getBuildingConfigs();

        for (Building building : buildings) {
            if (building instanceof TownHall) {
                TownHallData townHallData = buildingConfig.getTownHallDataMap().get(building.getBuildingID()).get(building.getLevel());
                if (resourceType == ResourceType.GOLD) {
                    maxCapacity += townHallData.getBaseGoldCapacity();
                } else if (resourceType == ResourceType.OIL) {
                    maxCapacity += townHallData.getBaseOilCapacity();
                }
            } else if (building instanceof ResourceStorage) {
                ResourceStorageData storageData = buildingConfig.getResourceStorageMap().get(building.getBuildingID()).get(building.getLevel());
                if (storageData.getResourceStore() == resourceType) {
                    maxCapacity += storageData.getBaseCapacity();
                }
            }
        }
        return maxCapacity;
    }

    public void updateResourceCaps() {
        if (resources == null) {
            resources = new Resources(0, 0, 0);
        }
        resources.setMaxGoldCapacity(getMaxResourceCapacity(ResourceType.GOLD));
        resources.setMaxOilCapacity(getMaxResourceCapacity(ResourceType.OIL));
    }
}