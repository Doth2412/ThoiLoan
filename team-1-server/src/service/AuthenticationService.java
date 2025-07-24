package service;

import bitzero.engine.sessions.ISession;
import bitzero.server.core.BZEvent;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.ExtensionUtility;
import bitzero.util.socialcontroller.bean.UserInfo;
import cmd.receive.authen.RequestLogin;
import cmd.send.authen.ResponseMultiDeviceLogin;
import cmd.ErrorConst;
import dispatcher.CentralDispatcher;
import dispatcher.exceptions.ValidationException;
import model.ActiveSession;
import util.GuestLogin;
import util.LoggerUtil;
import util.server.ServerConstant;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Service for handling authentication operations including login and logout.
 * Centralizes authentication logic that was previously in AuthHandler.
 * Now supports multi-device login with session tracking and displacement
 * notifications.
 */
public class AuthenticationService {

    private static AuthenticationService instance;

    // Multi-device login session tracking
    private static final ConcurrentHashMap<Integer, ActiveSession> activeSessions = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService sessionCleanupService = Executors.newScheduledThreadPool(1);

    private AuthenticationService() {
        // Schedule periodic session cleanup every 10 minutes
        sessionCleanupService.scheduleAtFixedRate(this::cleanupInactiveSessions, 10, 10, TimeUnit.MINUTES);
    }

    /**
     * Get the singleton instance of AuthenticationService
     * 
     * @return The AuthenticationService instance
     */
    public static synchronized AuthenticationService getInstance() {
        if (instance == null) {
            instance = new AuthenticationService();
        }
        return instance;
    }

    /**
     * Check if a user has an existing active session
     * 
     * @param userId The user ID to check
     * @return ActiveSession if exists, null otherwise
     */
    private ActiveSession checkExistingLogin(int userId) {
        return activeSessions.get(userId);
    }

    /**
     * Update or create an active session for a user
     * 
     * @param userId  The user ID
     * @param session The ISession object
     */
    private void updateActiveSession(int userId, ISession session) {
        String deviceInfo = session.getAddress() != null ? session.getAddress().toString() : "unknown";
        ActiveSession newSession = new ActiveSession(userId, session, System.currentTimeMillis(), deviceInfo);
        activeSessions.put(userId, newSession);

        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthenticationService: Updated active session for user: {}, device: {}", userId, deviceInfo);
    }

