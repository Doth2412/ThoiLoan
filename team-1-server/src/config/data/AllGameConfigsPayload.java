package config.data;

/**
 * Master container class for all game configurations that need to be sent to
 * the client.
 * This class consolidates all individual configuration objects into a single
 * payload
 * for the RECEIVE_CONFIG event.
 */
public class AllGameConfigsPayload {
    // Core configuration objects from the existing system
    public BuildingConfig buildingConfig;
    public DungeonConfig dungeonConfig;
    public TroopConfig troopConfig;
    public ResourceConfig resourceConfig;
    public InitGameConfig initGameConfig;

    /**
     * Default constructor
     */
    public AllGameConfigsPayload() {
        this.buildingConfig = null;
        this.dungeonConfig = null;
        this.troopConfig = null;
        this.resourceConfig = null;
        this.initGameConfig = null;
    }

    /**
     * Constructor with all core configurations
     */
    public AllGameConfigsPayload(BuildingConfig buildingConfig,
            DungeonConfig dungeonConfig,
            TroopConfig troopConfig,
            ResourceConfig resourceConfig,
            InitGameConfig initGameConfig) {
        this.buildingConfig = buildingConfig;
        this.dungeonConfig = dungeonConfig;
        this.troopConfig = troopConfig;
        this.resourceConfig = resourceConfig;
    }

    // Getters and setters for all fields
    public BuildingConfig getBuildingConfig() {
        return buildingConfig;
    }

    public void setBuildingConfig(BuildingConfig buildingConfig) {
        this.buildingConfig = buildingConfig;
    }

    public DungeonConfig getDungeonConfig() {
        return dungeonConfig;
    }

    public void setDungeonConfig(DungeonConfig dungeonConfig) {
        this.dungeonConfig = dungeonConfig;
    }

    public TroopConfig getTroopConfig() {
        return troopConfig;
    }

    public void setTroopConfig(TroopConfig troopConfig) {
        this.troopConfig = troopConfig;
    }

    public ResourceConfig getResourceConfig() {
        return resourceConfig;
    }

    public void setResourceConfig(ResourceConfig resourceConfig) {
        this.resourceConfig = resourceConfig;
    }

    @Override
    public String toString() {
        return "AllGameConfigsPayload{" +
                "buildingConfig=" + buildingConfig +
                ", dungeonConfig=" + dungeonConfig +
                ", troopConfig=" + troopConfig +
                ", resourceConfig=" + resourceConfig + ", initGameConfig=" + initGameConfig +
                '}';
    }
}
