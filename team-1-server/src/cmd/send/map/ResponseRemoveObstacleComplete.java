package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response model for buy building operations
 * Sends the result of building purchase back to the client
 */
public class ResponseRemoveObstacleComplete extends BaseMsg {

    private boolean success;
    private String message;
    private String obstacleType; // Unique ID of the placed building
    private int obstacleIndex; // Type of building that was purchased
    private long removeStartTime; // Timestamp when the removal started
    private long usedGold; // Amount of gold used for the removal
    private long usedOil; // Amount of oil used for the removal

    public ResponseRemoveObstacleComplete(short error, boolean success, String message, String obstacleType,
                                          int obstacleIndex) {
        super(CmdDefine.REMOVE_OBSTACLE_COMPLETE, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.obstacleType = obstacleType;
        this.obstacleIndex = obstacleIndex;
    }

    @Override
    public byte[] createData() {
        /*
         * BuyBuilding Response Data Packet Format:
         * 
         * Response Data:
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         * - String buildingId (variable length with size prefix)
         * - String buildingTypeId (variable length with size prefix)
         * - int positionX (4 bytes)
         * - int positionY (4 bytes)
         * - long purchaseTime (8 bytes)
         */
        ByteBuffer bf = makeBuffer();

        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);
        putStr(bf, obstacleType);
        bf.putInt(obstacleIndex);

        return packBuffer(bf);
    }

    public static ResponseRemoveObstacleComplete success(String obstacleType, int obstacleIndex) {
        return new ResponseRemoveObstacleComplete(ErrorConst.SUCCESS, true, "SUCCESS",
                obstacleType, obstacleIndex);
    }

    public static ResponseRemoveObstacleComplete failure(String message) {
        return new ResponseRemoveObstacleComplete(ErrorConst.ACTION_INVALID, false,
                message != null ? message : "ACTION_INVALID",
                "", -1);
    }

    public static ResponseRemoveObstacleComplete serviceInvalid(String message) {
        return new ResponseRemoveObstacleComplete(ErrorConst.SERVICE_INVALID, false,
                message != null ? message : "SERVICE_INVALID",
                "", -1);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getObstacleType() {
        return obstacleType;
    }

    public int getObstacleIndex() {
        return obstacleIndex;
    }

    public int getUsedGold() {
        return (int) usedGold;
    }
    public int getUsedOil() {
        return (int) usedOil;
    }

    public long getRemoveStartTime() {
        return removeStartTime;
    }

    @Override
    public String toString() {
        return "ResponseBuyBuilding{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingId='" + obstacleType + '\'' +
                ", buildingTypeId='" + obstacleIndex + '\'' +
                ", removeStartTime=" + removeStartTime +
                '}';
    }
}
