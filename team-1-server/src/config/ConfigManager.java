package config;

import config.data.*;

/**
 * Manager class for all game configuration data
 */
public class ConfigManager {
    private TroopConfig troopConfigs;
    private BuildingConfig buildingConfigs;
    private InitGameConfig initialGameConfigs;
    private DungeonConfig dungeonConfigs;
    private ResourceConfig resourceConfigs;
    private ConfigAction configAction;

    private static ConfigManager instance;

    public static ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager(new ConfigAction());
        }
        return instance;
    }

    /**
     * Constructor with ConfigAction
     * 
     * @param configAction The ConfigAction for loading/saving configurations
     */
    public ConfigManager(ConfigAction configAction) {
        this.configAction = configAction;
        this.buildingConfigs = new BuildingConfig();
        this.initialGameConfigs = new InitGameConfig();
        this.troopConfigs = new TroopConfig();
        this.dungeonConfigs = new DungeonConfig();
        this.resourceConfigs = new ResourceConfig();

        loadAllConfigurations();
    }

    /**
     * Load all configurations from JSON files
     */
    public void loadAllConfigurations() {
        loadBuildingConfigs();
        loadInitialGameConfig();
        loadTroopConfigs();
        loadDungeonConfigs();
        loadResourceConfigs();
    }

    /**
     * Load building configuration files
     */
    private void loadBuildingConfigs() {
        // Load Storage data
        this.buildingConfigs.setResourceStorageMap(
                configAction.loadResourceStorageData(configPath.STORAGE_JSON));

        // Load ArmyCamp data
        this.buildingConfigs.setArmyCampDataMap(
                configAction.loadArmyCampData(configPath.ARMY_CAMP_JSON));

        // Load TownHall data
        this.buildingConfigs.setTownHallDataMap(
                configAction.loadTownHallData(configPath.TOWN_HALL_JSON));

        // Load Barrack data
        this.buildingConfigs.setBarrackDataMap(
                configAction.loadBarrackData(configPath.BARRACK_JSON));

        // Load Defensive building data
        this.buildingConfigs.setDefensiveBuildingDataMap(
                configAction.loadDefensiveBuildingData(configPath.DEFENCE_JSON));

        // Load Builder Hut data
        this.buildingConfigs.setBuilderHutDataMap(
                configAction.loadBuilderHutData(configPath.BUILDER_HUT_JSON));

        // Load Obstacle data
        this.buildingConfigs.setObstacleDataMap(
                configAction.loadObstacleData(configPath.OBSTACLE_JSON));

        this.buildingConfigs.setResourceGeneratorMap(
                configAction.loadResourceGeneratorData(configPath.RESOURCE_JSON));
    }

    private void loadInitialGameConfig() {
        this.initialGameConfigs = configAction.loadInitialGameConfig(configPath.INIT_GAME_JSON);
    }

    private void loadTroopConfigs() {
        // Load troop base data
        this.troopConfigs.setTroopBaseDataMap(
                configAction.loadTroopBaseData(configPath.TROOP_BASE_JSON));

        // Load troop upgrade data
        this.troopConfigs.setTroopDataMap(
                configAction.loadTroopData(configPath.TROOP_JSON));
    }

    private void loadDungeonConfigs() {
        // this.dungeonConfigs = configAction.getDataFromConfig(this.dungeonConfigs,
        // "Config json/Dungeon.json");
        this.dungeonConfigs = configAction.loadAllDungeonMaps(configPath.CONFIG_DUNGEON_FOLDER);
    }

    private void loadResourceConfigs() {
        // Assuming Resource.json contains all resource data directly under
        // ResourceConfig
        this.resourceConfigs = configAction.getDataFromConfig(this.resourceConfigs, configPath.RESOURCE_JSON);
    }

    /**
     * Get troop configurations
     * 
     * @return TroopConfig object
     */
    public TroopConfig getTroopConfigs() {
        return troopConfigs;
    }

    /**
     * Get initial game configurations
     * 
     * @return InitGameConfig object
     */
    public InitGameConfig getInitialGameConfigs() {
        return initialGameConfigs;
    }

    /**
     * Get building configurations
     * 
     * @return BuildingConfig object
     */
    public BuildingConfig getBuildingConfigs() {
        return buildingConfigs;
    }

    /**
     * Get dungeon configurations
     * 
     * @return DungeonConfig object
     */
    public DungeonConfig getDungeonConfigs() {
        return dungeonConfigs;
    }

    /**
     * Get resource configurations
     * 
     * @return ResourceConfig object
     */
    public ResourceConfig getResourceConfigs() {
        return resourceConfigs;
    }

    /**
     * Get configuration data by class type
     * 
     * @param <T>         The type of configuration class
     * @param configClass The class token for the configuration type
     * @return The configuration object of type T
     */
    @SuppressWarnings("unchecked")
    public <T> T getDataFromConfig(Class<T> configClass) {
        if (configClass.isAssignableFrom(BuildingConfig.class)) {
            return (T) this.buildingConfigs;
        } else if (configClass.isAssignableFrom(InitGameConfig.class)) {
            return (T) this.initialGameConfigs;
        } else if (configClass.isAssignableFrom(TroopConfig.class)) {
            return (T) this.troopConfigs;
        } else if (configClass.isAssignableFrom(DungeonConfig.class)) {
            return (T) this.dungeonConfigs;
        } else if (configClass.isAssignableFrom(ResourceConfig.class)) {
            return (T) this.resourceConfigs;
        }
        return null;
    }
}