// package service;

// import bitzero.server.BitZeroServer;
// import bitzero.server.core.BZEventParam;
// import bitzero.server.core.BZEventType;
// import bitzero.server.core.IBZEvent;
// import bitzero.server.entities.User;
// import bitzero.server.extensions.BaseClientRequestHandler;
// import bitzero.server.extensions.ExtensionLogLevel;
// import bitzero.server.extensions.data.DataCmd;

// import cmd.CmdDefine;
// import cmd.receive.user.RequestUserInfo;
// import cmd.send.demo.ResponseRequestUserInfo;
// import event.eventType.DemoEventParam;
// import event.eventType.DemoEventType;
// import extension.FresherExtension;
// import model.PlayerInfo;
// import util.LoggerUtil;
// import util.server.ServerConstant;

// import java.util.List;

// public class UserHandler extends BaseClientRequestHandler {
// public static short USER_MULTI_IDS = 1000;

// public UserHandler() {
// super();
// }

// public void init() {
// getExtension().addEventListener(BZEventType.USER_DISCONNECT, this);
// getExtension().addEventListener(BZEventType.USER_RECONNECTION_SUCCESS, this);
// getExtension().addEventListener(DemoEventType.CHANGE_NAME, this);
// }

// private FresherExtension getExtension() {
// return (FresherExtension) getParentExtension();
// }

// public void handleServerEvent(IBZEvent ibzevent) {
// if (ibzevent.getType() == BZEventType.USER_DISCONNECT) {
// userDisconnect((User) ibzevent.getParameter(BZEventParam.USER));
// } else if (ibzevent.getType() == DemoEventType.CHANGE_NAME) {
// userChangeName((User) ibzevent.getParameter(DemoEventParam.USER),
// (String)ibzevent.getParameter(DemoEventParam.NAME));
// }
// }

// public void handleClientRequest(User user, DataCmd dataCmd) {
// try {
// switch (dataCmd.getId()) {
// case CmdDefine.GET_USER_INFO:
// new RequestUserInfo(dataCmd); // Validate request format
// getUserInfo(user);
// break;
// }
// } catch (Exception e) {
// LoggerUtil.log(ExtensionLogLevel.WARN, "USERHANDLER EXCEPTION {}",
// e.getMessage());
// }
// }

// private void getUserInfo(User user) {
// try {
// PlayerInfo userInfo = (PlayerInfo)
// user.getProperty(ServerConstant.PLAYER_INFO);
// if (userInfo == null) {
// userInfo = new PlayerInfo(user.getId(), "username_" + user.getId());
// userInfo.saveModel(user.getId());
// }
// send(new ResponseRequestUserInfo(userInfo), user);
// } catch (Exception e) {
// LoggerUtil.log(ExtensionLogLevel.ERROR, "Error getting user info: {}",
// e.getMessage());
// }
// }

// private void userDisconnect(User user) {
// LoggerUtil.log(ExtensionLogLevel.INFO, "User disconnected: {}",
// user.getName());
// }

// private void userChangeName(User user, String name) {
// List<User> allUsers =
// BitZeroServer.getInstance().getUserManager().getAllUsers();
// // Log name change for all connected users
// LoggerUtil.log(ExtensionLogLevel.INFO, "User {} changed name to: {}
// (broadcast to {} users)",
// user.getName(), name, allUsers.size());
// }
// }
