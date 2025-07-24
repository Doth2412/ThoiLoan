package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response for canceling building construction
 * Includes success status and refund information
 */
public class ResponseCancelBuyBuilding extends BaseMsg {

    private boolean success;
    private String message;
    private int goldRefund;
    private int oilRefund;
    private String buildingTypeId;
    private int buildingIndex;

    public ResponseCancelBuyBuilding(short error, boolean success, String message,
            String buildingTypeId, int buildingIndex,
            int goldRefund, int oilRefund) {
        super(CmdDefine.BUY_BUILDING_CANCEL, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingTypeId = buildingTypeId != null ? buildingTypeId : "";
        this.buildingIndex = buildingIndex;
        this.goldRefund = goldRefund;
        this.oilRefund = oilRefund;
    }

    /**
     * Create success response with refund information
     */
    public static ResponseCancelBuyBuilding success(String buildingTypeId, int buildingIndex,
            int goldRefund, int oilRefund) {
        return new ResponseCancelBuyBuilding(ErrorConst.SUCCESS, true, "Building cancelled successfully",
                buildingTypeId, buildingIndex, goldRefund, oilRefund);
    }

    /**
     * Create failure response with error message
     */
    public static ResponseCancelBuyBuilding failure(String errorMessage) {
        return new ResponseCancelBuyBuilding(ErrorConst.ACTION_INVALID, false, errorMessage,
                "", 0, 0, 0);
    }

    /**
     * Create service invalid response for unexpected errors
     */
    public static ResponseCancelBuyBuilding serviceInvalid(String errorMessage) {
        return new ResponseCancelBuyBuilding(ErrorConst.SERVICE_INVALID, false, errorMessage,
                "", 0, 0, 0);
    }

    @Override
    public byte[] createData() {
        /*
         * Cancel Building Response Data Packet Format:
         * 
         * Response Data:
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         * - String buildingTypeId (variable length with size prefix)
         * - int buildingIndex (4 bytes)
         * - int goldRefund (4 bytes)
         * - int oilRefund (4 bytes)
         */
        ByteBuffer bf = makeBuffer();

        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);
        putStr(bf, buildingTypeId);
        bf.putInt(buildingIndex);
        bf.putInt(goldRefund);
        bf.putInt(oilRefund);

        return packBuffer(bf);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getGoldRefund() {
        return goldRefund;
    }

    public int getOilRefund() {
        return oilRefund;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }
}
