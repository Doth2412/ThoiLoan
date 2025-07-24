# Codebase Summary

## Project Overview

This project is a game server for a mobile game that appears to be a clone of Clash of Clans. The server is built using the BitZero server framework and handles game logic such as player authentication, map management, resource management, troops, and battles.

## Core Components

### `cmd`

This package contains the command definitions and data transfer objects (DTOs) used for communication between the client and the server.

*   **`CmdDefine.java`**: Defines all the command IDs for the client-server communication.
*   **`ErrorConst.java`**: Defines error codes that are sent to the client.

#### `cmd/receive`

This package contains the DTOs for the requests received from the client. Each class in this package extends `BaseCmd` and is responsible for unpacking the data from the `DataCmd` object.

*   **`authen`**: Contains request objects related to authentication.
    *   `RequestGetData.java`: Request to get user data.
    *   `RequestLogin.java`: Request to log in to the server.
*   **`battle`**: Contains request objects related to battles.
    *   `RequestBattleResult.java`: Request to submit the result of a battle.
    *   `RequestFindBattle.java`: Request to find an opponent for a battle.
*   **`demo`**: Contains request objects for a demo feature.
    *   `RequestMove.java`: Request to move a character in the demo.
    *   `RequestSetName.java`: Request to set the name of a character in the demo.
*   **`map`**: Contains request objects related to the game map.
    *   `RequestBuyBuilding.java`: Request to buy a new building.
    *   `RequestCancelBuyBuilding.java`: Request to cancel the construction of a building.
    *   `RequestMoveBuilding.java`: Request to move a building to a new position.
    *   `RequestRemoveObstacle.java`: Request to remove an obstacle from the map.
    *   `RequestRemoveObstacleComplete.java`: Request to complete the removal of an obstacle.
    *   `RequestUpgradeBuilding.java`: Request to upgrade a building.
    *   `RequestUpgradeBuildingComplete.java`: Request to complete the upgrade of a building.
*   **`resources`**: Contains request objects related to player resources.
    *   `RequestHarvestResource.java`: Request to harvest resources from a resource generator.
    *   `RequestUseG.java`: Request to use gems (premium currency).
*   **`troops`**: Contains request objects related to player troops.
    *   `RequestUpdateBarrackQueue.java`: Request to update the troop training queue in a barrack.
    *   `RequestUpdatePlayerArmy.java`: Request to update the player's army composition.
*   **`user`**: Contains request objects related to user information.
    *   `RequestPlayedGame.java`: Request to indicate that the user has played the game.
    *   `RequestUserInfo.java`: Request to get user information.
    *   `RequestWriteStatus.java`: Request to write a status message.

#### `cmd/send`

This package contains the DTOs for the responses sent to the client. Each class in this package extends `BaseMsg` and is responsible for packing the data into a `ByteBuffer`.

*   **`authen`**: Contains response objects related to authentication.
    *   `ResponseMultiDeviceLogin.java`: Response to notify the client that the account has been logged in on another device.
*   **`battle`**: Contains response objects related to battles.
    *   `ResponseBattleResult.java`: Response containing the result of a battle.
    *   `ResponseFindBattle.java`: Response containing information about a found opponent.
*   **`demo`**: Contains response objects for a demo feature.
    *   `ResponseGetName.java`: Response containing the name of a character in the demo.
    *   `ResponseMove.java`: Response containing the new position of a character in the demo.
    *   `ResponseRequestUserInfo.java`: Response containing user information for the demo.
    *   `ResponseSetName.java`: Response confirming that the character name has been set.
*   **`map`**: Contains response objects related to the game map.
    *   `ResponseBuildComplete.java`: Response confirming that a building has been completed.
    *   `ResponseBuyBuilding.java`: Response confirming that a building has been purchased.
    *   `ResponseCancelBuyBuilding.java`: Response confirming that the construction of a building has been canceled.
    *   `ResponseMoveBuilding.java`: Response confirming that a building has been moved.
    *   `ResponseRemoveObstacle.java`: Response confirming that an obstacle has been removed.
    *   `ResponseRemoveObstacleComplete.java`: Response confirming that the removal of an obstacle has been completed.
    *   `ResponseUpgradeBuilding.java`: Response confirming that a building has been upgraded.
    *   `ResponseUpgradeBuildingComplete.java`: Response confirming that the upgrade of a building has been completed.
