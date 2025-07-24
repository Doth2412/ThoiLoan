package config;

import config.data.AllGameConfigsPayload;

/**
 * Service class responsible for creating and populating AllGameConfigsPayload
 * objects
 * for sending consolidated game configurations to clients via RECEIVE_CONFIG
 * event.
 */
public class ConfigProviderService {

    private final ConfigManager configManager;

    /**
     * Constructor that accepts a ConfigManager instance
     * 
     * @param configManager The ConfigManager containing all loaded configurations
     */
    public ConfigProviderService(ConfigManager configManager) {
        this.configManager = configManager;
    }

    /**
     * Default constructor that uses the singleton ConfigManager instance
     */
    public ConfigProviderService() {
        this.configManager = ConfigManager.getInstance();
    }

    /**
     * Creates and populates an AllGameConfigsPayload object with all current game
     * configurations.
     * This method retrieves pre-loaded configuration objects from ConfigManager and
     * consolidates
     * them into a single payload object for client transmission.
     * 
     * @return AllGameConfigsPayload object populated with all game configurations
     */
    public AllGameConfigsPayload getMasterConfigPayload() {
        // Create new payload instance
        AllGameConfigsPayload payload = new AllGameConfigsPayload();

        // Populate with individual config objects from ConfigManager
        // These objects are already parsed from JSON and readily available
        payload.setBuildingConfig(configManager.getBuildingConfigs());
        payload.setDungeonConfig(configManager.getDungeonConfigs());
        payload.setTroopConfig(configManager.getTroopConfigs());
        payload.setResourceConfig(configManager.getResourceConfigs());
        // payload.setInitGameConfig(configManager.getInitialGameConfigs());

        return payload;
    }
}
