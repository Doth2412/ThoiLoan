package cmd.receive.map;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.Debug;
import util.LoggerUtil;
import bitzero.server.extensions.ExtensionLogLevel;

import java.nio.ByteBuffer;
import java.util.logging.Logger;

/**
 * Request model for build complete operations
 * Handles client requests to finalize building construction
 */
public class RequestUpgradeBuildingComplete extends BaseCmd {

    private String buildingID;
    private int buildingIndex;
    private int builderIndex;

    public RequestUpgradeBuildingComplete(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
        Debug.warn("RequestUpgradeBuildingComplete: Constructor called.");
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            buildingID = readString(bf);
            buildingIndex = readInt(bf);
            builderIndex = readInt(bf);
            if (buildingID == null || buildingID.isEmpty() || builderIndex < 0) {
                throw new IllegalArgumentException(
                        String.format("Invalid payload: buildingID=%s, builderIndex=%d",
                                buildingID, builderIndex));
            }
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestUpgradeBuildingComplete: Unpacked buildingID: {}, builderIndex: {}",
                    buildingID, builderIndex);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestUpgradeBuildingComplete: Error unpacking data: " + e.getMessage(), e);
        }
    }

    public String getBuildingID() {
        return buildingID;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public int getBuilderIndex() {
        return builderIndex;
    }

    public void setBuildingID(String buildingID) {
        this.buildingID = buildingID;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    public void setBuilderIndex(int builderIndex) {
        this.builderIndex = builderIndex;
    }

    @Override
    public String toString() {
        return "RequestUpgradeBuildingComplete{" +
                "buildingID='" + buildingID + '\'' +
                ", builderIndex=" + builderIndex +
                '}';
    }
}
