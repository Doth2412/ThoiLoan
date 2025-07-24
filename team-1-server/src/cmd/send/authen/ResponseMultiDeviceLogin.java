package cmd.send.authen;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response sent to notify a device that the user account has been logged in on
 * another device.
 * This triggers the client to display a notification and redirect to login
 * screen.
 */
public class ResponseMultiDeviceLogin extends BaseMsg {

    public String message;
    public long timestamp;

    /**
     * Constructor for multi-device login notification
     * 
     * @param errorCode Error code indicating multi-device login
     * @param message   User-friendly message to display
     */
    public ResponseMultiDeviceLogin(int errorCode, String message) {
        super(CmdDefine.MULTI_DEVICE_LOGIN_NOTIFICATION, (short) errorCode);
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    public ResponseMultiDeviceLogin() {
        super(CmdDefine.MULTI_DEVICE_LOGIN_NOTIFICATION, ErrorConst.MULTI_DEVICE_LOGIN);
        this.message = "Account logged in on another device";
        this.timestamp = System.currentTimeMillis();
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        putStr(bf, message);
        bf.putLong(timestamp);
        return packBuffer(bf);
    }
}
