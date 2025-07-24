package model;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Utility class for parsing map configuration data and converting it to
 * GameObject instances
 */
public class MapConfigParser {

    /**
     * Holds a pair of building and obstacle lists
     */
    public static class GameObjectLists {
        private final List<GameObject> buildings;
        private final List<GameObject> obstacles;

        public GameObjectLists(List<GameObject> buildings, List<GameObject> obstacles) {
            this.buildings = buildings;
            this.obstacles = obstacles;
        }

        public List<GameObject> getBuildings() {
            return buildings;
        }

        public List<GameObject> getObstacles() {
            return obstacles;
        }
    }

    /**
     * Parses the InitGame.json configuration to create lists of buildings and
     * obstacles for placement
     * 
     * @param jsonConfig The parsed JSON configuration
     * @return A GameObjectLists containing buildings and obstacles
     */
    public static GameObjectLists parseInitGameConfig(JsonObject jsonConfig) {
        List<GameObject> buildings = new ArrayList<>();
        List<GameObject> obstacles = new ArrayList<>();

        // Parse buildings section
        JsonObject buildingsJson = jsonConfig.getAsJsonObject("buildings");
        for (Map.Entry<String, JsonElement> entry : buildingsJson.entrySet()) {
            String buildingType = entry.getKey();
            JsonObject buildingConfig = entry.getValue().getAsJsonObject();

            int count = buildingConfig.get("count").getAsInt();
            int width = buildingConfig.get("width").getAsInt();
            int height = buildingConfig.get("height").getAsInt();

            // Create GameObject instances for each building
            for (int i = 0; i < count; i++) {
                String id = buildingType + "_player" + (i + 1);
                buildings.add(new GameObject(id, buildingType, width, height));
            }
        }

        // Parse obstacles section
        JsonObject obstaclesJson = jsonConfig.getAsJsonObject("obstacles");
        for (Map.Entry<String, JsonElement> entry : obstaclesJson.entrySet()) {
            String obstacleType = entry.getKey();
            JsonObject obstacleConfig = entry.getValue().getAsJsonObject();

            int count = obstacleConfig.get("count").getAsInt();
            int width = obstacleConfig.get("width").getAsInt();
            int height = obstacleConfig.get("height").getAsInt();

            // Create GameObject instances for each obstacle
            for (int i = 0; i < count; i++) {
                String id = obstacleType + "_" + (i + 1);
                obstacles.add(new GameObject(id, obstacleType, width, height));
            }
        }

        return new GameObjectLists(buildings, obstacles);
    }

    /**
     * Example of how to use the parser and map initializer together
     */
    public static void exampleConfigParsing() {
        // This would normally come from reading the JSON file
        String jsonExample = "{\n" +
                "  \"buildings\": {\n" +
                "    \"TOW_1\": { \n" +
                "      \"count\": 1, \n" +
                "      \"width\": 4, \n" +
                "      \"height\": 4 \n" +
                "    },\n" +
                "    \"BAR_1\": { \n" +
                "      \"count\": 2, \n" +
                "      \"width\": 3, \n" +
                "      \"height\": 3 \n" +
                "    }\n" +
                "  },\n" +
                "  \"obstacles\": {\n" +
                "    \"TREE_1\": { \n" +
                "      \"count\": 10, \n" +
                "      \"width\": 1, \n" +
                "      \"height\": 1 \n" +
                "    },\n" +
                "    \"ROCK_1\": { \n" +
                "      \"count\": 5, \n" +
                "      \"width\": 2, \n" +
                "      \"height\": 1 \n" +
                "    }\n" +
                "  }\n" +
                "}";

        // Parse the JSON using GSON
        com.google.gson.JsonParser parser = new com.google.gson.JsonParser();
        JsonObject jsonConfig = parser.parse(jsonExample).getAsJsonObject();

        // Parse the config into GameObject lists
        GameObjectLists objectLists = parseInitGameConfig(jsonConfig);

        // Initialize the map
        MapInitializer initializer = new MapInitializer();
        MapLayout mapLayout = initializer.initMap(objectLists.getBuildings(), objectLists.getObstacles());

        // Print the results
        System.out.println("Total buildings placed: " +
                objectLists.getBuildings().size() +
                ", Total obstacles placed: " +
                objectLists.getObstacles().size());
        System.out.println("Total objects on map: " + mapLayout.getPlacedObjects().size());
    }
}
