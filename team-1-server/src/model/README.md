# PlayerInfo Model Documentation

## Overview

The `PlayerInfo` class serves as the main PlayerModel container for the game server, providing comprehensive player data management with both BitZero server integration and file-based operations for testing. This system handles serialization and deserialization of complex player game state including buildings, troops, resources, and more.

## Key Components

### Core Classes

- **`PlayerInfo`** - Main container class extending `DataModel`
- **`Player`** - Comprehensive player data holder
- **`Building`** - Abstract base class with polymorphic subclasses
- **`Resources`** - Player's gold, oil, and gems
- **`Troop`** - Individual troop instances
- **`TroopBuildRequest`** - Pending troop construction requests

### Supporting Infrastructure

- **`BuildingDeserializer`** - Custom Gson deserializer for polymorphic Building objects
- **`Position`** - Utility class for 2D coordinates
- **Various Enums** - Building states, task types, etc.

## Data Structure

### What Gets Saved/Loaded

When you save a `PlayerInfo` object, it includes:

```
PlayerInfo
├── Player
│   ├── playerID (int)
│   ├── sessionKey (long)
│   ├── username (String)
│   ├── logoutTime (long)
│   ├── prestige (int)
│   ├── resources (Resources)
│   │   ├── gold (int)
│   │   ├── oil (int)
│   │   └── gems (int)
│   ├── buildings (List<Building>)
│   │   ├── ResourceGenerator
│   │   ├── ResourceStorage
│   │   ├── TownHall
│   │   ├── DefensiveBuilding
│   │   ├── ArmyCamp
│   │   ├── Barrack
│   │   └── BuilderHut
│   └── troops (List<Troop>)
│       ├── troopIndex (int)
│       ├── troopID (int)
│       ├── trainingStartTime (long)
│       └── trainingEndTime (long)
└── Additional PlayerInfo fields (id, name, position)
```

### Building Polymorphism

The system supports different building types with specialized properties:

- **ResourceGenerator**: Generates resources over time
- **ResourceStorage**: Stores player resources
- **TownHall**: Central building with upgrade requirements
- **DefensiveBuilding**: Defensive structures with damage/range
- **ArmyCamp**: Houses trained troops
- **Barrack**: Produces troops with build queues
- **BuilderHut**: Manages construction workers

## Usage Guide

### 1. Saving Player Data to BitZero Server

#### Basic Save Operation

```java
// Create or get PlayerInfo instance
PlayerInfo playerInfo = new PlayerInfo(player);

// Save to BitZero server (production method)
try {
    playerInfo.saveModel(playerID);
    System.out.println("Player data saved successfully");
} catch (Exception e) {
    System.err.println("Failed to save player data: " + e.getMessage());
}
```

#### What Happens During Save:

1. Validates that player data is not null
2. Syncs PlayerInfo fields with Player object
3. Creates custom Gson with `BuildingDeserializer` for polymorphic serialization
4. Converts Player object to JSON string
5. Generates BitZero key using `ServerUtil.getModelKeyName()`
6. Stores JSON in BitZero using `DataHandler.set(key, json)`

### 2. Loading Player Data from BitZero Server

#### Basic Load Operation

```java
// Load existing player from BitZero server
PlayerInfo playerInfo = PlayerInfo.getModelFromDatabase(playerID);

if (playerInfo != null) {
    System.out.println("Player loaded: " + playerInfo.getPlayerSummary());
    Player player = playerInfo.getPlayer();
    // Use player data...
} else {
    System.out.println("No player data found for ID: " + playerID);
}
```

#### Safe Load with Fallback Creation

```java
// Recommended approach - loads existing or creates new player
PlayerInfo playerInfo = PlayerInfo.getOrCreatePlayer(playerID, username);

// Or with game config integration
PlayerInfo playerInfo = PlayerInfo.getOrCreatePlayerFromConfig(
    playerID, username, gameConfig.getPlayerData()
);
```

#### What Happens During Load:

1. Generates BitZero key using player ID
2. Retrieves JSON string from BitZero using `DataHandler.get(key)`
3. Creates custom Gson with `BuildingDeserializer`
4. Deserializes JSON back to Player object
5. Wraps Player in new PlayerInfo instance
6. Returns null if no data found

### 3. File-Based Operations (Testing/Debugging)

#### Save to File

```java
// Save to specific file path
playerInfo.saveModelToFile("/path/to/player_data.json");

// Save using player ID as filename (saves to playerdata/ directory)
playerInfo.saveModelToFile(playerID);
```

#### Load from File

```java
// Load from specific file path
PlayerInfo playerInfo = PlayerInfo.getModelFromJSON("/path/to/player_data.json");

// Load using player ID as filename
PlayerInfo playerInfo = PlayerInfo.getModelFromFile(playerID);
```

### 4. Creating New Players

#### Basic Player Creation

```java
// Create new player with default resources
PlayerInfo newPlayer = PlayerInfo.createNewPlayer(playerID, username);

// Create new player using game configuration
PlayerInfo newPlayer = PlayerInfo.createNewPlayerFromConfig(
    playerID, username, gameConfig.getPlayerData()
);
```

