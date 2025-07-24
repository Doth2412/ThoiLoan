package cmd.send.map;

import java.nio.ByteBuffer;
import cmd.CmdDefine;
import cmd.ErrorConst;
import bitzero.server.extensions.data.BaseMsg;

public class ResponseUpgradeBuildingComplete extends BaseMsg {
    private boolean success;
    private String message;
    private int buildingIndex;
    private long upgradeTime;
    private String buildingTypeId;

    public ResponseUpgradeBuildingComplete(short error, boolean success, String message, int buildingIndex,
            String buildingTypeId) {
        super(CmdDefine.UPGRADE_BUILDING_COMPLETE, error);
        this.success = success;
        this.message = message;
        this.buildingIndex = buildingIndex;
        this.buildingTypeId = buildingTypeId;
        this.upgradeTime = System.currentTimeMillis();
    }

    public static ResponseUpgradeBuildingComplete success(String buildingTypeId, int buildingIndex) {
        return new ResponseUpgradeBuildingComplete(ErrorConst.SUCCESS, true, "Building upgrade completed successfully",
                buildingIndex,
                buildingTypeId);
    }

    public static ResponseUpgradeBuildingComplete failure(String message) {
        return new ResponseUpgradeBuildingComplete(ErrorConst.ACTION_INVALID, false, message, -1, "");
    }

    public static ResponseUpgradeBuildingComplete serviceInvalid(String message) {
        return new ResponseUpgradeBuildingComplete(ErrorConst.SERVICE_INVALID, false, message, -1, "");
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);
        bf.putInt(buildingIndex);
        bf.putLong(upgradeTime);
        putStr(bf, buildingTypeId);
        return packBuffer(bf);
    }


    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public long getUpgradeTime() {
        return upgradeTime;
    }

    public String getBuildingTypeId() {
        return buildingTypeId;
    }
}
