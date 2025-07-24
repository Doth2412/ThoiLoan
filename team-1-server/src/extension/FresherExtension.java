package extension;

import bitzero.engine.sessions.ISession;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BZExtension;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine;
import dispatcher.CentralDispatcher;
import dispatcher.handlers.*;
import event.handler.EventLoginSuccessHandler;
import event.handler.EventLogoutHandler;
import model.result.BattleResult;
import util.LoggerUtil;

import model.MatchmakingPool;

public class FresherExtension extends BZExtension {
    private final CentralDispatcher dispatcher;

    public FresherExtension() {
        super();
        setName("Fresher");
        dispatcher = CentralDispatcher.getInstance();
    }

    @Override
    public void init() {
        // Initialize the matchmaking pool singleton on startup
        MatchmakingPool.getInstance();
        LoggerUtil.log(ExtensionLogLevel.INFO, "MatchmakingPool initialized.");

        dispatcher.init();

        trace(ExtensionLogLevel.INFO, "REGISTER HANDLERS");
        addRequestHandler(CmdDefine.USER_MULTI_IDS, AuthHandler.class);
        registerAuthHandlers();
        addRequestHandler(CmdDefine.MAP_MULTI_IDS, MapHandler.class);
        registerMapHandlers();
        addRequestHandler(CmdDefine.RESOURCE_MULTI_IDS, ResourceHandler.class);
        registerResourceHandlers();
        addRequestHandler(CmdDefine.TROOP_MULTI_IDS, TroopHandler.class);
        registerTroopHandlers();
        addRequestHandler(CmdDefine.BATTLE_MULTI_IDS, BattleHandler.class);
        registerBattleHandlers();

        trace(ExtensionLogLevel.INFO, "REGISTER EVENT");
        dispatcher.registerEventHandler(BZEventType.USER_LOGIN.toString(), new EventLoginSuccessHandler());
        dispatcher.registerEventHandler(BZEventType.USER_LOGOUT.toString(), new EventLogoutHandler());
        dispatcher.registerEventHandler(BZEventType.USER_DISCONNECT.toString(), new EventLogoutHandler());

        addEventListener(BZEventType.USER_DISCONNECT, this);
        addEventListener(BZEventType.USER_LOGOUT, this);

        LoggerUtil.log(ExtensionLogLevel.INFO,
                "FresherExtension: Registered with BitZero event system for USER_DISCONNECT and USER_LOGOUT");

        // Register auth request handlers
    }

