package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response for canceling building construction
 * Includes success status and refund information
 */
public class ResponseUpgradeBuilding extends BaseMsg {

    private boolean success;
    private String message;
    private String buildingTypeId;
    private int buildingIndex;

    public ResponseUpgradeBuilding(short error, boolean success, String message,
            String buildingTypeId, int buildingIndex) {
        super(CmdDefine.BUY_BUILDING_CANCEL, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingTypeId = buildingTypeId != null ? buildingTypeId : "";
        this.buildingIndex = buildingIndex;
    }

    /**
     * Create success response
     */
    public static ResponseUpgradeBuilding success(String buildingTypeId, int buildingIndex) {
        return new ResponseUpgradeBuilding(ErrorConst.SUCCESS, true, "Building upgrade successfully",
                buildingTypeId, buildingIndex);
    }

    /**
     * Create failure response with error message
     */
    public static ResponseUpgradeBuilding failure(String errorMessage) {
        return new ResponseUpgradeBuilding(ErrorConst.ACTION_INVALID, false, errorMessage,
                "", 0);
    }

    /**
     * Create service invalid response for unexpected errors
     */
    public static ResponseUpgradeBuilding serviceInvalid(String errorMessage) {
        return new ResponseUpgradeBuilding(ErrorConst.SERVICE_INVALID, false, errorMessage,
                "", 0);
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

        return packBuffer(bf);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }
}
