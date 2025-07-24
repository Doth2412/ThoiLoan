package cmd.receive.map;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import util.LoggerUtil;
import bitzero.server.extensions.ExtensionLogLevel;

import java.nio.ByteBuffer;

/**
 * Request model for move building operations
 * Handles client requests to move an existing building to a new position
 */
public class RequestMoveBuilding extends BaseCmd {

    private String buildingID;
    private int buildingIndex;
    private int newPositionX;
    private int newPositionY;

    public RequestMoveBuilding(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            buildingID = readString(bf);
            buildingIndex = readInt(bf);
            newPositionX = readInt(bf);
            newPositionY = readInt(bf);

            if (buildingIndex < 0) {
                throw new IllegalArgumentException(
                        String.format("Invalid payload: buildingIndex=%d must be non-negative", buildingIndex));
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestMoveBuilding: Unpacked buildingIndex: {}, newPosition: ({}, {})",
                    buildingIndex, newPositionX, newPositionY);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestMoveBuilding: Error unpacking data: " + e.getMessage(), e);
            // Set default values in case of error
            buildingIndex = -1;
            newPositionX = 0;
            newPositionY = 0;
            CommonHandle.writeErrLog(e);
        }
    }

    public String getBuildingID() {
        return buildingID;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public int getNewPositionX() {
        return newPositionX;
    }

    public int getNewPositionY() {
        return newPositionY;
    }

    public void setBuildingID(String buildingID) {
        this.buildingID = buildingID;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    public void setNewPositionX(int newPositionX) {
        this.newPositionX = newPositionX;
    }

    public void setNewPositionY(int newPositionY) {
        this.newPositionY = newPositionY;
    }

    @Override
    public String toString() {
        return "RequestMoveBuilding{" +
                "buildingIndex=" + buildingIndex +
                ", newPositionX=" + newPositionX +
                ", newPositionY=" + newPositionY +
                '}';
    }
}
