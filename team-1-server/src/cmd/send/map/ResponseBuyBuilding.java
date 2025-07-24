package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response model for buy building operations
 * Sends the result of building purchase back to the client
 */
public class ResponseBuyBuilding extends BaseMsg {

    private boolean success;
    private String message;
    private String buildingId; // Unique ID of the placed building
    private String buildingTypeId; // Type of building that was purchased
    private int positionX;
    private int positionY;
    private long purchaseTime;

    public ResponseBuyBuilding(short error, boolean success, String message, String buildingId,
            String buildingTypeId, int positionX, int positionY) {
        super(CmdDefine.BUY_BUILDING_CONFIRM, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingId = buildingId != null ? buildingId : "";
        this.buildingTypeId = buildingTypeId != null ? buildingTypeId : "";
        this.positionX = positionX;
        this.positionY = positionY;
        this.purchaseTime = System.currentTimeMillis();
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
        putStr(bf, buildingId);
        putStr(bf, buildingTypeId);
        bf.putInt(positionX);
        bf.putInt(positionY);
        bf.putLong(purchaseTime);

        return packBuffer(bf);
    }

    public static ResponseBuyBuilding success(String buildingId, String buildingTypeId,
            int positionX, int positionY) {
        return new ResponseBuyBuilding(ErrorConst.SUCCESS, true, "SUCCESS",
                buildingId, buildingTypeId, positionX, positionY);
    }

    public static ResponseBuyBuilding actionInvalid(String message) {
        return new ResponseBuyBuilding(ErrorConst.ACTION_INVALID, false,
                message != null ? message : "ACTION_INVALID",
                "", "", -1, -1);
    }

    public static ResponseBuyBuilding serviceInvalid(String message) {
        return new ResponseBuyBuilding(ErrorConst.SERVICE_INVALID, false,
                message != null ? message : "SERVICE_INVALID",
                "", "", -1, -1);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getPositionX() {
        return positionX;
    }

    public int getPositionY() {
        return positionY;
    }

    public long getPurchaseTime() {
        return purchaseTime;
    }

    @Override
    public String toString() {
        return "ResponseBuyBuilding{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingId='" + buildingId + '\'' +
                ", buildingTypeId='" + buildingTypeId + '\'' +
                ", position=(" + positionX + "," + positionY + ")" +
                ", purchaseTime=" + purchaseTime +
                '}';
    }
}
