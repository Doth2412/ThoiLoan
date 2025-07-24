package cmd.send.troops;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;
import model.Resources;
import model.enums.TroopTrainingSlot;

import java.nio.ByteBuffer;
import java.util.List;

/**
 * Response object for updating barrack training queue.
 * Sent to the client after processing a troop training request.
 * Contains operation result and updated barrack queue state.
 */
public class ResponseUpdateBarrackQueue extends BaseMsg {
    private final boolean success;
    private final String message;
    private final int buildingIndex;
    private final String buildingType;
    private final long startTime;
    private final List<TroopTrainingSlot> trainingQueue;    /**
     * Constructor for barrack queue update response
     *
     * @param error          Error code (0 for success)
     * @param success        Whether the queue update operation was successful
     * @param message        Success/error message
     * @param buildingIndex  Index of the barrack building
     * @param buildingType   Type of the barracks building
     * @param startTime      Training start time (timestamp)
     * @param trainingQueue  List of troops in training queue
     */
    public ResponseUpdateBarrackQueue(
            short error,
            boolean success,
            String message,
            int buildingIndex,
            String buildingType,
            long startTime,
            List<TroopTrainingSlot> trainingQueue) {
        super(CmdDefine.UPDATE_BARRACK_QUEUE, error);
        this.success = success;
        this.message = message;
        this.buildingType = buildingType;
        this.buildingIndex = buildingIndex;
        this.startTime = startTime;
        this.trainingQueue = trainingQueue;
    }

    @Override    public byte[] createData() {
        /*
         * UpdateBarrackQueue Response Packet Format:
         * 
         * Operation Result (5+ bytes):
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         * 
         * Barrack Data:
         * - String buildingType (variable length with size prefix)
         * - int buildingIndex (4 bytes)
         * - long startTime (8 bytes)
         * - int queueSize (4 bytes)
         * 
         * Training Queue (variable length):
         * - For each troop in queue:
         *   - String troopType (variable length with size prefix)
         *   - int troopAmount (4 bytes)
         */
        ByteBuffer bf = makeBuffer();

        // Pack operation result
        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);

        // Pack resource data
        putStr(bf, buildingType);
        bf.putInt(buildingIndex);
        bf.putLong(startTime);
        bf.putInt(trainingQueue.size());
        for (TroopTrainingSlot slot : trainingQueue) {
            putStr(bf, slot.getTroopType());
            bf.putInt(slot.getTroopAmount());
        }
        return packBuffer(bf);
    }    /**
     * Factory method for creating a success response
     * 
     * @param buildingIndex  Index of the barrack building
     * @param buildingType   Type of the barracks building
     * @param startTime      Training start time (timestamp)
     * @param trainingQueue  List of troops in training queue
     * @return A success response with the updated barrack queue information
     */
    public static ResponseUpdateBarrackQueue success(
            int buildingIndex,
            String buildingType,
            long startTime,
            List<TroopTrainingSlot> trainingQueue) {
        return new ResponseUpdateBarrackQueue(
                ErrorConst.SUCCESS,
                true,
                "Troop training queue updated successfully",
                buildingIndex,
                buildingType,
                startTime,
                trainingQueue);
    }    /**
     * Factory method for creating a validation failure response
     * 
     * @param message The error message describing why validation failed
     * @return A failure response with appropriate error information
     */
    public static ResponseUpdateBarrackQueue validationFailure(String message) {
        return new ResponseUpdateBarrackQueue(
                ErrorConst.ACTION_INVALID,
                false,
                message,
                0,
                "none",
                0,
                null);
    }    /**
     * Factory method for creating a service failure response
     * 
     * @return A failure response indicating an internal server error
     */
    public static ResponseUpdateBarrackQueue serviceInvalid() {
        return new ResponseUpdateBarrackQueue(
                ErrorConst.SERVICE_INVALID,
                false,
                "Internal server error",
                0,
                "none",
                0,
                null);
    }
}
