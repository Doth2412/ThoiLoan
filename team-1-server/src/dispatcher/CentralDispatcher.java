package dispatcher;

import bitzero.engine.sessions.ISession;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BZExtension;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine; // Assuming CmdDefine is in 'cmd' package
import dispatcher.handlers.AuthHandler; // Required to call performLogin
import dispatcher.handlers.BattleHandler;
import dispatcher.handlers.EventHandler;
import dispatcher.handlers.RequestHandler;
import event.handler.EventLogoutHandler;
import util.LoggerUtil;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Central dispatcher manages server events and client requests through a
 * singleton pattern.
 * To register an event handler, use the following pattern:
 * 
 * <pre>
 * {@code
 * CentralDispatcher.getInstance().registerEventHandler("EVENT_TYPE", new YourEventHandler());
 * }
 * </pre>
 * 
 * To register an request handler, use the following pattern:
 * 
 * <pre>
 * {@code
 * CentralDispatcher.getInstance().registerRequestHandler("EVENT_TYPE", new YourRequestHandler());
 * }
 * </pre>
 * 
 * where EVENT_TYPE is a string identifier for your event
 * and YourEventHandler / YourRequestHandler
 * implements the EventHandler / RequestHandler interface.
 * 
 * @see EventHandler
 * @see RequestHandler
 */
public class CentralDispatcher extends BZExtension {
    private static CentralDispatcher instance;
    private final Map<String, RequestHandler> requestHandlers;
    private final Map<String, EventHandler> eventHandlers;

    private CentralDispatcher() {
        super();
        setName("CentralDispatcher");
        requestHandlers = new ConcurrentHashMap<>();
        eventHandlers = new ConcurrentHashMap<>();
    }

    public static CentralDispatcher getInstance() {
        if (instance == null) {
            synchronized (CentralDispatcher.class) {
                if (instance == null) {
                    instance = new CentralDispatcher();
                }
            }
        }
        return instance;
    }