    /**
     * Registers authentication handlers with the dispatcher.
     */
    private void registerAuthHandlers() {
        try {
            dispatcher.handlers.AuthHandler authHandler = new dispatcher.handlers.AuthHandler();

            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.CUSTOM_LOGIN), authHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.LOGOUT), authHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.GET_USER_INFO), authHandler);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "AuthHandler registered for commands");
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error registering AuthHandler: " + e.getMessage());
        }
    }

    private void registerMapHandlers() {
        try {
            dispatcher.handlers.MapHandler mapHandler = new dispatcher.handlers.MapHandler();

            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.BUILD_COMPLETE), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.MOVE_BUILDING), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.BUY_BUILDING_CONFIRM), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.BUY_BUILDING_CANCEL), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.UPGRADE_BUILDING), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.UPGRADE_BUILDING_COMPLETE), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(CmdDefine.REMOVE_OBSTACLE), mapHandler);
            dispatcher.registerRequestHandler(String.valueOf(CmdDefine.REMOVE_OBSTACLE_COMPLETE), mapHandler);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "resourceHandler registered for commands");
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error registering resourceHandler: " + e.getMessage());
        }
    }

    private void registerResourceHandlers() {
        try {
            dispatcher.handlers.ResourceHandler resourceHandler = new dispatcher.handlers.ResourceHandler();

            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.HARVEST_RESOURCE), resourceHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.USE_G), resourceHandler);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "resourceHandler registered for commands");
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error registering resourceHandler: " + e.getMessage());
        }
    }
    private void registerTroopHandlers() {
        try {
            dispatcher.handlers.TroopHandler troopHandler = new dispatcher.handlers.TroopHandler();

            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.UPDATE_BARRACK_QUEUE), troopHandler);
            dispatcher.registerRequestHandler(String.valueOf(CmdDefine.UPDATE_PLAYER_ARMY), troopHandler);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "resourceHandler registered for commands");
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error registering resourceHandler: " + e.getMessage());
        }
    }

    private void registerBattleHandlers() {
        try {
            dispatcher.handlers.BattleHandler battleHandler = new dispatcher.handlers.BattleHandler();

            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.BATTLE_RESULT), battleHandler);
            dispatcher.registerRequestHandler(String.valueOf(cmd.CmdDefine.PVP_BATTLE_RESULT), battleHandler);
            dispatcher.registerRequestHandler(String.valueOf(CmdDefine.FIND_BATTLE), battleHandler);
            dispatcher.registerRequestHandler(String.valueOf(CmdDefine.BATTLE_MULTI_IDS), battleHandler);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "BattleHandler registered for commands");
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error registering BattleHandler: " + e.getMessage());
        }
    }

    @Override
    public void destroy() {
        // Save the matchmaking pool to the database on shutdown
        MatchmakingPool.getInstance().save();
        LoggerUtil.log(ExtensionLogLevel.INFO, "MatchmakingPool saved.");

        dispatcher.destroy();
    }

    @Override
    public void handleServerEvent(IBZEvent event) {
        if (event != null && event.getType() != null) {
            LoggerUtil.log(ExtensionLogLevel.INFO, "FresherExtension: handleServerEvent received event: {}",
                    event.getType().toString()); // Handle disconnect events directly here since BitZero's automatic
                                                 // disconnects
            // don't go through custom event handlers
            if (event.getType() == BZEventType.USER_DISCONNECT) {
                User user = (User) event.getParameter(BZEventParam.USER);
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "FresherExtension: Handling USER_DISCONNECT event for user: {} (ID: {})",
                        user != null ? user.getName() : "null",
                        user != null ? user.getId() : "null");
                if (user != null) {
                    Integer trackingUserId = (Integer) user.getProperty("trackingUserId");
                    if (trackingUserId != null) {
                        service.AuthenticationService.getInstance().removeActiveSession(trackingUserId);
                    } else {
                        service.AuthenticationService.getInstance().removeActiveSession(user.getId());
                    }
                    service.PlayerDataService.getInstance().savePlayerDataOnDisconnect(user);
                }
            }

        } else if (event != null) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "FresherExtension: handleServerEvent received event with null type. Class: {}",
                    event.getClass().getSimpleName());
        } else {
            return;
        }
        dispatcher.handleServerEvent(event);
    }

    /**
     *
     * @param objData
     *
     *                the first packet send from client after handshake success will
     *                dispatch to doLogin() function
     */
    public void doLogin(short cmdId, ISession session, DataCmd objData) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "FresherExtension: doLogin called with cmdId: {}, session: {}. Delegating to CentralDispatcher.",
                cmdId,
                session.getFullIpAddress());

        // Delegate to CentralDispatcher's doLogin method.
        if (dispatcher != null) {
            dispatcher.doLogin(cmdId, session, objData);
        } else {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "FresherExtension: CentralDispatcher (dispatcher field) is null. Cannot delegate doLogin.");
        }
    }

    public void handleClientRequest(DataCmd dataCmd, User user) {
        dispatcher.handleClientRequest(dataCmd, user);
    }

    // @Override
    // public void destroy() {
    // List<User> allUser = ExtensionUtility.globalUserManager.getAllUsers();
    // if (allUser.size() == 0)
    // return;

    // User obj = null;

    // for (int i = 0; i < allUser.size(); i++) {
    // obj = allUser.get(i);
    // // do sth with user
    // LogObject logObject = new LogObject(LogObject.ACTION_LOGOUT);
    // logObject.zingId = obj.getId();
    // logObject.zingName = obj.getName();
    // // System.out.println("Log logout = " + logObject.getLogMessage());
    // MetricLog.writeActionLog(logObject);
    // }
    // }

    // private UserInfo getUserInfo(String username, int userId, String ipAddress)
    // throws Exception {
    // int customLogin = ServerConstant.CUSTOM_LOGIN;
    // switch (customLogin) {
    // case 1: // login zingme
    // return ExtensionUtility.getUserInfoFormPortal(username);
    // case 2: // set direct userid
    // return GuestLogin.setInfo(userId, "Fresher_" + userId);
    // default: // auto increment
    // return GuestLogin.newGuest();
    // }
    // }

}
