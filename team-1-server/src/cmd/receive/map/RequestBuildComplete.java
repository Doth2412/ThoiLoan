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
public class RequestBuildComplete extends BaseCmd {

    private String buildingID;
    private int buildingIndex;
    public RequestBuildComplete(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            buildingID = readString(bf);
            buildingIndex = readInt(bf);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestBuildComplete: Unpacked buildingID" +
                    buildingID);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestBuildComplete: Error unpacking data: ");
        }
    }

    public String getBuildingID() {
        return buildingID;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }
    public void setBuildingID(String buildingID) {
        this.buildingID = buildingID;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    @Override
    public String toString() {
        return "RequestBuildComplete{" +
                "buildingID='" + buildingID + '\'' +
                ", builderIndex=" +
                '}';
    }
}
