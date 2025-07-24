package cmd.receive.battle;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import util.LoggerUtil;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

/**
 * Request model for harvesting resources from a resource generator building
 * Matches client-side CmdSendHarvestResource structure
 */
public class RequestFindBattle extends BaseCmd {
    // Building information
    private String playerName;
    private int prestigePoint;

    public RequestFindBattle(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            playerName = readString(bf);
            prestigePoint = readInt(bf);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestFindBattle: Unpacked player name: {} with prestige point: {}, isFirstSearch: {}", playerName, prestigePoint);
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestFindBattle: Error unpacking data: " + e.getMessage(), e);
        }
    }
    public String getPlayerName() {
        return playerName;
    }
    public int getPrestigePoint() {
        return prestigePoint;
    }
    @Override
    public String toString() {
        return "RequestFindBattle{" +
                "playerName='" + playerName + '\'' +
                ", prestigePoint=" + prestigePoint +
                '}';
    }
}