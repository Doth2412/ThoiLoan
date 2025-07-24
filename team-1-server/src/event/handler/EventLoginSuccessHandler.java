package event.handler;

import bitzero.server.core.BZEvent;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.util.ExtensionUtility;
import dispatcher.handlers.EventHandler;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import model.MatchmakingPool;
import model.PlayerInfo;
import util.LoggerUtil;
import util.server.ServerConstant;
import config.ConfigManager;
import config.data.InitGameConfig;
import cmd.send.user.ResponseInitMap;

import java.util.HashMap;
import java.util.Map;

public class EventLoginSuccessHandler implements EventHandler {
        @Override
        public void handleEvent(IBZEvent event) {
                LoggerUtil.log(ExtensionLogLevel.INFO, "LoginSuccessHandler: handleEvent called for event: {}",
                                event.getType());
                onLoginSuccess((User) event.getParameter(BZEventParam.USER));
        }

        private void onLoginSuccess(User user) {
                LoggerUtil.log(ExtensionLogLevel.INFO, "LoginSuccessHandler: onLoginSuccess called for user: {}",
                                user.getName());
                try {
                        // Try to load existing player from database first using username as key
                        PlayerInfo pInfo = PlayerInfo.getModelFromDatabase(user.getName());
                        boolean isNewPlayer = false;

                        if (pInfo == null) {
                                // Player doesn't exist - create new player
                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: Player %s not found in database, creating new player",
                                                user.getName());

                                isNewPlayer = true;

                                // Get game configuration for new player initialization
                                InitGameConfig initConfig = ConfigManager.getInstance().getInitialGameConfigs();

                                // Create new player with proper game configuration
                                pInfo = PlayerInfo.getOrCreatePlayerFromConfig(user.getId(), user.getName(),
                                                initConfig.getPlayerData()); // Save the new player to database using
                                                                             // username as key
                                pInfo.saveModel(user.getName());

                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: New PlayerInfo created and saved for user: {}",
                                                user.getName());
                        } else {
                                // Existing player loaded successfully - update username to match current
                                // session
                                String currentUsername = user.getName();
                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: Existing PlayerInfo loaded for user: {}, updating username to: {}",
                                                user.getName(), currentUsername);

                                // Update the username in PlayerInfo to match the current session
                                pInfo.setName(currentUsername);

                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: Username updated from database to current session username: {}",
                                                currentUsername);
                        } // Log player status for debugging
                        LoggerUtil.log(ExtensionLogLevel.INFO,
                                        "LoginSuccessHandler: Player " + user.getName() + " is "
                                                        + (isNewPlayer ? "NEW" : "EXISTING") + " player");

                        // Get the matchmaking pool singleton
                        MatchmakingPool pool = MatchmakingPool.getInstance();

                        // On login, we ensure the player is correctly placed in the matchmaking pool.
                        // The updatePlayerPrestige method handles both adding new players and moving existing ones.
                        // We use a dummy old prestige of -1 to ensure the logic treats this as a fresh update.
                        LoggerUtil.log(ExtensionLogLevel.INFO, "LoginSuccessHandler: Updating player " + pInfo.getPlayer().getUsername() + " in MatchmakingPool.");
                        pool.updatePlayerPrestige(pInfo.getPlayer().getPlayerID(), pInfo.getPlayer().getUsername(), -1, pInfo.getPlayer().getPrestigePoint(), 0L);

                        // Set PlayerInfo in user properties for future access
                        user.setProperty(ServerConstant.PLAYER_INFO, pInfo);
                        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                                        "LoginSuccessHandler: PlayerInfo set in user properties for user: {}",
                                        user.getName());

                        // Send login success notification
                        LoggerUtil.log(ExtensionLogLevel.INFO,
                                        "LoginSuccessHandler: Attempting to send LoginOK to user: {}",
                                        user.getName());
                        ExtensionUtility.instance().sendLoginOK(user);
                        LoggerUtil.log(ExtensionLogLevel.INFO, "LoginSuccessHandler: LoginOK sent to user: {}",
                                        user.getName()); // Send initialization data with PlayerInfo (works for both new
                                                         // and existing players)
                        sendInitMapWithPlayerInfo(user, pInfo, isNewPlayer);

                        // Dispatch custom login success event
                        Map<String, Object> evtParams = new HashMap<>();
                        evtParams.put(DemoEventParam.USER.toString(), user);
                        evtParams.put(DemoEventParam.NAME.toString(), user.getName());
                        ExtensionUtility.dispatchEvent(new BZEvent(DemoEventType.LOGIN_SUCCESS, evtParams));
                        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                                        "LoginSuccessHandler: Dispatched DemoEventType.LOGIN_SUCCESS for user: {}",
                                        user.getName());

                } catch (Exception e) {
                        LoggerUtil.log(ExtensionLogLevel.ERROR,
                                        "LoginSuccessHandler: Error in onLoginSuccess for user: {}: {}",
                                        user.getName(), e.getMessage(), e);
                }
        }        /**
         * Sends initialization map data with PlayerInfo to client.
         * Only sends INIT_MAP packet to NEW players, not existing players.
         * 
         * @param user        The user object
         * @param pInfo       The player info containing all player data (buildings,
         *                    resources, etc.)
         * @param isNewPlayer Whether this is a new player or existing player
         */
        private void sendInitMapWithPlayerInfo(User user, PlayerInfo pInfo, boolean isNewPlayer) {
                try {
                        if (isNewPlayer) {
                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: Sending init map data with PlayerInfo to new player: {}",
                                                user.getName());

                                // Get the base game configuration (for map layout rules, obstacles, etc.)
                                InitGameConfig initConfig = ConfigManager.getInstance().getInitialGameConfigs();

                                // Send the initialization map response with PlayerInfo
                                // The client will use PlayerInfo.player.buildings to render the actual
                                // buildings
                                // and InitGameConfig for base map layout, obstacles, and configuration
                                ResponseInitMap responseInitMap = new ResponseInitMap((short) 0, initConfig, pInfo);
                                ExtensionUtility.getExtension().send(responseInitMap, user.getSession());
                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: Init map data with PlayerInfo sent to new player: {}",
                                                user.getName());
                        } else {
                                LoggerUtil.log(ExtensionLogLevel.INFO,
                                                "LoginSuccessHandler: Skipping INIT_MAP packet for existing player: {}",
                                                user.getName());
                        }

                } catch (Exception e) {
                        LoggerUtil.log(ExtensionLogLevel.ERROR,
                                        "LoginSuccessHandler: Error sending init map with PlayerInfo to player {}: {}",
                                        user.getName(), e.getMessage(), e);
                }
        }
}