    /**
     * Notify an old device that the user has logged in elsewhere
     * 
     * @param oldSession The session to notify
     * @param userId     The user ID for logging
     */
    private void notifyOldDevice(ActiveSession oldSession, int userId) {
        if (oldSession != null && oldSession.getSession() != null && oldSession.isSessionValid()) {
            try {
                ResponseMultiDeviceLogin notification = new ResponseMultiDeviceLogin(
                        ErrorConst.MULTI_DEVICE_LOGIN,
                        "Your account has been logged in on another device");

                ExtensionUtility.getExtension().send(notification, oldSession.getSession());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthenticationService: Multi-device login notification sent to old session for user: {}",
                        userId);

            } catch (Exception e) {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "AuthenticationService: Failed to notify old device for user: {} - {}", userId, e.getMessage());
            }
        }
    }

    /**
     * Remove an active session for a user
     * 
     * @param userId The user ID
     */
    public void removeActiveSession(int userId) {
        activeSessions.remove(userId);
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthenticationService: Removed active session for user: {}", userId);
    }

    /**
     * Clean up inactive sessions periodically
     */
    private void cleanupInactiveSessions() {
        long currentTime = System.currentTimeMillis();
        long sessionTimeout = 30 * 60 * 1000; // 30 minutes

        int removedCount = 0;
        for (Map.Entry<Integer, ActiveSession> entry : activeSessions.entrySet()) {
            ActiveSession session = entry.getValue();
            boolean shouldRemove = false;

            // Remove if session is too old or no longer connected
            if ((currentTime - session.getLastActivity()) > sessionTimeout || !session.isSessionValid()) {
                shouldRemove = true;
            }

            if (shouldRemove) {
                activeSessions.remove(entry.getKey());
                removedCount++;
            }
        }

        if (removedCount > 0) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "AuthenticationService: Cleaned up {} inactive sessions", removedCount);
        }
    }

    /**
     * Performs the complete login process including validation and event dispatch.
     *
     * @param cmdId   The command ID of the login request
     * @param session The ISession of the user attempting to log in
     * @param objData The DataCmd object containing login request data
     * @throws Exception if login fails
     */
    public void performLogin(short cmdId, ISession session, DataCmd objData) throws Exception {
        RequestLogin reqLogin = new RequestLogin(objData);
        reqLogin.unpackData();

        String username = reqLogin.username;

        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthenticationService: performLogin called for username: " +  username);

        if (session == null) {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "AuthenticationService: ISession is null. Cannot proceed with login for username: {}",
                    username);
            throw new ValidationException("Login failed - session not available");
        }
        // Pass 0 for the userId parameter as it's no longer sent by the client.
        UserInfo uInfo = getUserInfo(username, 0, session.getAddress());
        if (uInfo != null) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "AuthenticationService: UserInfo retrieved for username: {}",
                    uInfo.getUsername());

            // MULTI-DEVICE LOGIN LOGIC: Check for existing session
            // This logic is now simplified to always use the username's hash code,
            // ensuring a consistent identifier for session tracking based on username
            // alone.
            int checkUserId = Math.abs(uInfo.getUsername().hashCode());

            ActiveSession existingSession = checkExistingLogin(checkUserId);

            if (existingSession != null) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthenticationService: Multi-device login detected for user: {} (username: {}) - displacing old session",
                        checkUserId, uInfo.getUsername());

                // Notify the old device before displacement
                notifyOldDevice(existingSession, checkUserId);
            }

            User user = ExtensionUtility.instance().canLogin(uInfo, "", session);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "AuthenticationService: User canLogin returned user: {}",
                    user != null ? user.getName() : "null");
            if (user != null) {
                // ALWAYS sync UserInfo with the actual user object created by the framework.
                uInfo.setUserId(String.valueOf(user.getId()));
                uInfo.setUsername(user.getName());
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthenticationService: Synced UserInfo with framework user - userId: {}, username: {}",
                        user.getId(), user.getName());

                user.setProperty("userId", uInfo.getUserId());

                user.setProperty("trackingUserId", checkUserId);

                // Update active session tracking using the same ID used for detection
                // This ensures consistency between detection and tracking
                updateActiveSession(checkUserId, session);

                // Dispatch USER_LOGIN event
                Map<BZEventParam, Object> evtParams = new HashMap<>();
                evtParams.put(BZEventParam.USER, user);
                evtParams.put(BZEventParam.SESSION, session);
                IBZEvent loginEvent = new BZEvent(BZEventType.USER_LOGIN, evtParams);
                CentralDispatcher.getInstance().handleServerEvent(loginEvent);

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthenticationService: USER_LOGIN event dispatched for user: {}", user.getName());
            } else {
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "AuthenticationService: User is null after canLogin for username: {}",
                        username);
                throw new ValidationException("Login failed - user not found");
            }
        } else {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "AuthenticationService: UserInfo could not be retrieved for username: {}. Login failed.",
                    username);
            throw new ValidationException("Login failed - unable to retrieve user information");
        }
    }

    /**
     * Handles player login with session validation.
     *
     * @param dataCmd The DataCmd object containing login request data
     * @param user    The User object representing the player logging in
     * @throws Exception if login fails
     */
    public void processLogin(DataCmd dataCmd, User user) throws Exception {
        LoggerUtil.log(ExtensionLogLevel.INFO, "AuthenticationService: processLogin called for player {}",
                user.getId());

        int userIdParam = user.getId();

        User currentUser = ExtensionUtility.globalUserManager.getUserById(userIdParam);
        ISession userSession = null;

        if (currentUser != null) {
            userSession = currentUser.getSession();
        }

        if (userSession == null) {
            throw new ValidationException("No active session found for player " + user.getId());
        }

        performLogin(dataCmd.getId(), userSession, dataCmd);
    }

    /**
     * Handles player logout with data saving and event dispatch.
     *
     * @param user The player to log out
     */
    public void processLogout(User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthenticationService: processLogout called for player {}", user.getId());

        // Remove from active sessions tracking using consistent tracking ID
        Integer trackingUserId = (Integer) user.getProperty("trackingUserId");
        if (trackingUserId != null) {
            removeActiveSession(trackingUserId);
        } else {
            removeActiveSession(user.getId());
        }

        service.PlayerDataService.getInstance().savePlayerDataOnLogout(user, "command-logout");

        User currentUser = ExtensionUtility.globalUserManager.getUserById(user.getId());
        if (currentUser != null && currentUser.getSession() != null) {

            // Dispatch USER_LOGOUT event (this will trigger EventLogoutHandler as well)
            Map<BZEventParam, Object> evtParams = new HashMap<>();
            evtParams.put(BZEventParam.USER, currentUser);
            IBZEvent logoutEvent = new BZEvent(BZEventType.USER_LOGOUT, evtParams);
            CentralDispatcher.getInstance().handleServerEvent(logoutEvent);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "AuthenticationService: USER_LOGOUT event dispatched for player {}", user.getId());

        } else {
            LoggerUtil.log(ExtensionLogLevel.WARN,
                    "AuthenticationService: Logout failed - No active session or user found for player with ID: "
                            + user.getId());
        }
    }

    /**
     * Retrieves UserInfo based on authentication method configured.
     *
     * @param usernameOrSessionKey The session key or username
     * @param userId               The user ID
     * @param ipAddress            The IP address
     * @return UserInfo object or null if retrieval fails
     * @throws Exception if user info retrieval fails
     */
    private UserInfo getUserInfo(String usernameOrSessionKey, int userId, String ipAddress) throws Exception {
        // This 'usernameOrSessionKey' parameter corresponds to 'sessionKey' from portal
        // or 'username'
        // 'userId' is used for guest login type 2.
        int customLogin = ServerConstant.CUSTOM_LOGIN;
        switch (customLogin) {
            case 1: // login zingme (expects sessionKey from portal as 'usernameOrSessionKey')
                return ExtensionUtility.getUserInfoFormPortal(usernameOrSessionKey);
            case 2: // set direct userid
                int uniqueId = Math.abs(usernameOrSessionKey.hashCode()); //TODO: switch from hash to something else (id _ postfix, etc)
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "AuthenticationService: Custom login type 2 - generating userId: {} from username: {}",
                        uniqueId, usernameOrSessionKey);
                return GuestLogin.setInfo(uniqueId, usernameOrSessionKey);
            default:
                UserInfo guestInfo = GuestLogin.newGuest();
                guestInfo.setUsername(usernameOrSessionKey);
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthenticationService: Generated new guest user - ID: {}, username: {}",
                        guestInfo.getUserId(), guestInfo.getUsername());
                return guestInfo;
        }
    }
}