package dispatcher.handlers;

import bitzero.server.extensions.data.DataCmd;
import bitzero.server.entities.User;

public interface RequestHandler {
    void handleRequest(DataCmd dataCmd, User user);
}