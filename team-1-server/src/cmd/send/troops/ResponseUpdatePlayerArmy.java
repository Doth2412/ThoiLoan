package cmd.send.troops;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;
import model.enums.TroopTrainingSlot;

import java.nio.ByteBuffer;
import java.util.List;

/**
 * Response object for updating barrack training queue.
 * Sent to the client after processing a troop training request.
 * Contains operation result and updated barrack queue state.
 */
public class ResponseUpdatePlayerArmy extends BaseMsg {
    private final boolean success;
    private final String message;
    private final List<TroopTrainingSlot> army;    /**
     * Constructor for barrack queue update response
     *
     * @param error          Error code (0 for success)
     * @param success        Whether the queue update operation was successful
     * @param message        Success/error message
     * @param army  List of troops in army
     */
    public ResponseUpdatePlayerArmy(
            short error,
            boolean success,
            String message,
            List<TroopTrainingSlot> army) {
        super(CmdDefine.UPDATE_PLAYER_ARMY, error);
        this.success = success;
        this.message = message;
        this.army = army;
    }

    @Override    public byte[] createData() {
        /*
         * UpdateBarrackQueue Response Packet Format:
         * 
         * Operation Result (5+ bytes):
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
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
        bf.putInt(army.size());
        for (TroopTrainingSlot troop : army) {
            putStr(bf, troop.getTroopType());
            bf.putInt(troop.getTroopAmount());
        }
        return packBuffer(bf);
    }    /**
     * Factory method for creating a success response
     *
     * @param army  List of troops in training queue
     * @return A success response with the updated barrack queue information
     */
    public static ResponseUpdatePlayerArmy success(
            List<TroopTrainingSlot> army) {
        return new ResponseUpdatePlayerArmy(
                ErrorConst.SUCCESS,
                true,
                "Army updated successfully",
                army);
    }    /**
     * Factory method for creating a validation failure response
     * 
     * @param message The error message describing why validation failed
     * @return A failure response with appropriate error information
     */
    public static ResponseUpdatePlayerArmy validationFailure(String message) {
        return new ResponseUpdatePlayerArmy(
                ErrorConst.ACTION_INVALID,
                false,
                message,
                null);
    }    /**
     * Factory method for creating a service failure response
     * 
     * @return A failure response indicating an internal server error
     */
    public static ResponseUpdatePlayerArmy serviceInvalid() {
        return new ResponseUpdatePlayerArmy(
                ErrorConst.SERVICE_INVALID,
                false,
                "Internal server error",
                null);
    }
}