    @Override
    public void init() {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Initializing CentralDispatcher");
        requestHandlers.clear();
        eventHandlers.clear();
        // Register EventLogoutHandler for USER_LOGOUT event
        EventLogoutHandler eventLogoutHandler = new EventLogoutHandler();
        registerEventHandler(BZEventType.USER_LOGOUT.toString(), eventLogoutHandler);
        registerRequestHandler(CmdDefine.BATTLE_MULTI_IDS, new BattleHandler());
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "CentralDispatcher: Registered EventLogoutHandler for USER_LOGOUT event.");
    }

    @Override
    public void destroy() {
        trace(ExtensionLogLevel.INFO, "Destroying CentralDispatcher");
        requestHandlers.clear();
        eventHandlers.clear();
    }

    @Override
    public void handleServerEvent(IBZEvent event) {
        try {
            String eventType = event.getType().toString();
            LoggerUtil.log(ExtensionLogLevel.INFO, "CentralDispatcher: handleServerEvent called with event type: {}",
                    eventType);

            EventHandler handler = eventHandlers.get(eventType);

            if (handler == null) {
                LoggerUtil.log(ExtensionLogLevel.WARN, "CentralDispatcher: No handler found for event: {}", eventType);
                trace(ExtensionLogLevel.WARN, "No handler found for event: {}", eventType);
                return;
            }

            LoggerUtil.log(ExtensionLogLevel.INFO, "CentralDispatcher: Dispatching event {} to handler {}", eventType,
                    handler.getClass().getSimpleName());
            handler.handleEvent(event);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "CentralDispatcher: Error handling event {}: {}", event.getType(),
                    e.getMessage());
            throw new RuntimeException("Event handling failed", e);
        }
    }

    public void handleClientRequest(DataCmd dataCmd, User user) {
        try {
            short cmdId = dataCmd.getId();
            RequestHandler handler = this.requestHandlers.get(String.valueOf(cmdId));

            if (handler != null) {
                if (cmdId == cmd.CmdDefine.GET_USER_INFO) {
                    trace(ExtensionLogLevel.INFO,
                            "CentralDispatcher: handleClientRequest received GET_USER_INFO for user: {}",
                            user.getName());
                }
                if (cmdId == cmd.CmdDefine.MOVE_BUILDING) {
                    trace(ExtensionLogLevel.INFO,
                            "CentralDispatcher: handleClientRequest received MOVE for user: {}",
                            user.getName());
                }
                handler.handleRequest(dataCmd, user);
            } else {
                trace(ExtensionLogLevel.WARN, "CentralDispatcher: No handler found for command ID: " + cmdId);
            }
        } catch (Exception e) {
            trace(ExtensionLogLevel.ERROR, "Error handling client request for command {}: {}", dataCmd.getId(),
                    e.getMessage(), e);
        }
    }

    @Override
    public void doLogin(short cmdId, ISession session, DataCmd objData) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "CentralDispatcher: doLogin called with cmdId: {}, session IP: {}",
                cmdId,
                session.getFullIpAddress());
        try {
            RequestHandler handler = this.requestHandlers.get(String.valueOf(CmdDefine.CUSTOM_LOGIN));

            AuthHandler authHandlerInstance;
            if (handler instanceof AuthHandler) {
                authHandlerInstance = (AuthHandler) handler;
            } else {
                LoggerUtil.log(ExtensionLogLevel.ERROR,
                        "CentralDispatcher.doLogin: AuthHandler not found registered for CUSTOM_LOGIN. Cannot delegate login. Creating new instance as a fallback (may not be intended).");
                authHandlerInstance = new AuthHandler(); // Or handle error more gracefully
                // Consider sending an error back to the client:
                // ExtensionUtility.instance().sendLoginResponse(session,
                // ErrorConst.ServerError, null);
                // return;
            }

            authHandlerInstance.performLogin(cmdId, session, objData);

            // Note: performLogin will throw exceptions on failure, which will be caught
            // below.
            // If performLogin is successful, the USER_LOGIN event is already dispatched
            // within it.

        } catch (dispatcher.exceptions.ValidationException e) {
            LoggerUtil
                    .log(ExtensionLogLevel.WARN, "CentralDispatcher: Login validation failed during doLogin: {}",
                            e.getMessage());
            // Send appropriate error response if your framework supports it, e.g.,
            // send(new ResponseError(ErrorConst.LOGIN_FAILED, e.getMessage()), session);
            // Example: ExtensionUtility.instance().sendLoginResponse(session,
            // ErrorConst.LOGIN_FAILED_CODE_FROM_YOUR_CONSTANTS , null);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "CentralDispatcher: Generic error during doLogin: {}",
                    e.getMessage(), e);

        }
    }

    // Removed getUserInfo as its logic is now in AuthHandler.getUserInfo
    // private UserInfo getUserInfo(String username, int userId, String ipAddress)
    // throws Exception { ... }

    public void registerRequestHandler(String cmdId, RequestHandler handler) {
        if (cmdId == null || handler == null) {
            throw new IllegalArgumentException("Command ID and handler cannot be null");
        }
        requestHandlers.put(cmdId, handler);
        trace(ExtensionLogLevel.INFO, "Registered request handler {} for command ID (String key): '{}'",
                handler.getClass().getSimpleName(), cmdId);
    }

    // This overload might be less used if all registrations use String keys.
    public void registerRequestHandler(short cmdId, RequestHandler handler) {
        if (handler == null) {
            throw new IllegalArgumentException("Handler cannot be null");
        }
        String cmdIdStr = String.valueOf(cmdId);
        requestHandlers.put(cmdIdStr, handler);
        trace(ExtensionLogLevel.INFO,
                "Registered request handler {} for command ID (short converted to String key): '{}'",
                handler.getClass().getSimpleName(), cmdIdStr);
    }

    public void registerEventHandler(String eventType, EventHandler handler) {
        if (eventType == null || handler == null) {
            throw new IllegalArgumentException("Event type and handler cannot be null");
        }
        eventHandlers.put(eventType, handler);
        trace(ExtensionLogLevel.INFO, "Registered event handler {} for event {}", handler.getClass().getSimpleName(),
                eventType);
    }
}
