package model;

import java.awt.Point;
import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;

import model.enums.BuildingOperationalState;
import model.util.BuildingTypeAdapter; // Import the new all-in-one adapter
import org.apache.commons.logging.Log;

import util.LoggerUtil;
import util.database.DataModel;
import util.server.ServerConstant;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import bitzero.server.extensions.ExtensionLogLevel;
import model.building.Building;

/**
 * PlayerInfo class serves as the main PlayerModel container
 * Holds all player data and provides save/load functionality
 * Extended from the original to maintain backward compatibility
 */
public class PlayerInfo extends DataModel {
    private int id;
    private String name;
    public Point position;
    private Player player;

    // Original constructor for backward compatibility
    public PlayerInfo(int _id, String _name) {
        super();
        id = _id;
        name = _name;
    }

    public PlayerInfo() {
        super();
    }

    public PlayerInfo(Player player) {
        super();
        this.player = player;
        if (player != null) {
            this.id = player.getPlayerID();
            this.name = player.getUsername();
        }
    }

    public String toString() {
        if (player != null) {
            return String.format("PlayerInfo{id=%d, name='%s', player=%s}",
                    id, name, player.toString());
        }
        return String.format("%s|%s", new Object[] { id, name });
    }

    public String getName() {
        return name;
    }

    public String setName(String name) {
        this.name = name;
        if (player != null) {
            player.setUsername(name);
        }
        return this.getName();
    }

