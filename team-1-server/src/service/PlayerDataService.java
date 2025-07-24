package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import model.Player;
import model.PlayerInfo;
import util.LoggerUtil;
import util.database.DataHandler;
import util.server.ServerConstant;
import util.server.ServerUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Centralized service for handling player data persistence operations.
 * This ensures consistent player data saving across all logout/disconnect
 * scenarios.
 */
public class PlayerDataService {

    private static PlayerDataService instance;

    private PlayerDataService() {
        // Private constructor for singleton
    }

    /**
     * Get the singleton instance of PlayerDataService
     *
     * @return The PlayerDataService instance
     */
    public static synchronized PlayerDataService getInstance() {
        if (instance == null) {
            instance = new PlayerDataService();
        }
        return instance;
    }

    /**
     * Save player data for logout/disconnect scenarios.
     * This method centralizes all player data saving logic to ensure consistency.
     *
     * @param user    The user whose data should be saved
     * @param context Context string for logging (e.g., "logout", "disconnect",
     *                "manual save")
     * @return true if save was successful, false otherwise
     */
    public boolean savePlayerDataOnLogout(User user, String context) {
        if (user == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "PlayerDataService: Cannot save player data - user is null (context: " + context + ")");
            return false;
        }

        LoggerUtil.log(ExtensionLogLevel.INFO,
                "PlayerDataService: Saving player data for user: " + user.getName() +
                        " (ID: " + user.getId() + ") - context: " + context);

        try {
            // Get PlayerInfo from user properties
            PlayerInfo pInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (pInfo != null && pInfo.hasValidPlayerData()) {
                // Update logout time to current time
                pInfo.updateLogoutTime();

                // Save player data to BitZero system
                pInfo.saveModel(user.getName());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "PlayerDataService: Player data saved successfully for user: " + user.getName() +
                                " (ID: " + user.getId() + ") - context: " + context);

                LoggerUtil.log(ExtensionLogLevel.DEBUG,
                        "PlayerDataService: Saved player summary for " + user.getName() +
                                " (context: " + context + "): " + pInfo.getPlayerSummary());

                return true;

            } else {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "PlayerDataService: No valid PlayerInfo found for user: " + user.getName() +
                                " (ID: " + user.getId() + ") - skipping save (context: " + context + ")");
                return false;
            }

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "PlayerDataService: Error saving player data for user " + user.getName() +
                            " (ID: " + user.getId() + ") in context '" + context + "': " + e.getMessage(),
                    e);
            return false;
        }
    }

    /**
     * Save player data for logout scenarios (convenience method)
     *
     * @param user The user whose data should be saved
     * @return true if save was successful, false otherwise
     */
    public boolean savePlayerDataOnLogout(User user) {
        return savePlayerDataOnLogout(user, "logout");
    }

    /**
     * Save player data for disconnect scenarios (convenience method)
     *
     * @param user The user whose data should be saved
     * @return true if save was successful, false otherwise
     */
    public boolean savePlayerDataOnDisconnect(User user) {
        return savePlayerDataOnLogout(user, "disconnect");
    }

    /**
     * Manual save player data (convenience method for other scenarios)
     *
     * @param user The user whose data should be saved
     * @return true if save was successful, false otherwise
     */
    public boolean savePlayerDataManual(User user) {
        return savePlayerDataOnLogout(user, "manual");
    }
}

    
