package util;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.util.common.business.Debug;
import bitzero.util.socialcontroller.bean.UserInfo;

import java.util.concurrent.atomic.AtomicInteger;

import util.database.DataHandler;

import util.server.ServerConstant;

public class GuestLogin {
    private static final AtomicInteger guestCount = new AtomicInteger(1);

    public static UserInfo newGuest() {
        int userId = 0;
        userId = guestCount.getAndIncrement();

        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(Integer.toString(userId));
        userInfo.setUsername("Fresher" + userId);
        userInfo.setHeadurl("");

        return userInfo;
    }

    public static UserInfo setInfo(int userId, String username) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(Integer.toString(userId));
        userInfo.setUsername(username);
        userInfo.setHeadurl("");

        return userInfo;
    }

    public static void init() {
        int count = ServerConstant.FARM_ID_COUNT_FROM;
        Integer tmp = null;
        try {
            tmp = (Integer) DataHandler.get(ServerConstant.FARM_ID_KEY);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Exception get GuestId count");
        }

        if (tmp != null) {
            count = tmp.intValue();
        }

        LoggerUtil.log(ExtensionLogLevel.INFO, "GuestId count on server start: " + Integer.toString(count));
        guestCount.set(count);

        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                GuestLogin.saveData();
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "GuestId count on server shutdown: " + Integer.toString(guestCount.get()));
            }
        });
    }

    public static void saveData() {
        try {
            Integer currCount = Integer.valueOf(guestCount.get());
            DataHandler.set(ServerConstant.FARM_ID_KEY, currCount);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error saving guest id count");
        }
    }
}
