package cmd.send.map;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;

import java.nio.ByteBuffer;

/**
 * Response model for move building operations
 * Sends the result of building movement back to the client
 */
public class ResponseMoveBuilding extends BaseMsg {

    private boolean success;
    private String message;
    private int buildingIndex;
    private int oldPositionX;
    private int oldPositionY;
    private int newPositionX;
    private int newPositionY;
    private long moveTime;

    /**
     * Constructor for MoveBuilding response
     * 
     * @param error         Error code (0 for success, non-zero for errors)
     * @param success       Whether the building move was successful
     * @param message       Message describing the result
     * @param buildingIndex The index of the building that was moved
     * @param oldPositionX  The old X coordinate of the building
     * @param oldPositionY  The old Y coordinate of the building
     * @param newPositionX  The new X coordinate of the building
     * @param newPositionY  The new Y coordinate of the building
     */
    public ResponseMoveBuilding(short error, boolean success, String message, int buildingIndex,
            int oldPositionX, int oldPositionY, int newPositionX, int newPositionY) {
        super(CmdDefine.MOVE_BUILDING, error);
        this.success = success;
        this.message = message != null ? message : "";
        this.buildingIndex = buildingIndex;
        this.oldPositionX = oldPositionX;
        this.oldPositionY = oldPositionY;
        this.newPositionX = newPositionX;
        this.newPositionY = newPositionY;
        this.moveTime = System.currentTimeMillis();
    }

    /**
     * Convenience constructor for successful move
     * 
     * @param buildingIndex The index of the building that was moved
     * @param oldPositionX  The old X coordinate of the building
     * @param oldPositionY  The old Y coordinate of the building
     * @param newPositionX  The new X coordinate of the building
     * @param newPositionY  The new Y coordinate of the building
     */
    public ResponseMoveBuilding(int buildingIndex, int oldPositionX, int oldPositionY,
            int newPositionX, int newPositionY) {
        this((short) 0, true, "SUCCESS", buildingIndex, oldPositionX, oldPositionY, newPositionX, newPositionY);
    }

    /**
     * Convenience constructor for failed move
     * 
     * @param error   Error code
     * @param message Error message
     */
    public ResponseMoveBuilding(short error, String message) {
        this(error, false, message, -1, -1, -1, -1, -1);
    }

    @Override
    public byte[] createData() {
        /*
         * MoveBuilding Response Data Packet Format:
         * 
         * Response Data:
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         * - int buildingIndex (4 bytes)
         * - int oldPositionX (4 bytes)
         * - int oldPositionY (4 bytes)
         * - int newPositionX (4 bytes)
         * - int newPositionY (4 bytes)
         * - long moveTime (8 bytes)
         */
        ByteBuffer bf = makeBuffer();

        // Pack success flag
        bf.put((byte) (success ? 1 : 0));

        // Pack message
        putStr(bf, message);

        // Pack building index
        bf.putInt(buildingIndex);

        // Pack old position
        bf.putInt(oldPositionX);
        bf.putInt(oldPositionY);

        // Pack new position
        bf.putInt(newPositionX);
        bf.putInt(newPositionY);

        // Pack move time
        bf.putLong(moveTime);

        return packBuffer(bf);
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public int getOldPositionX() {
        return oldPositionX;
    }

    public int getOldPositionY() {
        return oldPositionY;
    }

    public int getNewPositionX() {
        return newPositionX;
    }

    public int getNewPositionY() {
        return newPositionY;
    }

    public long getMoveTime() {
        return moveTime;
    }

    @Override
    public String toString() {
        return "ResponseMoveBuilding{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", oldPosition=(" + oldPositionX + "," + oldPositionY + ")" +
                ", newPosition=(" + newPositionX + "," + newPositionY + ")" +
                ", moveTime=" + moveTime +
                '}';
    }

    // Static helper methods for common response types

    /**
     * Creates a success response with standardized SUCCESS message
     * 
     * @param buildingIndex The index of the building that was moved
     * @param oldPositionX  The old X coordinate of the building
     * @param oldPositionY  The old Y coordinate of the building
     * @param newPositionX  The new X coordinate of the building
     * @param newPositionY  The new Y coordinate of the building
     * @return ResponseMoveBuilding with SUCCESS status
     */
    public static ResponseMoveBuilding success(int buildingIndex, int oldPositionX, int oldPositionY,
            int newPositionX, int newPositionY) {
        return new ResponseMoveBuilding(ErrorConst.SUCCESS, true, "SUCCESS", buildingIndex,
                oldPositionX, oldPositionY, newPositionX, newPositionY);
    }

    /**
     * Creates an action invalid response (validation failure)
     * 
     * @param message Custom error message
     * @return ResponseMoveBuilding with ACTION_INVALID status
     */
    public static ResponseMoveBuilding actionInvalid(String message) {
        return new ResponseMoveBuilding(ErrorConst.ACTION_INVALID, message != null ? message : "ACTION_INVALID");
    }

    /**
     * Creates an action invalid response (validation failure) with default message
     * 
     * @return ResponseMoveBuilding with ACTION_INVALID status
     */
    public static ResponseMoveBuilding actionInvalid() {
        return actionInvalid("ACTION_INVALID");
    }

    /**
     * Creates a service invalid response (server error)
     * 
     * @param message Custom error message
     * @return ResponseMoveBuilding with SERVICE_INVALID status
     */
    public static ResponseMoveBuilding serviceInvalid(String message) {
        return new ResponseMoveBuilding(ErrorConst.SERVICE_INVALID, message != null ? message : "SERVICE_INVALID");
    }

    /**
     * Creates a service invalid response (server error) with default message
     * 
     * @return ResponseMoveBuilding with SERVICE_INVALID status
     */
    public static ResponseMoveBuilding serviceInvalid() {
        return serviceInvalid("SERVICE_INVALID");
    }
}