*   **`resources`**: Contains response objects related to player resources.
    *   `ResponseHarvestResource.java`: Response containing the amount of harvested resources.
    *   `ResponseUseG.java`: Response confirming that gems have been used.
*   **`troops`**: Contains response objects related to player troops.
    *   `ResponseUpdateBarrackQueue.java`: Response containing the updated troop training queue.
    *   `ResponseUpdatePlayerArmy.java`: Response containing the updated player army.
*   **`user`**: Contains response objects related to user information.
    *   `ResponseGetUserInfo.java`: Response containing the user's information.
    *   `ResponseInitMap.java`: Response containing the initial map data for a new user.
    *   `ResponseReceiveConfig.java`: Response containing the game configuration data.

### `config`

This package is responsible for loading and managing the game configuration from JSON files.

*   **`ConfigManager.java`**: A singleton class that loads all the game configuration from JSON files at startup. It holds all the configuration data in memory.
*   **`ConfigAction.java`**: A utility class that uses Gson to deserialize the JSON configuration files into Java objects.
*   **`configPath.java`**: A class that contains constants for the paths to the JSON configuration files.
*   **`ConfigProviderService.java`**: A service class that provides the game configuration to the client.
*   **`GameConfigLoader.java`**: A utility class for loading and initializing the game configuration.

#### `config/data`

This package contains the POJOs that represent the game configuration data. These classes are used by Gson to deserialize the JSON configuration files.

*   `AllGameConfigsPayload.java`: A master container class for all game configurations that need to be sent to the client.
*   `ArmyCampData.java`: POJO for army camp data configuration.
*   `BarrackData.java`: POJO for barrack data configuration.
*   `BuilderHutData.java`: POJO for builder hut data configuration.
*   `BuildingConfig.java`: Configuration holder for building data.
*   `BuildingDefinitionData.java`: POJO for building definition data configuration.
*   `BuildingLocationData.java`: POJO for building location data configuration.
*   `DefensiveBuildingData.java`: POJO for defensive building data configuration.
*   `DungeonConfig.java`: Configuration holder for dungeon data.
*   `DungeonMap.java`: Data class for dungeon map configuration.
*   `DungeonObject.java`: Data class for objects in dungeon map.
*   `DungeonResource.java`: Data class for resources in dungeon map.
*   `InitGameConfig.java`: Configuration holder for initial game data.
*   `ObstacleData.java`: POJO for obstacle data configuration.
*   `PlayerData.java`: POJO for player data configuration.
*   `ResourceConfig.java`: Configuration holder for resource data.
*   `ResourceData.java`: POJO for resource data configuration.
*   `ResourceGenerationData.java`: Placeholder POJO for resource generation data.
*   `ResourceGeneratorData.java`: POJO for resource generator data configuration.
*   `ResourceStorage.java`: Placeholder POJO for resource storage.
*   `ResourceStorageData.java`: POJO for resource storage data configuration.
*   `ResourceType.java`: Enum for resource types.
*   `Size.java`: Class for handling building dimensions.
*   `TownHallData.java`: POJO for town hall data configuration.
*   `TroopBaseData.java`: Data class for troop base configuration.
*   `TroopConfig.java`: Configuration holder for troop data.
*   `TroopData.java`: POJO for troop data configuration.

#### `config/adapters`

This package contains custom Gson type adapters for deserializing the JSON configuration files.

