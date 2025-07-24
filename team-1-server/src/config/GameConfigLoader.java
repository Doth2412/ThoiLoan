package config;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import model.GameObject;
import model.MapConfigParser;
import model.MapInitializer;
import model.MapLayout;
import config.data.BuildingLocationData;
import config.data.InitGameConfig;
import config.data.ObstacleData;
import config.data.PlayerData;

import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for loading and initializing game configuration
 */
public class GameConfigLoader {

    /**
     * Loads the initial game configuration with dynamically calculated positions
     * 
     * @param jsonFilePath The path to InitGame.json
     * @return The populated InitGameConfig object
     */
    public static InitGameConfig loadInitialGameConfig(String jsonFilePath) {
        try {
            // Parse the JSON file
            JsonParser parser = new JsonParser();
            JsonObject jsonConfig = parser.parse(new FileReader(jsonFilePath)).getAsJsonObject();

            // Read player data directly from JSON (unchanged)
            PlayerData playerData = parsePlayerData(jsonConfig);

            // Parse building and obstacle configurations using our new parser
            MapConfigParser.GameObjectLists objectLists = MapConfigParser.parseInitGameConfig(jsonConfig);

            // Initialize the map with dynamic placement
            MapInitializer initializer = new MapInitializer();
            MapLayout mapLayout = initializer.initMap(
                    objectLists.getBuildings(),
                    objectLists.getObstacles());

            // Convert MapLayout back to InitGameConfig format
            Map<String, BuildingLocationData> buildingLocations = new HashMap<>();
            Map<Integer, ObstacleData> obstacleData = new HashMap<>();

            // Convert placed buildings to BuildingLocationData
            int obstacleIndex = 1;
            for (GameObject obj : mapLayout.getPlacedObjects()) {
                if (obj.getType().startsWith("TOW_") ||
                        obj.getType().startsWith("BAR_") ||
                        obj.getType().startsWith("AMC_") ||
                        obj.getType().startsWith("RES_") ||
                        obj.getType().startsWith("BDH_") ||
                        obj.getType().startsWith("CLC_")) {
                    // This is a building
                    BuildingLocationData locationData = new BuildingLocationData(obj.getX(), obj.getY());
                    buildingLocations.put(obj.getType(), locationData);
                } else {
                    // This is an obstacle
                    ObstacleData obsData = new ObstacleData();
                    obsData.setType(obj.getType());
                    obsData.setPosX(obj.getX());
                    obsData.setPosY(obj.getY());
                    obstacleData.put(obstacleIndex++, obsData);
                }
            }

            // Create and return the InitGameConfig
            return new InitGameConfig(buildingLocations, playerData, obstacleData);

        } catch (Exception e) {
            System.err.println("Error loading initial game config: " + e.getMessage());
            e.printStackTrace();
            return new InitGameConfig(); // Return default config in case of error
        }
    }

    /**
     * Parse player data from JSON (unchanged from original implementation)
     */
    private static PlayerData parsePlayerData(JsonObject jsonConfig) {
        JsonObject playerJson = jsonConfig.getAsJsonObject("player");
        PlayerData playerData = new PlayerData();

        if (playerJson != null) {
            playerData.setGold(playerJson.get("gold").getAsInt());
            playerData.setGem(playerJson.get("coin").getAsInt());
            playerData.setOil(playerJson.get("elixir").getAsInt());
            playerData.setBuilderNumber(playerJson.get("builderNumber").getAsInt());
        }

        return playerData;
    }
}
