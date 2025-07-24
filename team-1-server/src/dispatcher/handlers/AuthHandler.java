package dispatcher.handlers;

import cmd.CmdDefine;
import dispatcher.exceptions.ValidationException;
import service.AuthenticationService;
import service.UserInfoService;
import util.LoggerUtil;
import bitzero.engine.sessions.ISession;
import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import util.server.ServerConstant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Handles authentication requests (login and logout) in the game server.
 * Implements the RequestHandler interface to integrate with the CentralDispatcher.
 * This handler now delegates business logic to dedicated services:
 * - AuthenticationService for login/logout operations
 * - UserInfoService for player information management
 */
public class AuthHandler extends BaseClientRequestHandler implements RequestHandler {
    private static final Logger logger = LoggerFactory.getLogger(AuthHandler.class);

    private final AuthenticationService authService;
    private final UserInfoService userInfoService;

    public AuthHandler() {
        super();
        this.authService = AuthenticationService.getInstance();
        this.userInfoService = UserInfoService.getInstance();
        LoggerUtil.log(ExtensionLogLevel.INFO, "AuthHandler initialized with service dependencies");
    }

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthHandler.handleClientRequest called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());

        switch (dataCmd.getId()) {
            case CmdDefine.GET_USER_INFO:
                getUserInfoHandler(user);
                break;
            default:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "AuthHandler.handleClientRequest: Unknown command ID {} for user {}",
                        dataCmd.getId(), user.getName());
                break;
        }
    }

    @Override
    public void handleRequest(DataCmd dataCmd, User user) {
        short cmdId = dataCmd.getId();

        try {
            if (CmdDefine.CUSTOM_LOGIN == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthHandler: Routing to loginHandler for cmdId: " + cmdId);
                loginHandler(dataCmd, user);
            } else if (CmdDefine.LOGOUT == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthHandler: Routing to logoutHandler for cmdId: " + cmdId);
                logoutHandler(user);
            } else if (CmdDefine.GET_USER_INFO == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "AuthHandler: Routing to getUserInfoHandler for cmdId: " + cmdId);
                getUserInfoHandler(user);
            } else {
                LoggerUtil.log(ExtensionLogLevel.WARN, "Unknown command ID in AuthHandler: " + cmdId);
                logger.warn("Unknown command ID in AuthHandler: {}", cmdId);
            }
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error handling request " + cmdId + ": " + e.getMessage(), e);
            throw new RuntimeException("Request handling failed for " + cmdId, e);
        }
    }

    /**
     * Centralized method to process login.
     * Delegates to AuthenticationService for actual processing.
     *
     * @param cmdId   The command ID of the login request
     * @param session The ISession of the user attempting to log in
     * @param objData The DataCmd object containing login request data
     * @throws Exception if login fails
     */
    public void performLogin(short cmdId, ISession session, DataCmd objData) throws Exception {
        authService.performLogin(cmdId, session, objData);
    }

    /**
     * Handles player login requests.
     * Delegates to AuthenticationService for processing.
     *
     * @param dataCmd The DataCmd object containing login request data
     * @param user    The User object representing the player logging in
     */
    public void loginHandler(DataCmd dataCmd, User user) {
        logger.info("AuthHandler: loginHandler called for player {}", user.getId());
        try {
            // Explicitly clear any stale PlayerInfo from the session before processing login
            ISession session = user.getSession();
            if (session != null) {
                if (session.getProperty(ServerConstant.PLAYER_INFO) != null) {
                    session.removeProperty(ServerConstant.PLAYER_INFO);
                    LoggerUtil.log(ExtensionLogLevel.INFO,
                            "AuthHandler: Cleared stale PLAYER_INFO from session for user {}", user.getName());
                }
            }

            authService.processLogin(dataCmd, user);
        } catch (ValidationException e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Login validation failed in loginHandler for player {}: {}", user.getId(), e.getMessage());
            throw e;
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Error during loginHandler for player {}: {}", user.getId(), e.getMessage(), e);
            throw new RuntimeException("Login failed: " + e.getMessage(), e);
        }
    }

    /**
     * Handles player logout requests.
     * Delegates to AuthenticationService for processing.
     *
     * @param user The player to log out
     */
    public void logoutHandler(User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthHandler.logoutHandler called for player {}", user.getId());

        authService.processLogout(user);
    }

    /**
     * Handles requests for user information.
     * Delegates to UserInfoService for processing.
     *
     * @param user The User object representing the player requesting their info
     */
    public void getUserInfoHandler(User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "AuthHandler: getUserInfoHandler called for player {}", user.getId());

        userInfoService.processUserInfoRequest(user);
    }
}