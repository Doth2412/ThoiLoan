package service;

import bitzero.engine.sessions.ISession;
import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.util.ExtensionUtility;
import cmd.send.user.ResponseGetUserInfo;
import cmd.send.user.ResponseInitMap;
import cmd.send.user.ResponseReceiveConfig;
import config.ConfigManager;
import config.ConfigProviderService;
import config.data.AllGameConfigsPayload;
import config.data.InitGameConfig;
import config.data.PlayerData;
import model.PlayerInfo;
import util.LoggerUtil;
import util.server.ServerConstant;

/**
 * Service for handling user information operations including player data
 * loading,
 * creation, and response sending. Centralizes user info logic that was
 * previously in AuthHandler.
 */
public class UserInfoService {

    private static UserInfoService instance;

    private UserInfoService() {
    }

    /**
     * Get the singleton instance of UserInfoService
     * 
     * @return The UserInfoService instance
     */
    public static synchronized UserInfoService getInstance() {
        if (instance == null) {
            instance = new UserInfoService();
        }
        return instance;
    }

    /**
     * Handles user information requests with proper new vs existing player logic.
     *
     * @param user The User object representing the player requesting their info
     */
    public void processUserInfoRequest(User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "UserInfoService: processUserInfoRequest called for player {}", user.getId());

        int userId = user.getId();
        if (userId < 0) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "UserInfoService: Invalid user ID: {}", user.getId());
            return;
        }

        // Check if PlayerInfo is already loaded in user properties
        PlayerInfo pInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
        boolean isNewPlayer = false;

        if (pInfo == null) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: PlayerInfo not found in user properties for player: {}. Loading from database.",
                    user.getId());

            try {
                pInfo = loadOrCreatePlayerInfo(user);
                isNewPlayer = (pInfo != null && isNewlyCreatedPlayer(pInfo, user));

                if (pInfo != null) {
                    // Set PlayerInfo in user properties for future access
                    user.setProperty(ServerConstant.PLAYER_INFO, pInfo);
                }
            } catch (Exception e) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "UserInfoService: Exception for player {}: {}", user.getId(), e.getMessage(), e);
                return;
            }
        }

        // Send user info response
        sendUserInfoResponse(user, pInfo, isNewPlayer);
    }

    /**
     * Loads existing player info or creates new player if doesn't exist.
     *
     * @param user The user object
     * @return PlayerInfo object (existing or newly created)
     * @throws Exception if loading/creation fails
     */
    private PlayerInfo loadOrCreatePlayerInfo(User user) throws Exception {
        int userId = user.getId();

        // First, try to load existing player from database
        PlayerInfo pInfo = PlayerInfo.getModelFromDatabase(String.valueOf(userId));

        if (pInfo == null) {
            // Player doesn't exist - create new player
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Player {} not found in database, creating new player", user.getId());

            // Get game configuration for new player initialization
            ConfigManager configManager = ConfigManager.getInstance();
            InitGameConfig initConfig = configManager.getInitialGameConfigs();
            PlayerData playerData = initConfig.getPlayerData();

            // Create new player with proper game configuration
            pInfo = PlayerInfo.getOrCreatePlayerFromConfig(userId, user.getName(), playerData);

            // Save the new player to database
            pInfo.saveModel(userId);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: New PlayerInfo created and saved for player {}", user.getId());
        } else {
            // Existing player loaded successfully - update username to match current session
            String currentUsername = user.getName();
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Existing PlayerInfo loaded for player {}, updating username to: {}",
                    user.getId(), currentUsername);

            // Update the username in PlayerInfo to match the current session
            pInfo.setName(currentUsername);
            pInfo.saveModel(currentUsername);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Username updated from database to current session username: {}",
                    currentUsername);
        }

        return pInfo;
    }

    /**
     * Determines if this is a newly created player based on player info and
     * context.
     *
     * @param pInfo The player info
     * @param user  The user object
     * @return true if this is a newly created player
     */
    private boolean isNewlyCreatedPlayer(PlayerInfo pInfo, User user) {
        // This is a simple check - you might want to implement more sophisticated logic
        // For example, checking if the player has any progress, buildings, etc.
        return pInfo != null && pInfo.getName().equals(user.getName());
    }

    /**
     * Sends user info response and handles new player initialization.
     *
     * @param user        The user object
     * @param pInfo       The player info
     * @param isNewPlayer Whether this is a new player
     */
    private void sendUserInfoResponse(User user, PlayerInfo pInfo, boolean isNewPlayer) {
        ISession session = user.getSession();
        if (session != null && pInfo != null) {
            // First, send the user info response
            ExtensionUtility.getExtension().send(new ResponseGetUserInfo((short) 0, pInfo), session);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: ResponseGetUserInfo sent to player: {}", user.getId());

            // Then, send the game configuration data
            sendGameConfigurations(user);

            // If this is a new player, also send init map data with dynamically generated
            // map
            if (isNewPlayer) {
                sendInitMapToNewPlayer(user, pInfo);
            }
        } else {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "UserInfoService: Cannot send response - ISession is null: {}, PlayerInfo is null: {} for player: {}",
                    session == null, pInfo == null, user.getId());
        }
    }

    /**
     * Sends initialization map data to a new player with dynamically generated map
     * layout.
     * 
     * @param user  The user object
     * @param pInfo The player info
     */
    public void sendInitMapToNewPlayer(User user, PlayerInfo pInfo) {
        try {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Sending init map data to new player: {}", user.getName());

            // Get the initial game configuration
            ConfigManager configManager = ConfigManager.getInstance();
            InitGameConfig initConfig = configManager.getInitialGameConfigs();

            // Send the initialization map response
            ResponseInitMap responseInitMap = new ResponseInitMap((short) 0, initConfig, pInfo);
            ExtensionUtility.getExtension().send(responseInitMap, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Init map data sent to new player: {}", user.getName());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "UserInfoService: Error sending init map to new player {}: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    /**
     * Gets or loads PlayerInfo for a user, creating if necessary.
     *
     * @param user The user object
     * @return PlayerInfo object or null if operation fails
     */
    public PlayerInfo getOrLoadPlayerInfo(User user) {
        PlayerInfo pInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);

        if (pInfo == null) {
            try {
                pInfo = loadOrCreatePlayerInfo(user);
                if (pInfo != null) {
                    user.setProperty(ServerConstant.PLAYER_INFO, pInfo);
                }
            } catch (Exception e) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "UserInfoService: Failed to load/create PlayerInfo for user {}: {}",
                        user.getId(), e.getMessage(), e);
            }
        }

        return pInfo;
    }

    /**
     * Sends consolidated game configuration data to the client.
     * 
     * @param user The user object
     */
    private void sendGameConfigurations(User user) {
        try {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Sending game configurations to player: {}", user.getId());

            ConfigProviderService configProvider = new ConfigProviderService();
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Created ConfigProviderService instance");

            AllGameConfigsPayload configPayload = configProvider.getMasterConfigPayload();
            if (configPayload == null) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "UserInfoService: Failed to get game configurations for player: {}",
                        user.getId());
                return;
            }

            ResponseReceiveConfig responseConfig = new ResponseReceiveConfig((short) 0, configPayload);
            ISession session = user.getSession();

            ExtensionUtility.getExtension().send(responseConfig, session);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "UserInfoService: Game configurations sent to player: {}", user.getId());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "UserInfoService: Error sending game configurations to player {}. Error: {}, Stack trace: {}",
                    user.getId(), e.getMessage());
        }
    }
}