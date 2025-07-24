package cmd.receive.resources;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.Debug;
import config.data.ResourceType;
import util.LoggerUtil;
import bitzero.server.extensions.ExtensionLogLevel;

import java.nio.ByteBuffer;

/**
 * Request model for harvesting resources from a resource generator building
 * Matches client-side CmdSendHarvestResource structure
 */
public class RequestHarvestResource extends BaseCmd {
    // Building information
    private String buildingId;
    private int buildingIndex;
    private ResourceType resourceType;
    private int amountHarvested;
    private long harvestTime;
    private String generatorState;

    // Player information
    private int playerId;
    private String username;

    public RequestHarvestResource(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
        Debug.warn("RequestHarvestResource: Constructor called.");
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            // Unpack building information
            buildingId = readString(bf);
            buildingIndex = readInt(bf);
            resourceType = ResourceType.valueOf(readString(bf).toUpperCase());
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestHarvestResource: Unpacked resource type: {}", resourceType);
            amountHarvested = readInt(bf);
            harvestTime = readLong(bf);
            generatorState = readString(bf);

            // Unpack player information
            playerId = readInt(bf);
            username = readString(bf);

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestHarvestResource: Unpacked data successfully - buildingId: {}, buildingIndex: {}, type: {}, resourceType: {}",
                    buildingId, buildingIndex, resourceType);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestHarvestResource: Error unpacking data: " + e.getMessage(), e);
            initializeDefaultValues();
        }
    }

    private void initializeDefaultValues() {
        buildingId = "";
        buildingIndex = -1;
        resourceType = ResourceType.NONE;
        amountHarvested = 0;
        harvestTime = 0;
        generatorState = "";
        playerId = -1;
        username = "";
    }

    // Getters
    public String getBuildingId() {
        return buildingId;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }


    public ResourceType getResourceType() {
        return resourceType;
    }

    public int getAmountHarvested() {
        return amountHarvested;
    }

    public long getHarvestTime() {
        return harvestTime;
    }

    public String getGeneratorState() {
        return generatorState;
    }

    public int getPlayerId() {
        return playerId;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public String toString() {
        return "RequestHarvestResource{" +
                "buildingId='" + buildingId + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", resourceType='" + resourceType + '\'' +
                ", amountHarvested=" + amountHarvested +
                ", harvestTime=" + harvestTime +
                ", generatorState='" + generatorState + '\'' +
                ", playerId=" + playerId +
                ", username='" + username + '\'' +
                '}';
    }
}