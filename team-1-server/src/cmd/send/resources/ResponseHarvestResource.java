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
public class ResponseHarvestResource extends BaseMsg {
    private final boolean success;
    private final String message;
    private final int buildingIndex;
    private final long harvestTime;
    private final int harvestedAmount;
    private final ResourceType resourceType;
    private final Resources updatedResources;
    private final long nextHarvestTime;

    /**
     * Constructor for harvest response
     * 
     * @param error            Error code (0 for success)
     * @param success          Whether the harvest operation was successful
     * @param message          Success/error message
     * @param buildingIndex    Index of the harvested building
     * @param harvestTime      Time when the harvest occurred
     * @param harvestedAmount  Amount of resources harvested
     * @param resourceType     Type of resource harvested (gold/oil)
     * @param updatedResources Player's updated resource totals
     * @param nextHarvestTime  Next time harvest will be available
     */
    public ResponseHarvestResource(
            short error,
            boolean success,
            String message,
            int buildingIndex,
            long harvestTime,
            int harvestedAmount,
            ResourceType resourceType,
            Resources updatedResources,
            long nextHarvestTime) {
        super(CmdDefine.HARVEST_RESOURCE, error);
        this.success = success;
        this.message = message;
        this.buildingIndex = buildingIndex;
        this.harvestTime = harvestTime;
        this.harvestedAmount = harvestedAmount;
        this.resourceType = resourceType;
        this.updatedResources = updatedResources;
        this.nextHarvestTime = nextHarvestTime;
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
         * Building Data (12 bytes):
         * - int buildingIndex (4 bytes)
         * - long harvestTime (8 bytes)
         * 
         * Resource Data (12+ bytes):
         * - int harvestedAmount (4 bytes)
         * - String resourceType (variable length with size prefix)
         * 
         * Updated Resources (12 bytes):
         * - int gold (4 bytes)
         * - int oil (4 bytes)
         * - int gems (4 bytes)
         * 
         * Next Harvest (8 bytes):
         * - long nextHarvestTime (8 bytes)
         */
        ByteBuffer bf = makeBuffer();

        // Pack operation result
        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);

        // Pack building data
        bf.putInt(buildingIndex);
        bf.putLong(harvestTime);

        // Pack resource data
        bf.putInt(harvestedAmount);
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

        // Pack next harvest time
        bf.putLong(nextHarvestTime);

        return packBuffer(bf);
    }

    /**
     * Factory method for creating a success response
     */
    public static ResponseHarvestResource success(
            int buildingIndex,
            int harvestedAmount,
            ResourceType resourceType,
            long harvestTime,
            Resources updatedResources,
            long nextHarvestTime) {
        return new ResponseHarvestResource(
                ErrorConst.SUCCESS,
                true,
                "Resources harvested successfully",
                buildingIndex,
                harvestTime,
                harvestedAmount,
                resourceType,
                updatedResources,
                nextHarvestTime);
    }

    /**
     * Factory method for creating a validation failure response
     */
    public static ResponseHarvestResource validationFailure(String message) {
        return new ResponseHarvestResource(
                ErrorConst.ACTION_INVALID,
                false,
                message,
                0,
                System.currentTimeMillis(),
                0,
                ResourceType.NONE,
                null,
                0);
    }

    /**
     * Factory method for creating a service failure response
     */
    public static ResponseHarvestResource serviceInvalid() {
        return new ResponseHarvestResource(
                ErrorConst.SERVICE_INVALID,
                false,
                "Internal server error",
                0,
                System.currentTimeMillis(),
                0,
                ResourceType.NONE,
                null,
                0);
    }
}