*   `ArmyCampDataAdapter.java`: Type adapter for `ArmyCampData`.
*   `BarrackDataAdapter.java`: Type adapter for `BarrackData`.
*   `BuilderHutDataAdapter.java`: Type adapter for `BuilderHutData`.
*   `DefensiveBuildingDataAdapter.java`: Type adapter for `DefensiveBuildingData`.
*   `ObstacleDataAdapter.java`: Type adapter for `ObstacleData`.
*   `ResourceGeneratorDataAdapter.java`: Type adapter for `ResourceGeneratorData`.
*   `ResourceStorageDataAdapter.java`: Type adapter for `ResourceStorageData`.
*   `TownHallDataAdapter.java`: Type adapter for `TownHallData`.

### `dispatcher`

This package is responsible for routing client requests and server events to the appropriate handlers.

*   **`CentralDispatcher.java`**: This is a singleton class that manages a map of request handlers and event handlers. It receives requests and events from the `FresherExtension` and dispatches them to the registered handlers.
*   **`Event.java`**: A simple class that represents an event with a type and data.
*   **`Response.java`**: A simple class that represents a response with a status and data.

#### `dispatcher/handlers`

This package contains the handlers for the client requests. Each handler is responsible for a specific set of commands.

*   **`AuthHandler.java`**: Handles authentication requests (login, logout).
*   **`BattleHandler.java`**: Handles battle-related requests.
*   **`EventHandler.java`**: An interface for handling server events.
*   **`MapHandler.java`**: Handles map-related requests (building, moving, etc.).
*   **`RequestHandler.java`**: An interface for handling client requests.
*   **`RequestHandlerImpl.java`**: An implementation of `RequestHandler` that delegates requests to the appropriate handlers.
*   **`ResourceHandler.java`**: Handles resource-related requests.
*   **`ShopHandler.java`**: Handles shop-related requests.
*   **`TroopHandler.java`**: Handles troop-related requests.

#### `dispatcher/exceptions`

This package contains custom exceptions used in the dispatcher.

*   **`NoHandlerException.java`**: Thrown when no handler is found for a command.
*   **`ValidationException.java`**: Thrown when request validation fails.

### `event`

This package contains the event handling logic for the server.

#### `event/eventType`

This package contains the definitions of the event types and their parameters.

*   **`DemoEventParam.java`**: An enum that defines the parameters for the demo events.
*   **`DemoEventType.java`**: An enum that defines the types of the demo events.

#### `event/handler`

This package contains the handlers for the server events.

*   **`EventLoginSuccessHandler.java`**: Handles the successful login event. It creates a new player if the player doesn't exist, or loads the player's data from the database if the player already exists.
*   **`EventLogoutHandler.java`**: Handles the logout event. It saves the player's data to the database.

### `extension`

This package contains the main entry point of the server extension.

*   **`FresherExtension.java`**: This is the main extension class that initializes the server, registers all the request and event handlers with the `CentralDispatcher`, and handles the server lifecycle events. It also handles the `USER_DISCONNECT` and `USER_LOGOUT` events directly to save player data.

### `model`

This package contains the data models for the game objects. These are plain old Java objects (POJOs) that represent the game's entities.

*   **`ActiveSession.java`**: Represents an active user session for multi-device login tracking.
*   **`BarrackQueueInfo.java`**: A POJO to hold information about a barrack's training queue.
*   **`GameInfo.java`**: A POJO for general game information.
*   **`GameObject.java`**: Represents a generic game object on the map with position and dimensions.
*   **`MapConfigParser.java`**: Utility class for parsing map configuration data and converting it to `GameObject` instances.
*   **`MapInitializer.java`**: Handles the initialization and placement of game objects on the map.
*   **`MapLayout.java`**: Represents the game map layout and provides methods to manage object placement.
*   **`MapSocialId.java`**: Utility class for mapping social IDs to game IDs.
*   **`MatchmakingInfo.java`**: POJO for matchmaking information.
*   **`MatchmakingPool.java`**: Manages the global matchmaking pool of players.
*   **`Obstacle.java`**: Represents an obstacle in the player's village.
*   **`Player.java`**: Represents a player in the game, containing all the player's data, such as resources, buildings, troops, etc.
*   **`PlayerInfo.java`**: Serves as the main PlayerModel container, holding all player data and providing save/load functionality.
*   **`PlayerMapData.java`**: POJO for player-specific map data, including battle results for dungeons.
*   **`Resources.java`**: Represents the resources a player has in the game (gold, oil, gems).
*   **`Troop.java`**: Represents a troop unit with training information.
*   **`TroopBuildRequest.java`**: Represents a request to build troops in a barrack.
*   **`UserGame.java`**: A POJO for user game data.

