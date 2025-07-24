package util.metric;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import model.UserGame;
import util.LoggerUtil;
import util.server.ServerUtil;

public class MetricLog {
    public static final String LOG_SEP = "\t";

    public MetricLog() {
        super();
    }

    public static void write(String data) {
        long time = System.currentTimeMillis();
        StringBuilder s = new StringBuilder();
        s.append(time);
        s.append(LOG_SEP);
        s.append("moniter");
        s.append(LOG_SEP);
        s.append(data);

        LoggerUtil.log(ExtensionLogLevel.DEBUG, s.toString());
    }

    public static void writeCCULSog(int ccu) {
        long time = System.currentTimeMillis();
        StringBuilder s = new StringBuilder();

        ccu += 100;

        s.append(time);
        s.append(LOG_SEP);
        s.append(LogDefine.CCU);
        s.append(LOG_SEP);
        s.append(ccu);

        LoggerUtil.log(ExtensionLogLevel.DEBUG, s.toString());
    }

    public static void writeActionLog(LogObject logObject) {
        LoggerUtil.log(ExtensionLogLevel.DEBUG, logObject.getLogMessage());
    }
}
