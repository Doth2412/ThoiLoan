package util;

import bitzero.server.extensions.ExtensionLogLevel;

public interface ILoggerUtil {
    void trace(ExtensionLogLevel level, String message, Object... args);
}