#### `model/building`

This package contains the data models for various building types in the game.

*   **`ArmyCamp.java`**: Represents an Army Camp building that manages troops.
*   **`Barrack.java`**: Represents a Barrack building, responsible for troop training.
*   **`BuilderHut.java`**: Represents a Builder Hut building that manages construction tasks.
*   **`Building.java`**: An abstract base class for all buildings in the game. It provides common properties and methods for all building types.
*   **`BuildingTask.java`**: Represents a building task (construction, upgrade, repair, etc.) used by `BuilderHut`.
*   **`ClanCastle.java`**: Represents a Clan Castle building.
*   **`DefensiveBuilding.java`**: Represents a Defensive Building for base protection.
*   **`Obstacle.java`**: Represents an obstacle in the player's village (also defined in the root `model` package, this seems to be a duplicate or a different context).
*   **`ResourceGenerator.java`**: Represents a building that generates resources over time.
*   **`ResourceStorage.java`**: Represents a building that stores resources.
*   **`TownHall.java`**: Represents the Town Hall building, the central building of the player's base, which extends `ResourceStorage`.

#### `model/enums`

This package contains enumerations used across the model classes.

*   **`BuildingOperationalState.java`**: Enum representing the operational state of a building (e.g., `CONSTRUCTING`, `UPGRADING`, `OPERATING`).
*   **`BuildingTaskType.java`**: Enum representing the type of building task (e.g., `BUILD`, `UPGRADE`, `REPAIR`).
*   **`ResourceGeneratorStatus.java`**: Enum representing the status of a resource generator (e.g., `GENERATING`, `FULL`, `HARVESTABLE`).
*   **`TroopTrainingSlot.java`**: Represents a single stack of troops in the training queue.

#### `model/result`

This package contains classes that encapsulate the results of various game operations.

*   **`BattleResult.java`**: Encapsulates the outcome of battle operations.
*   **`BuyBuildingResult.java`**: Encapsulates the outcome of building purchase requests.
*   **`CancelBuildingResult.java`**: Encapsulates the outcome of building cancellation requests.
*   **`HarvestResourceResult.java`**: Represents the result of a resource harvesting operation.
*   **`MoveBuildingResult.java`**: Encapsulates the outcome of building movement requests.
*   **`RemoveObstacleCompleteResult.java`**: Encapsulates the outcome of obstacle removal completion requests.
*   **`RemoveObstacleResult.java`**: Encapsulates the outcome of obstacle removal requests.
*   **`TrainTroopResult.java`**: Placeholder for the result of troop training operations.
*   **`UpdateBarrackQueueResult.java`**: Encapsulates the outcome of updating barrack training queue.
*   **`UpdatePlayerArmyResult.java`**: Encapsulates the outcome of updating player army.
*   **`UpgradeBuildingCompleteResult.java`**: Encapsulates the outcome of building upgrade completion requests.
*   **`UpgradeBuildingResult.java`**: Encapsulates the outcome of building upgrade requests.
*   **`UseGResult.java`**: Represents the result of using gems.

#### `model/util`

This package contains utility classes related to model operations.

*   **`BuildingDeserializer.java`**: Custom Gson deserializer for `Building` polymorphism (might be deprecated by `BuildingTypeAdapter`).
*   **`BuildingTypeAdapter.java`**: A robust, all-in-one Gson `TypeAdapter` for the polymorphic `Building` class, handling both serialization and deserialization.
*   **`Position.java`**: Represents a 2D position with x and y coordinates.

... (Will be updated with more packages)