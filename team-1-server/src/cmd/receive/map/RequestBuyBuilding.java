package cmd.receive.map;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import util.LoggerUtil;
import bitzero.server.extensions.ExtensionLogLevel;

import java.nio.ByteBuffer;

/**
 * Request model for buy building operations
 * Handles client requests to purchase and place a new building
 */
public class RequestBuyBuilding extends BaseCmd {

    private String buildingTypeId;
    private int positionX;
    private int positionY;

    /**
     * Constructor for BuyBuilding request
     * 
     * @param dataCmd The DataCmd containing the request data
     */
    public RequestBuyBuilding(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            buildingTypeId = readString(bf);
            positionX = readInt(bf);
            positionY = readInt(bf);

            if (buildingTypeId == null || buildingTypeId.isEmpty()) {
                throw new IllegalArgumentException("buildingTypeId cannot be null or empty");
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestBuyBuilding: Unpacked buildingTypeId: {}, position: ({}, {})",
                    buildingTypeId, positionX, positionY);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestBuyBuilding: Error unpacking data: " + e.getMessage(), e);
            buildingTypeId = "";
            positionX = 0;
            positionY = 0;
            CommonHandle.writeErrLog(e);
        }
    }

    // Getters
    public String getBuildingTypeId() {
        return buildingTypeId;
    }

    public int getPositionX() {
        return positionX;
    }

    public int getPositionY() {
        return positionY;
    }

    // Setters for testing purposes
    public void setBuildingTypeId(String buildingTypeId) {
        this.buildingTypeId = buildingTypeId;
    }

    public void setPositionX(int positionX) {
        this.positionX = positionX;
    }

    public void setPositionY(int positionY) {
        this.positionY = positionY;
    }

    @Override
    public String toString() {
        return "RequestBuyBuilding{" +
                "buildingTypeId='" + buildingTypeId + '\'' +
                ", positionX=" + positionX +
                ", positionY=" + positionY +
                '}';
    }
}