    public int getID() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
        if (player != null) {
            this.id = player.getPlayerID();
            this.name = player.getUsername();
        }
    }

    /**
     * Save the player model data using BitZero's DataModel system
     * This is the preferred method for production use
     *
     * @param username The username to use as the key for the data model
     */
    @Override
    public void saveModel(String username) throws Exception {
        if (this.player == null) {
            throw new IllegalStateException("Player data is null in PlayerInfo, cannot save.");
        }

        // Sync the player data with PlayerInfo fields before saving
        if (this.player != null) {
            this.id = this.player.getPlayerID();
            this.name = this.player.getUsername();
        }

        try {
            Gson customGson = new GsonBuilder()
                    .registerTypeAdapter(Building.class, new BuildingTypeAdapter())
                    .create();

            String playerJson = customGson.toJson(this.player);
            System.err.println("PLAYER_INFO_DEBUG: Final JSON being sent to database: " + playerJson);
            String key = util.server.ServerUtil.getModelKeyName(this.getClass().getSimpleName(), username);
            System.out.println("Saving player data to BitZero system with key: " + key);
            util.database.DataHandler.set(key, playerJson);

            System.out.println("Player data successfully saved to BitZero system for player ID: " + username);
        } catch (Exception e) {
            System.err.println(
                    "Error saving player data to BitZero system for player ID " + username + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Load player model data using BitZero's DataModel system
     * This is the preferred method for production use
     *
     * @param username The username to use as the key for the data model
     * @return PlayerInfo object containing the loaded player data, or null if
     *         failed
     */
    public static PlayerInfo getModelFromDatabase(String username) {
        try {
            String key = util.server.ServerUtil.getModelKeyName(PlayerInfo.class.getSimpleName(), username);
            System.out.println("fetch player data from BitZero system for player ID: " + key);
            String playerJson = (String) util.database.DataHandler.get(key);

            if (playerJson == null) {
                System.out.println("No player data found in BitZero system for player ID: " + username);
                return null;
            }


            Gson customGson = new GsonBuilder()
                    .registerTypeAdapter(Building.class, new BuildingTypeAdapter())
                    .create();
            Player loadedPlayer;
            if (playerJson.contains("\"player\":")) {
                System.out.println("Detected old format JSON with nested player object");
                JsonParser parser = new JsonParser();
                JsonObject jsonObject = parser.parse(playerJson).getAsJsonObject();
                JsonObject playerObject = jsonObject.getAsJsonObject("player");
                loadedPlayer = customGson.fromJson(playerObject, Player.class);
            } else {
                System.out.println("Loading direct Player object");
                loadedPlayer = customGson.fromJson(playerJson, Player.class);
            }

            PlayerInfo playerInfo = new PlayerInfo(loadedPlayer);

            System.out.println("Player data loaded. PlayerInfo name: " + playerInfo.getName() + ", Player object: "
                    + (loadedPlayer != null ? "not null" : "null"));
            return playerInfo;
        } catch (Exception e) {
            System.err.println(
                    "Error loading player data from BitZero system for player ID " + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Save the player model data to a JSON file (for testing/debugging)
     * * @param filePath The file path where to save the player data
     */
    public void saveModelToFile(String filePath) {
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(Building.class, new BuildingTypeAdapter())
                .create();

        if (this.player == null) {
            System.err.println("Player data is null in PlayerInfo, cannot save.");
            return;
        }

        try {
            File file = new File(filePath);
            if (file.getParentFile() != null) {
                file.getParentFile().mkdirs();
            }

            try (FileWriter writer = new FileWriter(file)) {
                gson.toJson(this.player, writer);
            }

            System.out.println("Player data successfully saved to file: " + filePath);
        } catch (IOException e) {
            System.err.println("Error saving player data to " + filePath + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Load player model data from a JSON file
     * * @param filePath The file path from where to load the player data
     * 
     * @return PlayerInfo object containing the loaded player data, or null if
     *         failed
     */
    public static PlayerInfo getModelFromJSON(String filePath) {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Building.class, new BuildingTypeAdapter())
                .create();

        File file = new File(filePath);

        if (!file.exists()) {
            System.err.println("Error loading player data: File not found at " + filePath);
            return null;
        }

        try {
            Player loadedPlayer;
            try (FileReader reader = new FileReader(file)) {
                loadedPlayer = gson.fromJson(reader, Player.class);
            }

            PlayerInfo playerInfo = new PlayerInfo(loadedPlayer);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "Player data loaded from file: " + filePath + ", Player ID: " + playerInfo.getID()
                            + ", Username: " + playerInfo.getName());
            return playerInfo;
        } catch (IOException e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Error loading player data from file: " + filePath + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Convenience method for saving with player ID as filename (file-based)
     * * @param playerID The player ID to use in the filename
     */
    public void saveModelToFile(int playerID) {
        String filePath = "playerdata/player_" + playerID + ".json";
        saveModelToFile(filePath);
    }

    /**
     * Convenience method for loading with player ID as filename (file-based)
     * * @param playerID The player ID to use in the filename
     * 
     * @return PlayerInfo object or null if failed
     */
    public static PlayerInfo getModelFromFile(int playerID) {
        String filePath = "playerdata/player_" + playerID + ".json";
        return getModelFromJSON(filePath);
    }

    /**
     * Create a new PlayerInfo with initialized Player data using game config
     * defaults
     * This is useful for new player registration
     * * @param playerID The unique player ID
     * 
     * @param username The player's username
     * @return A new PlayerInfo with default game data
     */
    public static PlayerInfo createNewPlayer(int playerID, String username) { // Create default resources (can be
        // configured from game config if needed)
        Resources defaultResources = new Resources();
        defaultResources.setGold(1000);
        defaultResources.setOil(500);
        defaultResources.setGems(50); // Create initial obstacles for new player
        java.util.List<model.Obstacle> initialObstacles = createInitialObstacles();

        // Create comprehensive player object
        Player newPlayer = new Player(
                playerID,
                System.currentTimeMillis(),
                username,
                750, // Starting prestige
                defaultResources,
                new java.util.ArrayList<>(), // Empty buildings list to start
                new java.util.ArrayList<>() // Empty troops list to start
        );

        // Add new player to matchmaking pool
        MatchmakingPool pool = MatchmakingPool.getInstance();
        pool.addPlayer(playerID, username, 750);
        pool.save();

        // Set initial obstacles for the new player
        newPlayer.setObstacles(initialObstacles);

        // Create PlayerInfo wrapper
        PlayerInfo playerInfo = new PlayerInfo(newPlayer);

        System.out.println("Created new player: " + playerID + " (" + username + ") with "
                + initialObstacles.size() + " obstacles");
        return playerInfo;
    }

    /**
     * Create a new PlayerInfo using PlayerData configuration (from game config)
     * This method integrates with the existing game configuration system
     * * @param playerID The unique player ID
     * 
     * @param username   The player's username
     * @param playerData The PlayerData configuration to use for initial values
     * @return A new PlayerInfo with config-based default data
     */
    public static PlayerInfo createNewPlayerFromConfig(int playerID, String username,
            config.data.PlayerData playerData) {
        // Create resources from config
        Resources configResources = new Resources();
        java.util.List<model.building.Building> initialBuildings = createInitialBuildings();
        java.util.List<model.Obstacle> initialObstacles = createInitialObstacles();

        Player newPlayer = new Player(
                playerID,
                System.currentTimeMillis(),
                username,
                750,
                configResources,
                initialBuildings,
                new java.util.ArrayList<>());

        // Add new player to matchmaking pool
        MatchmakingPool pool = MatchmakingPool.getInstance();
        pool.addPlayer(playerID, username, 750);
        pool.save();

        // Set initial obstacles for the new player
        newPlayer.setObstacles(initialObstacles);

        if (playerData != null) {
            configResources.setGold(playerData.getGold());
            configResources.setOil(playerData.getOil());
            configResources.setGems(playerData.getGem());
        } else {
            configResources.setGold(1000);
            configResources.setOil(500);
            configResources.setGems(50);
        }

        // Create PlayerInfo wrapper
        PlayerInfo playerInfo = new PlayerInfo(newPlayer);
        System.out.println("Created new player from config: " + playerID + " (" + username + ") with "
                + configResources.getGold() + " gold, " + initialBuildings.size() + " buildings, and "
                + initialObstacles.size() + " obstacles");
        return playerInfo;
    }

    /**
     * Safe method to get or create PlayerInfo from database
     * This is the recommended method for handlers to use
     * * @param playerID The player ID to load
     * 
     * @param username Fallback username if creating new player
     * @return PlayerInfo object (either loaded or newly created)
     */
    public static PlayerInfo getOrCreatePlayer(int playerID, String username) {
        PlayerInfo playerInfo = getModelFromDatabase(String.valueOf(playerID));
        if (playerInfo == null) {
            System.out.println("Player " + playerID + " not found in database, creating new player");
            playerInfo = createNewPlayer(playerID, username);
        }
        return playerInfo;
    }

    /**
     * Safe method to get or create PlayerInfo from database using game config
     * This integrates with the existing configuration system
     * * @param playerID The player ID to load
     * 
     * @param username   Fallback username if creating new player
     * @param playerData Game configuration for new players
     * @return PlayerInfo object (either loaded or newly created)
     */
    public static PlayerInfo getOrCreatePlayerFromConfig(int playerID, String username,
            config.data.PlayerData playerData) {
        PlayerInfo playerInfo = getModelFromDatabase(String.valueOf(playerID));
        if (playerInfo == null) {
            System.out.println("Player " + playerID + " not found in database, creating new player from config");
            playerInfo = createNewPlayerFromConfig(playerID, username, playerData);
        }
        return playerInfo;
    }

    /**
     * Update the player's logout time to current time
     * Call this when player disconnects or logs out
     */
    public void updateLogoutTime() {
        if (this.player != null) {
            this.player.setLogoutTime(System.currentTimeMillis());
        }
    }

    /**
     * Check if this PlayerInfo has valid player data
     * * @return true if player data is present and valid
     */
    public boolean hasValidPlayerData() {
        return this.player != null && this.player.getPlayerID() >= 0;
    }

    /**
     * Get a summary string of the player's current state (for logging/debugging)
     * * @return A formatted string with key player information
     */
    public String getPlayerSummary() {
        if (this.player == null) {
            return "PlayerInfo{player=null}";
        }

        Resources res = this.player.getResources();
        return String.format("PlayerInfo{id=%d, username='%s', gold=%d, oil=%d, gems=%d, buildings=%d, troops=%d}",
                this.player.getPlayerID(),
                this.player.getUsername(),
                res != null ? res.getGold() : 0,
                res != null ? res.getOil() : 0,
                res != null ? res.getGems() : 0,
                this.player.getBuildings() != null ? this.player.getBuildings().size() : 0,
                this.player.getArmy() != null ? this.player.getArmy().size() : 0);
    }

    /**
     * Creates the initial buildings for a new player based on InitGame
     * configuration
     * * @return List of initialized buildings
     */
    private static java.util.List<model.building.Building> createInitialBuildings() {
        java.util.List<model.building.Building> buildings = new java.util.ArrayList<>();

        try {
            // Get building locations from InitGame configuration
            config.ConfigManager configManager = config.ConfigManager.getInstance();
            config.data.InitGameConfig initGameConfig = configManager.getInitialGameConfigs();
            java.util.Map<String, config.data.BuildingLocationData> buildingLocations = initGameConfig
                    .getBuildingLocations();

            // Create buildings based on their types and positions
            int buildingIndex = 0;
            for (java.util.Map.Entry<String, config.data.BuildingLocationData> entry : buildingLocations.entrySet()) {
                String buildingID = entry.getKey();
                config.data.BuildingLocationData locationData = entry.getValue();
                model.util.Position position = new model.util.Position(locationData.getPosX(), locationData.getPosY());

                model.building.Building building = null;

                // Create specific building types based on building ID
                if (buildingID.startsWith("TOW_")) {
                    // Town Hall
                    building = new model.building.TownHall(
                            buildingIndex,
                            buildingID,
                            1,
                            position,
                            model.enums.BuildingOperationalState.OPERATING,
                            5000 // Starting amount for town hall
                    );
                } else if (buildingID.startsWith("AMC_")) {
                    // Army Camp
                    building = new model.building.ArmyCamp(
                            buildingIndex,
                            buildingID,
                            1,
                            position,
                            model.enums.BuildingOperationalState.OPERATING,
                            new java.util.ArrayList<>());
                } else if (buildingID.startsWith("RES_")) {
                    Map<String, Map<Integer, config.data.ResourceGeneratorData>> resourceGeneratorMap = configManager
                            .getBuildingConfigs().getResourceGeneratorMap();
                    Map<Integer, config.data.ResourceGeneratorData> generatorLevels = resourceGeneratorMap
                            .get(buildingID);
                    if (generatorLevels != null && generatorLevels.get(1) != null) {
                        config.data.ResourceGeneratorData genData = generatorLevels.get(1);
                        building = new model.building.ResourceGenerator(
                                buildingIndex,
                                buildingID,
                                1,
                                position,
                                model.enums.BuildingOperationalState.OPERATING,
                                0,
                                false,
                                model.enums.ResourceGeneratorStatus.GENERATING,
                                genData.getProductivity(),
                                genData.getBaseCapacity(),
                                genData.getResourceGenerate());
                    } else {
                        System.err
                                .println("Warning: No config found for resource generator " + buildingID + " level 1");
                        // Fallback to default values
                        building = new model.building.ResourceGenerator(
                                buildingIndex,
                                buildingID,
                                1,
                                position,
                                model.enums.BuildingOperationalState.OPERATING,
                                0,
                                false,
                                model.enums.ResourceGeneratorStatus.GENERATING,
                                0,
                                0,
                                config.data.ResourceType.GOLD);
                    }
                } else if (buildingID.startsWith("BDH_")) {
                    // Builder Hut
                    building = new model.building.BuilderHut(
                            buildingIndex,
                            buildingID,
                            1,
                            position,
                            model.enums.BuildingOperationalState.OPERATING,
                            true,
                            null);
                } else if (buildingID.startsWith("BAR_")) {
                    // Barrack
                    building = new model.building.Barrack(
                            buildingIndex,
                            buildingID,
                            1,
                            position,
                            model.enums.BuildingOperationalState.OPERATING);
                } else {
                    System.out.println(
                            "Warning: Unknown building type: " + buildingID + ", creating as generic building");
                    // Create a generic building - this shouldn't happen with proper config
                    building = new model.building.ClanCastle(
                            buildingIndex,
                            buildingID,
                            1,
                            position,
                            model.enums.BuildingOperationalState.OPERATING);
                }

                if (building != null) {
                    buildings.add(building);
                    buildingIndex++;
                }
            }

            System.out.println("Created " + buildings.size() + " initial buildings for new player");

        } catch (Exception e) {
            System.err.println("Error creating initial buildings: " + e.getMessage());
            e.printStackTrace();
            // Return empty list if initialization fails
        }
        return buildings;
    }

    /**
     * Creates the initial obstacles for a new player based on InitGame
     * configuration
     * * @return List of initialized obstacles
     */
    private static java.util.List<model.Obstacle> createInitialObstacles() {
        java.util.List<model.Obstacle> obstacles = new java.util.ArrayList<>();

        try {
            // Get obstacle data from InitGame configuration
            config.ConfigManager configManager = config.ConfigManager.getInstance();
            config.data.InitGameConfig initGameConfig = configManager.getInitialGameConfigs();
            java.util.Map<Integer, config.data.ObstacleData> obstacleData = initGameConfig.getObstacleData();
            int obstacleIndex = 0;
            for (java.util.Map.Entry<Integer, config.data.ObstacleData> entry : obstacleData.entrySet()) {
                // Integer obstacleKey = entry.getKey();
                config.data.ObstacleData obstacleConfig = entry.getValue();

                // Use the obstacle type directly as the ID (obstacleIndex provides uniqueness)
                String obstacleID = obstacleConfig.getType();
                model.util.Position position = new model.util.Position(
                        obstacleConfig.getPosX(),
                        obstacleConfig.getPosY());

                // Create obstacle instance - initially not removed
                model.Obstacle obstacle = new model.Obstacle(
                        obstacleIndex,
                        obstacleID,
                        obstacleConfig.getType(),
                        position,
                        false // isRemoved = false initially
                );

                obstacles.add(obstacle);
                obstacleIndex++;
            }

            System.out.println("Created " + obstacles.size() + " initial obstacles for new player");

        } catch (Exception e) {
            System.err.println("Error creating initial obstacles: " + e.getMessage());
            e.printStackTrace();
            // Return empty list if initialization fails
        }

        return obstacles;
    }
}
