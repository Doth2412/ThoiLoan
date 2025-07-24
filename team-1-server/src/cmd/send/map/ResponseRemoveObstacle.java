package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response model for buy building operations
 * Sends the result of building purchase back to the client
 */
public class ResponseRemoveObstacle extends BaseMsg {

    private boolean success;
    private String message;
    private String obstacleType; // Unique ID of the placed building
    private int obstacleIndex; // Type of building that was purchased
    private long removeStartTime; // Timestamp when the removal started
    private int usedGold; // Amount of gold used for the removal
    private int usedOil; // Amount of oil used for the removal

    public ResponseRemoveObstacle(short error, boolean success, String message, String obstacleType,
                                  int obstacleIndex, int usedGold, int usedOil, long removeStartTime) {
        super(CmdDefine.REMOVE_OBSTACLE, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.obstacleType = obstacleType;
        this.obstacleIndex = obstacleIndex;
        this.usedGold = usedGold;
        this.usedOil = usedOil;
        this.removeStartTime = removeStartTime;
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
        bf.putInt(usedGold);
        bf.putInt(usedOil);
        bf.putLong(removeStartTime);

        return packBuffer(bf);
    }

    public static ResponseRemoveObstacle success(String obstacleType, int obstacleIndex,
                                                 int usedGold, int usedOil, long removeStartTime) {
        return new ResponseRemoveObstacle(ErrorConst.SUCCESS, true, "SUCCESS",
                obstacleType, obstacleIndex, usedGold, usedOil, removeStartTime);
    }

    public static ResponseRemoveObstacle failure(String message) {
        return new ResponseRemoveObstacle(ErrorConst.ACTION_INVALID, false,
                message != null ? message : "ACTION_INVALID",
                "", -1, -1, -1, -1L);
    }

    public static ResponseRemoveObstacle serviceInvalid(String message) {
        return new ResponseRemoveObstacle(ErrorConst.SERVICE_INVALID, false,
                message != null ? message : "SERVICE_INVALID",
                "", -1, -1, -1, -1L);
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
                ", purchaseTime=" + removeStartTime +
                '}';
    }
}