#### Default Resources for New Players

- **Gold**: 1000 (or from config)
- **Oil**: 500 (or from config)
- **Gems**: 50 (or from config)
- **Buildings**: Empty list (to be populated by game initialization)
- **Troops**: Empty list

## Integration with Existing System

### DataModel Integration

`PlayerInfo` extends `DataModel` and integrates with the existing BitZero framework:

```java
// PlayerInfo is a DataModel, so it can be used with standard patterns:
PlayerInfo playerInfo = new PlayerInfo(player);
playerInfo.saveModel(playerID);  // Saves to BitZero automatically
```

### Handler Integration Example

```java
public class PlayerDataHandler {

    public void handlePlayerLogin(int playerID, String username) {
        // Load or create player data
        PlayerInfo playerInfo = PlayerInfo.getOrCreatePlayer(playerID, username);

        // Update login time
        playerInfo.updateLogoutTime();

        // Save updated data
        try {
            playerInfo.saveModel(playerID);
        } catch (Exception e) {
            System.err.println("Failed to save player login data: " + e.getMessage());
        }
    }

    public void handlePlayerLogout(int playerID) {
        PlayerInfo playerInfo = PlayerInfo.getModelFromDatabase(playerID);
        if (playerInfo != null) {
            playerInfo.updateLogoutTime();
            try {
                playerInfo.saveModel(playerID);
            } catch (Exception e) {
                System.err.println("Failed to save player logout data: " + e.getMessage());
            }
        }
    }
}
```

## Best Practices

### 1. Production vs Testing

- **Production**: Use `saveModel()` and `getModelFromDatabase()` for BitZero server operations
- **Testing**: Use `saveModelToFile()` and `getModelFromJSON()` for file-based testing

### 2. Error Handling

```java
try {
    playerInfo.saveModel(playerID);
} catch (Exception e) {
    // Log error and handle gracefully
    System.err.println("Save failed: " + e.getMessage());
    // Potentially retry or use fallback mechanism
}
```

### 3. Data Validation

```java
// Check if PlayerInfo has valid data before operations
if (playerInfo.hasValidPlayerData()) {
    // Proceed with operations
    playerInfo.saveModel(playerID);
} else {
    System.err.println("Invalid player data, cannot save");
}
```

### 4. Resource Management

```java
// Update logout time before saving
playerInfo.updateLogoutTime();

// Get summary for logging
System.out.println("Saving: " + playerInfo.getPlayerSummary());
```

## Key Storage Format

### BitZero Key Format

```
Key: "PlayerInfo_<playerID>"
Value: JSON string containing serialized Player object
```

### File Storage Format

```
Path: "playerdata/player_<playerID>.json"
Content: Pretty-printed JSON with custom Building serialization
```

## JSON Structure Example

```json
{
  "playerID": 12345,
  "sessionKey": 1640995200000,
  "username": "PlayerName",
  "logoutTime": 1640995300000,
  "prestige": 100,
  "resources": {
    "gold": 5000,
    "oil": 2500,
    "gems": 150
  },
  "buildings": [
    {
      "type": "TownHall",
      "buildingIndex": 0,
      "level": 3,
      "position": { "x": 10, "y": 10 },
      "operationalState": "OPERATIONAL",
      "constructionStartTime": 0,
      "constructionEndTime": 0,
      "maxLevel": 10
    },
    {
      "type": "ResourceGenerator",
      "buildingIndex": 1,
      "level": 2,
      "position": { "x": 15, "y": 15 },
      "operationalState": "OPERATIONAL",
      "status": "GENERATING",
      "lastCollectionTime": 1640995200000,
      "resourceType": "GOLD",
      "generationRate": 100
    }
  ],
  "troops": [
    {
      "troopIndex": 0,
      "troopID": 1,
      "trainingStartTime": 1640995200000,
      "trainingEndTime": 1640995800000
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Null Player Data**: Always check `playerInfo.hasValidPlayerData()` before operations
2. **Serialization Errors**: Ensure all Building subclasses are properly registered in `BuildingDeserializer`
3. **BitZero Connection**: Verify `DataHandler` is properly initialized
4. **File Permissions**: Check write permissions for file-based operations

### Debugging

```java
// Enable detailed logging
System.out.println("Player summary: " + playerInfo.getPlayerSummary());

// Check individual components
Player player = playerInfo.getPlayer();
if (player != null) {
    System.out.println("Buildings count: " + player.getBuildings().size());
    System.out.println("Troops count: " + player.getTroops().size());
    System.out.println("Resources: " + player.getResources().toString());
}
```

## Dependencies

- **Gson 2.2.4**: JSON serialization/deserialization
- **BitZero Framework**: DataModel, DataHandler, ServerUtil
- **Java Standard Library**: File I/O operations

## Thread Safety

The `PlayerInfo` class is **not thread-safe**. If accessed from multiple threads, proper synchronization must be implemented at the application level.

## Performance Considerations

- JSON serialization/deserialization has moderate overhead
- BitZero operations are network-dependent
- File operations are I/O bound
- Consider caching frequently accessed player data in memory
