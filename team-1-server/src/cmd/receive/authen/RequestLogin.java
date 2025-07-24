package cmd.receive.authen;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.Debug;

import java.nio.ByteBuffer;

public class RequestLogin extends BaseCmd {
    public String username = "";

    public RequestLogin(DataCmd dataCmd) {
        super(dataCmd);
        Debug.warn("RequestLogin: Constructor called.");
    }

    @Override
    public void unpackData() {
        logger.info("RequestLogin: unpackData() called.");
        ByteBuffer bf = makeBuffer();
        try {
            username = readString(bf);
            logger.info("RequestLogin: Unpacked username: " + username);
        } catch (Exception e) {
            logger.error("RequestLogin: Error unpacking data: " + e.getMessage(), e);
        }
    }

}
