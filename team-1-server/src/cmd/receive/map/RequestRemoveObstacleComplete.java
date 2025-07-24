package cmd.receive.map;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import util.LoggerUtil;

import java.nio.ByteBuffer;

/**
 * Request model for cancel building construction operations
 * Handles client requests to cancel a building currently under construction
 */
public class RequestRemoveObstacleComplete extends BaseCmd {

    private String obstacleType;
    private int obstacleIndex;

    /**
     * Constructor for CancelBuyBuilding request
     *
     * @param dataCmd The DataCmd containing the request data
     */
    public RequestRemoveObstacleComplete(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            obstacleType = readString(bf);
            obstacleIndex = readInt(bf);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestCancelBuyBuilding: Unpacked obstacleType: "
                            + obstacleType +  "obstacleIndex: " + obstacleIndex);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestCancelBuyBuilding: Error unpacking data: " + e.getMessage(), e);
            obstacleType = "";
            obstacleIndex = -1;
            CommonHandle.writeErrLog(e);
        }
    }

    // Getters
    public String getObstacleType() {
        return obstacleType;
    }
    public int getObstacleIndex() {
        return obstacleIndex;
    }
    // Setters for testing purposes
    public void setObstacleType(String obstacleType) {
        this.obstacleType = obstacleType;
    }
    public void setObstacleIndex(int obstacleIndex) {
        this.obstacleIndex = obstacleIndex;
    }
    @Override
    public String toString() {
        return "RequestRemoveObstacle{" +
                "obstacleType='" + obstacleType + '\'' +
                ", obstacleIndex=" + obstacleIndex +
                '}';
    }
}
