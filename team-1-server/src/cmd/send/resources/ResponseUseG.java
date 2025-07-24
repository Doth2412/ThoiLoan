package cmd.send.resources;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.ErrorConst;
import config.data.ResourceType;
import model.Resources;

import java.nio.ByteBuffer;

/**
 * Response object for resource harvesting operations.
 * Sent to the client after processing a harvest request.
 * Contains operation result and updated player state.
 */
public class ResponseUseG extends BaseMsg {
    private final boolean success;
    private final String message;
    private final int usedAmount;
    private final ResourceType resourceType;
    private final Resources updatedResources;

    /**
     * Constructor for harvest response
     *
     * @param error            Error code (0 for success)
     * @param success          Whether the harvest operation was successful
     * @param message          Success/error message
     * @param usedAmount  Amount of resources harvested
     * @param resourceType     Type of resource harvested (gold/oil)
     * @param updatedResources Player's updated resource totals
     */
    public ResponseUseG(
            short error,
            boolean success,
            String message,
            int usedAmount,
            ResourceType resourceType,
            Resources updatedResources) {
        super(CmdDefine.USE_G, error);
        this.success = success;
        this.message = message;
        this.usedAmount = usedAmount;
        this.resourceType = resourceType;
        this.updatedResources = updatedResources;
    }

    @Override
    public byte[] createData() {
        /*
         * HarvestResource Response Packet Format:
         * 
         * Operation Result (5+ bytes):
         * - boolean success (1 byte)
         * - String message (variable length with size prefix)
         * 
         * Resource Data (12+ bytes):
         * - int usedAmount (4 bytes)
         * - String resourceType (variable length with size prefix)
         * 
         * Updated Resources (12 bytes):
         * - int gold (4 bytes)
         * - int oil (4 bytes)
         * - int gems (4 bytes)
         */
        ByteBuffer bf = makeBuffer();

        // Pack operation result
        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);

        // Pack resource data
        bf.putInt(usedAmount);
        putStr(bf, resourceType.name());

        // Pack updated resource totals
        if (updatedResources != null) {
            bf.putInt(updatedResources.getGold());
            bf.putInt(updatedResources.getOil());
            bf.putInt(updatedResources.getGems());
        } else {
            bf.putInt(0); // gold
            bf.putInt(0); // oil
            bf.putInt(0); // gems
        }

        return packBuffer(bf);
    }

    /**
     * Factory method for creating a success response
     */
    public static ResponseUseG success(
            int usedAmount,
            ResourceType resourceType,

            Resources updatedResources) {
        return new ResponseUseG(
                ErrorConst.SUCCESS,
                true,
                "Resources harvested successfully",
                usedAmount,
                resourceType,
                updatedResources);
    }

    /**
     * Factory method for creating a validation failure response
     */
    public static ResponseUseG validationFailure(String message) {
        return new ResponseUseG(
                ErrorConst.ACTION_INVALID,
                false,
                message,
                0,
                ResourceType.NONE,
                null);
    }

    /**
     * Factory method for creating a service failure response
     */
    public static ResponseUseG serviceInvalid() {
        return new ResponseUseG(
                ErrorConst.SERVICE_INVALID,
                false,
                "Internal server error",
                0,
                ResourceType.NONE,
                null);
    }
}
