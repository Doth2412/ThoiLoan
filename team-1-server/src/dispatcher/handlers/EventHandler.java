package dispatcher.handlers;

import bitzero.server.core.IBZEvent;

public interface EventHandler {
    void handleEvent(IBZEvent event);
}