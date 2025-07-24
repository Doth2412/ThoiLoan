package config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import config.adapters.*;
import config.data.*;

import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

/**
 * Utility class for loading configuration data from JSON files
 */
public class ConfigAction {
    private Gson gson;

    /**
     * Default constructor
     */
    public ConfigAction() {
        GsonBuilder gsonBuilder = new GsonBuilder();

        gsonBuilder.registerTypeAdapter(TownHallData.class, new TownHallDataAdapter());
        gsonBuilder.registerTypeAdapter(ResourceGeneratorData.class, new ResourceGeneratorDataAdapter());
        gsonBuilder.registerTypeAdapter(BarrackData.class, new BarrackDataAdapter());
        gsonBuilder.registerTypeAdapter(ResourceStorageData.class, new ResourceStorageDataAdapter());
        gsonBuilder.registerTypeAdapter(ArmyCampData.class, new ArmyCampDataAdapter());
        gsonBuilder.registerTypeAdapter(BuilderHutData.class, new BuilderHutDataAdapter());
        gsonBuilder.registerTypeAdapter(DefensiveBuildingData.class, new DefensiveBuildingDataAdapter());
        gsonBuilder.registerTypeAdapter(ObstacleData.class, new ObstacleDataAdapter());

        this.gson = gsonBuilder.create();
        ;
    }

    /**
     * Get building configuration data from JSON file
     * 
     * @param config   The BuildingConfig object to populate
     * @param filePath The JSON file path
     * @return The populated BuildingConfig
     */
    public BuildingConfig getDataFromConfig(BuildingConfig config, String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, BuildingConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return config;
        }
    }

    /**
     * Get initial game configuration data from JSON file
     * 
     * @param config   The InitGameConfig object to populate
     * @param filePath The JSON file path
     * @return The populated InitGameConfig
     */
    public InitGameConfig getDataFromConfig(InitGameConfig config, String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, InitGameConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return config;
        }
    }

    /**
     * Get troop configuration data from JSON file
     * 
     * @param config   The TroopConfig object to populate
     * @param filePath The JSON file path
     * @return The populated TroopConfig
     */
    public TroopConfig getDataFromConfig(TroopConfig config, String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, TroopConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return config;
        }
    }

    /**
     * Get dungeon configuration data from JSON file
     * 
     * @param config   The DungeonConfig object to populate
     * @param filePath The JSON file path
     * @return The populated DungeonConfig
     */
    public DungeonConfig getDataFromConfig(DungeonConfig config, String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, DungeonConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            // Return the initial empty config or a new one if preferred
            return (config != null) ? config : new DungeonConfig();
        }
    }

    /**
     * Get resource configuration data from JSON file
     * 
     * @param config   The ResourceConfig object to populate
     * @param filePath The JSON file path
     * @return The populated ResourceConfig
     */
    public ResourceConfig getDataFromConfig(ResourceConfig config, String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, ResourceConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return config;
        }
    }

    /**
     * Load dungeon data from JSON file.
     * 
     * @param filePath The JSON file path.
     * @return The DungeonConfig.
     */
    public DungeonConfig loadDungeonData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, DungeonConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return new DungeonConfig(); // Return empty or default config on error
        }
    }

    /**
     * Load resource data from JSON file.
     * 
     * @param filePath The JSON file path.
     * @return The ResourceConfig.
     */
    public ResourceConfig loadResourceData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, ResourceConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResourceConfig(); // Return empty or default config on error
        }
    }

    // Methods for BuildingConfig parts
    public Map<String, Map<Integer, ResourceStorageData>> loadResourceStorageData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, ResourceStorageData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Or an empty map
        }
    }

    public Map<String, Map<Integer, ArmyCampData>> loadArmyCampData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, ArmyCampData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, TownHallData>> loadTownHallData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, TownHallData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, BarrackData>> loadBarrackData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, BarrackData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, DefensiveBuildingData>> loadDefensiveBuildingData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, DefensiveBuildingData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, BuilderHutData>> loadBuilderHutData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, BuilderHutData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, ObstacleData>> loadObstacleData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, ObstacleData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, ResourceGeneratorData>> loadResourceGeneratorData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, ResourceGeneratorData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Method for InitialGameConfig
    public InitGameConfig loadInitialGameConfig(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, InitGameConfig.class);
        } catch (IOException e) {
            e.printStackTrace();
            return new InitGameConfig(); // Return empty or default config on error
        }
    }

    // Methods for TroopConfig parts
    public Map<String, TroopData> loadTroopBaseData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, TroopData>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Map<Integer, TroopData>> loadTroopData(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Type type = new TypeToken<Map<String, Map<Integer, TroopData>>>() {
            }.getType();
            return gson.fromJson(reader, type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public DungeonConfig loadAllDungeonMaps(String directoryPath) {
        DungeonConfig dungeonConfig = new DungeonConfig();
        java.io.File directory = new java.io.File(directoryPath);
        java.io.File[] files = directory.listFiles();
        if (files != null) {
            for (java.io.File file : files) {
                if (file.isFile() && file.getName().endsWith(".map")) {
                    try (FileReader reader = new FileReader(file)) {
                        DungeonMap dungeonMap = gson.fromJson(reader, DungeonMap.class);
                        dungeonConfig.addDungeonMap(file.getName(), dungeonMap);
                    } catch (IOException | com.google.gson.JsonSyntaxException e) {
                        System.err.println("Error loading dungeon map: " + file.getName());
                        e.printStackTrace();
                    }
                }
            }
        }
        return dungeonConfig;
    }

}