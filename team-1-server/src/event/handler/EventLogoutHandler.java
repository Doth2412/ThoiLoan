package event.handler;

import bitzero.engine.sessions.ISession;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import dispatcher.handlers.EventHandler;
import service.PlayerDataService;
import util.LoggerUtil;
import util.server.ServerConstant;

public class EventLogoutHandler implements EventHandler {
    @Override
    public void handleEvent(IBZEvent event) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "EventLogoutHandler: handleEvent called with event type: {}",
                event != null ? event.getType() : "null");

        if (event != null) {
            User user = (User) event.getParameter(BZEventParam.USER);
            LoggerUtil.log(ExtensionLogLevel.INFO, "EventLogoutHandler: Retrieved user from event: {}",
                    user != null ? user.getName() : "null");
            if (user != null) {
                ISession session = user.getSession();
                if (session != null) {
                    if (session.getProperty(ServerConstant.PLAYER_INFO) != null) {
                        session.removeProperty(ServerConstant.PLAYER_INFO);
                        LoggerUtil.log(ExtensionLogLevel.INFO,
                                "EventLogoutHandler: Cleared PLAYER_INFO from session for user {}", user.getName());
                    }
                } else {
                    LoggerUtil.log(ExtensionLogLevel.WARN,
                            "EventLogoutHandler: Session is null for user {} during logout.", user.getName());
                }
            }
            onLogOut(user);
        } else {
            LoggerUtil.log(ExtensionLogLevel.WARN, "EventLogoutHandler: Received null event");
        }
    }

    private void onLogOut(User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "User " + user.getName() + " logged out/disconnected - delegating save to PlayerDataService");

        // Use centralized PlayerDataService for consistent data saving
        PlayerDataService.getInstance().savePlayerDataOnLogout(user, "event-logout");
    }

}
