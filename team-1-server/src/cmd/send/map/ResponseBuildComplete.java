package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response model for build complete operations
 * Sends the result of building completion back to the client
 */
public class ResponseBuildComplete extends BaseMsg {

    private boolean success;
    private String message;
    private String buildingID;
    private int builderIndex;
    private long completionTime;

    /**
     * Constructor for BuildComplete response
     * 
     * @param error        Error code (0 for success, non-zero for errors)
     * @param success      Whether the build completion was successful
     * @param message      Message describing the result
     * @param buildingID   The ID of the building that was completed
     * @param builderIndex The index of the builder that completed the building
     */
    public ResponseBuildComplete(short error, boolean success, String message, String buildingID, int builderIndex) {
        super(CmdDefine.BUILD_COMPLETE, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingID = buildingID != null ? buildingID : "";
        this.builderIndex = builderIndex;
        this.completionTime = System.currentTimeMillis();
    }

    /**
     * Convenience constructor for successful completion
     * 
     * @param buildingID   The ID of the building that was completed
     * @param builderIndex The index of the builder that completed the building
     */
    public ResponseBuildComplete(String buildingID, int builderIndex) {
        this((short) 0, true, "SUCCESS", buildingID, builderIndex);
    }

    /**
     * Convenience constructor for failed completion
     * 
     * @param error   Error code
     * @param message Error message
     */
    public ResponseBuildComplete(short error, String message) {
        this(error, false, message, "", -1);
    }

    @Override
    public byte[] createData() {
        /*
         * BuildComplete Response Data Packet Format:
         * 
         * Response Data:
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         * - String buildingID (variable length with size prefix)
         * - int builderIndex (4 bytes)
         * - long completionTime (8 bytes)
         */
        ByteBuffer bf = makeBuffer();

        // Pack success flag
        bf.put((byte) (success ? 1 : 0));

        // Pack message
        putStr(bf, message);

        // Pack building ID
        putStr(bf, buildingID);

        // Pack builder index
        bf.putInt(builderIndex);

        // Pack completion time
        bf.putLong(completionTime);

        return packBuffer(bf);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getBuildingID() {
        return buildingID;
    }

    public int getBuilderIndex() {
        return builderIndex;
    }

    public long getCompletionTime() {
        return completionTime;
    }

    @Override
    public String toString() {
        return "ResponseBuildComplete{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingID='" + buildingID + '\'' +
                ", builderIndex=" + builderIndex +
                ", completionTime=" + completionTime +
                '}';
    }

    // Static helper methods for common response types

    /**
     * Creates a success response with standardized SUCCESS message
     * 
     * @param buildingID   The ID of the building that was completed
     * @param builderIndex The index of the builder that completed the building
     * @return ResponseBuildComplete with SUCCESS status
     */
    public static ResponseBuildComplete success(String buildingID, int builderIndex) {
        return new ResponseBuildComplete(ErrorConst.SUCCESS, true, "SUCCESS", buildingID, builderIndex);
    }

    /**
     * Creates an action invalid response (validation failure)
     * 
     * @return ResponseBuildComplete with ACTION_INVALID status
     */
    public static ResponseBuildComplete actionInvalid() {
        return new ResponseBuildComplete(ErrorConst.ACTION_INVALID, "ACTION_INVALID");
    }

    /**
     * Creates a service invalid response (server error)
     * 
     * @return ResponseBuildComplete with SERVICE_INVALID status
     */
    public static ResponseBuildComplete serviceInvalid() {
        return new ResponseBuildComplete(ErrorConst.SERVICE_INVALID, "SERVICE_INVALID");
    }
}
