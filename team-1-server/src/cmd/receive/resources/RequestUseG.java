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
public class RequestUseG extends BaseCmd {
    private ResourceType resourceType;
    private int amountUsed;

    public RequestUseG(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            amountUsed = readInt(bf);
            resourceType = ResourceType.valueOf(readString(bf).toUpperCase());
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestUseG: Unpacked resource type: {}", resourceType);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestUseG: Error unpacking data: " + e.getMessage(), e);
            initializeDefaultValues();
        }
    }

    private void initializeDefaultValues() {
        resourceType = ResourceType.NONE;
        amountUsed = 0;
    }


    public ResourceType getResourceType() {
        return resourceType;
    }

    public int getAmountUsed() {
        return amountUsed;
    }
    @Override
    public String toString() {
        return "RequestHarvestResource{" +
                ", resourceType='" + resourceType + '\'' +
                ", amountUsed=" + amountUsed +
                '}';
    }
}