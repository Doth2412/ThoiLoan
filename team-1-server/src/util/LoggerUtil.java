package util;

import bitzero.engine.sessions.ISession;
import bitzero.server.extensions.BZExtension;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;

public class LoggerUtil extends BZExtension implements ILoggerUtil {
    private static volatile LoggerUtil instance;
    private static final Object LOCK = new Object();
    private boolean isInitialized;

    private LoggerUtil() {
        super();
        setName("LoggerUtil");
    }

    public static LoggerUtil getInstance() {
        if (instance == null) {
            synchronized (LOCK) {
                if (instance == null) {
                    instance = new LoggerUtil();
                }
            }
        }
        return instance;
    }

    @Override
    public void init() {
        isInitialized = true;
        trace(ExtensionLogLevel.INFO, "LoggerUtil initialized");
    }

    @Override
    public void destroy() {
        isInitialized = false;
        instance = null;
    }

    @Override
    public void doLogin(short cmdId, ISession session, DataCmd objData) {
        // Not used in logger implementation
    }

    public static void log(ExtensionLogLevel level, String message, Object... args) {
        LoggerUtil logger = getInstance();
        if (!logger.isInitialized) {
            logger.init();
        }
        logger.trace(level, message, args);
    }

    @Override
    public void trace(ExtensionLogLevel level, String message, Object... args) {
        super.trace(level, message, args);
    }
}