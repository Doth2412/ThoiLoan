package cmd.send.battle;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;
import model.PlayerMapData;
import util.LoggerUtil;

import java.nio.ByteBuffer;

public class ResponsePVPBattleResult extends BaseMsg {
    private boolean success;
    private String message;

    private int lootedGold;

    private int lootedElixir;


    public ResponsePVPBattleResult(short error, boolean success, String message, int lootedGold, int lootedElixir) {
        super(CmdDefine.PVP_BATTLE_RESULT, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.lootedGold = lootedGold;
        this.lootedElixir = lootedElixir;

    }

    /**
     * Create success response
     */
    public static ResponsePVPBattleResult success(int lootedGold, int lootedElixir) {
        return new ResponsePVPBattleResult(ErrorConst.SUCCESS, true, "Battle updated!", lootedGold, lootedElixir);
    }

    /**
     * Create failure response with error message
     */
    public static ResponsePVPBattleResult failure(String errorMessage) {
        return new ResponsePVPBattleResult(ErrorConst.ACTION_INVALID, false, errorMessage, 0, 0);
    }

    /**
     * Create service invalid response for unexpected errors
     */
    public static ResponsePVPBattleResult serviceInvalid(String errorMessage) {
        return new ResponsePVPBattleResult(ErrorConst.SERVICE_INVALID, false, errorMessage, 0, 0);
    }

    @Override
    public byte[] createData() {
        /*
         * Cancel Building Response Data Packet Format:
         *
         * Response Data:
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         *
         * Player Maps (if successful):
         * - int remainingGold (4 bytes)
         * - int remainingElixir (4 bytes)
         */
        ByteBuffer bf = makeBuffer();

        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);

        if (success) {
            bf.putInt(this.lootedGold);
            bf.putInt(this.lootedElixir);
        } else {
            bf.putInt(0);
            bf.putInt(0);
        }
        LoggerUtil.log(ExtensionLogLevel.INFO,
                String.format("ResponseBattleResult: Created response with success=" + success + ", message='" + message + "', lootedRes=" + lootedGold + ", " + lootedElixir));
        return packBuffer(bf);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }


}
