package config.data;

import com.google.gson.annotations.SerializedName;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration holder for initial game data
 */
public class InitGameConfig {
    @SerializedName("map") // Maps JSON key "map" to this field
    private Map<String, BuildingLocationData> buildingLocations;
    @SerializedName("player") // Maps JSON key "player" to this field
    private PlayerData playerData;
    @SerializedName("obs") // Maps JSON key "obs" to this field
    private Map<Integer, ObstacleData> obstacleData;

    /**
     * Default constructor
     */
    public InitGameConfig() {
        this.buildingLocations = new HashMap<>();
        this.playerData = new PlayerData();
        this.obstacleData = new HashMap<>();
    }

    /**
     * Constructor with all fields
     */
    public InitGameConfig(Map<String, BuildingLocationData> buildingLocations,
            PlayerData playerData,
            Map<Integer, ObstacleData> obstacleData) {
        this.buildingLocations = buildingLocations;
        this.playerData = playerData;
        this.obstacleData = obstacleData;
    }

    /**
     * Get barrack by building ID and level
     * 
     * @param buildingID the building ID
     * @param level      the level
     * @return the building location data or null if not found
     */
    public BuildingLocationData getBarrack(String buildingID, int level) {
        return buildingLocations.get(buildingID);
    }

    public Map<String, BuildingLocationData> getBuildingLocations() {
        return buildingLocations;
    }

    public void setBuildingLocations(Map<String, BuildingLocationData> buildingLocations) {
        this.buildingLocations = buildingLocations;
    }

    public PlayerData getPlayerData() {
        return playerData;
    }

    public void setPlayerData(PlayerData playerData) {
        this.playerData = playerData;
    }

    public Map<Integer, ObstacleData> getObstacleData() {
        return obstacleData;
    }

    public void setObstacleData(Map<Integer, ObstacleData> obstacleData) {
        this.obstacleData = obstacleData;
    }

    @Override
    public String toString() {
        return "InitGameConfig{" +
                "buildingLocations=" + buildingLocations +
                ", playerData=" + playerData +
                ", obstacleData=" + obstacleData +
                '}';
    }
}