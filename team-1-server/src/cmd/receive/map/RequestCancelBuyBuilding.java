package cmd.receive.map;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import util.LoggerUtil;
import bitzero.server.extensions.ExtensionLogLevel;

import java.nio.ByteBuffer;

/**
 * Request model for cancel building construction operations
 * Handles client requests to cancel a building currently under construction
 */
public class RequestCancelBuyBuilding extends BaseCmd {

    private String buildingTypeId;
    private int buildingIndex;

    /**
     * Constructor for CancelBuyBuilding request
     * 
     * @param dataCmd The DataCmd containing the request data
     */
    public RequestCancelBuyBuilding(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            buildingIndex = readInt(bf);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestCancelBuyBuilding: Unpacked buildingTypeId: {}, buildingIndex: {}",
                     buildingIndex);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestCancelBuyBuilding: Error unpacking data: " + e.getMessage(), e);
            buildingIndex = -1;
            CommonHandle.writeErrLog(e);
        }
    }

    // Getters
    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public void setBuildingTypeId(String buildingTypeId) {
        this.buildingTypeId = buildingTypeId;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    @Override
    public String toString() {
        return "RequestCancelBuyBuilding{" +
                "buildingTypeId='" + buildingTypeId + '\'' +
                ", buildingIndex=" + buildingIndex +
                '}';
    }
}
