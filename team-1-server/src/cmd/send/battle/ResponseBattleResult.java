package cmd.send.battle;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;
import cmd.send.map.ResponseUpgradeBuilding;
import model.PlayerMapData;
import util.LoggerUtil;

import java.nio.ByteBuffer;

public class ResponseBattleResult extends BaseMsg {
    private boolean success;
    private String message;
    private transient java.util.List<model.PlayerMapData> playerMaps;

    public ResponseBattleResult(short error, boolean success, String message) {
        super(CmdDefine.BATTLE_RESULT, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.playerMaps = null;
    }

    public ResponseBattleResult(short error, boolean success, String message, java.util.List<model.PlayerMapData> playerMaps) {
        super(CmdDefine.BATTLE_RESULT, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.playerMaps = playerMaps;
    }

    /**
     * Create success response
     */
    public static ResponseBattleResult success() {
        return new ResponseBattleResult(ErrorConst.SUCCESS, true, "Battle updated!");
    }

    public static ResponseBattleResult success(java.util.List<model.PlayerMapData> playerMaps) {
        return new ResponseBattleResult(ErrorConst.SUCCESS, true, "Battle updated!", playerMaps);
    }

    /**
     * Create failure response with error message
     */
    public static ResponseBattleResult failure(String errorMessage) {
        return new ResponseBattleResult(ErrorConst.ACTION_INVALID, false, errorMessage);
    }

    /**
     * Create service invalid response for unexpected errors
     */
    public static ResponseBattleResult serviceInvalid(String errorMessage) {
        return new ResponseBattleResult(ErrorConst.SERVICE_INVALID, false, errorMessage);
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
         * - int mapCount (4 bytes)
         * - For each map:
         * - int mapIndex (4 bytes)
         * - int stars (4 bytes)
         * - int remainingGold (4 bytes)
         * - int remainingElixir (4 bytes)
         */
        ByteBuffer bf = makeBuffer();

        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);

        if (success && playerMaps != null) {
            bf.putInt(playerMaps.size());
            for (model.PlayerMapData mapData : playerMaps) {
                bf.putInt(mapData.getMapIndex());
                bf.putInt(mapData.getStars());
                config.data.DungeonResource dungeonResources = mapData.getRemainingResources();
                if (dungeonResources != null) {
                    bf.putInt(dungeonResources.getGold());
                    bf.putInt(dungeonResources.getElixir());
                } else {
                    bf.putInt(0);
                    bf.putInt(0);
                }
            }
        } else {
            bf.putInt(0); // no player maps
        }
        LoggerUtil.log(ExtensionLogLevel.INFO,
                String.format("ResponseBattleResult: Created response with success=%s, message='%s', playerMaps=%s",
                        success, message, playerMaps != null ? playerMaps.size() : 0));

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
