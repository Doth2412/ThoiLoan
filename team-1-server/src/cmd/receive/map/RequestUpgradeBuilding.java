package cmd.receive.map;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import util.LoggerUtil;
import bitzero.server.extensions.ExtensionLogLevel;

import java.nio.ByteBuffer;

/**
 * Request model for buy building operations
 * Handles client requests to upgrade a building
 */
public class RequestUpgradeBuilding extends BaseCmd {

    private String buildingTypeId;
    private int buildingIndex;

    /**
     * Constructor for UpgradeBuilding request
     * 
     * @param dataCmd The DataCmd containing the request data
     */
    public RequestUpgradeBuilding(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            buildingTypeId = readString(bf);
            buildingIndex = readInt(bf);
            if (buildingTypeId == null || buildingTypeId.isEmpty()) {
                throw new IllegalArgumentException("buildingTypeId cannot be null or empty");
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestUpgradeBuilding: Unpacked buildingTypeId: {}",
                    buildingTypeId);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestUpgradeBuilding: Error unpacking data: " + e.getMessage(), e);
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

    // Setters for testing purposes
    public void setBuildingTypeId(String buildingTypeId) {
        this.buildingTypeId = buildingTypeId;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    @Override
    public String toString() {
        return "RequestUpgradeBuilding{" +
                "buildingTypeId='" + buildingTypeId + '\'' +
                ", buildingIndex=" + buildingIndex +
                '}';
    }
}
