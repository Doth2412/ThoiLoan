# Configuration System Usage Guide

This document explains how to use the configuration parsing system in the game, which includes the `ConfigAction` and `ConfigManager` classes. This system is designed to load game configuration data from JSON files into Java objects, allowing easy access and management of game settings, troop data, building information, dungeon configurations, resource data, and more.

## Getting the ConfigManager Instance

The ConfigManager class is implemented as a singleton, ensuring only one instance exists throughout the application. To get this instance, use the getInstance() method:

```
ConfigManager configManager = ConfigManager.getInstance();
```

This returns the singleton instance of `ConfigManager`, which automatically loads all configuration data from the specified JSON files during initialization.

## Accessing Configuration Data

The ConfigManager provides getter methods to access various configuration objects:

- getTroopConfigs(): Returns the TroopConfig object containing troop-related data.
- getBuildingConfigs(): Returns the BuildingConfig object containing building-related data.
- getInitialGameConfigs(): Returns the InitGameConfig object containing initial game settings.
- getDungeonConfigs(): Returns the DungeonConfig object containing dungeon-related data.
- getResourceConfigs(): Returns the ResourceConfig object containing resource-related data.

Each configuration object contains maps or lists of data that can be accessed using their respective getter methods.

## Examples

### Example 1: Accessing Troop Data

To retrieve the base data for a specific troop, such as "Archer":

```
TroopConfig troopConfig = configManager.getTroopConfigs();
Map<String, TroopData> troopBaseDataMap = troopConfig.getTroopBaseDataMap();
TroopData archerData = troopBaseDataMap.get("Archer");

if (archerData != null) {
    System.out.println("Archer's attack power: " + archerData.getAttackPower());
    // Assuming TroopData has a getAttackPower() method
}
```

### Example 2: Accessing Building Data

To get the data for a specific building, such as "TownHall" at level 1:

```
BuildingConfig buildingConfig = configManager.getBuildingConfigs();
Map<String, Map<Integer, TownHallData>> townHallDataMap = buildingConfig.getTownHallDataMap();
Map<Integer, TownHallData> townHallLevels = townHallDataMap.get("TownHall");

if (townHallLevels != null) {
TownHallData level1Data = townHallLevels.get(1);
    if (level1Data != null) {
    System.out.println("TownHall level 1 hit points: " + level1Data.getHitPoints());
    // Assuming TownHallData has a getHitPoints() method
    }
}
```

### Example 3: Accessing Initial Game Settings

To access the initial player data:

```
InitGameConfig initGameConfig = configManager.getInitialGameConfigs();
PlayerData playerData = initGameConfig.getPlayerData();
System.out.println("Initial gold: " + playerData.getGold());
// Assuming PlayerData has a getGold() method
```

### Example 4: Accessing Resource Data

To get the default gold amount from the resource configuration:

```
ResourceConfig resourceConfig = configManager.getResourceConfigs();
int defaultGold = resourceConfig.getDefaultGold();
System.out.println("Default gold amount: " + defaultGold);
```

## Saving Configurations

To save changes made to the configuration data back to JSON files, use the saveAllConfigurations method of ConfigManager. This method takes a directory path where the JSON files will be saved:

```
configManager.saveAllConfigurations("path/to/output/directory/");
```

This saves all configuration data to separate JSON files (e.g., building_config.json, troop_config.json) in the specified directory.
Note: Ensure the directory exists and the application has write permissions to it.

## Important Notes

- File Structure: The JSON files must be correctly formatted and match the structure expected by the configuration classes (e.g., TroopConfig, BuildingConfig). Any mismatch may result in deserialization errors or null values.

- Handling: The current implementation prints stack traces for IOExceptions. For production use, implement more robust error handling to manage file loading or saving failures gracefully.

- Thread Safety: As ConfigManager is a singleton, take care when accessing or modifying configuration data from multiple threads to prevent concurrency issues.

- Configuration Reloading: To reload configurations at runtime (e.g., after modifying JSON files), you can call loadAllConfigurations() on the ConfigManager instance:
  configManager.loadAllConfigurations();

- Default File Paths: The system loads configurations from hardcoded paths (e.g., "Config json/TroopBase.json"). Ensure these files exist in the correct location relative to your application's working directory.
