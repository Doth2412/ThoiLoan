package cmd.receive.battle;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import model.enums.TroopTrainingSlot;
import util.LoggerUtil;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

public class RequestPVPBattleResult extends BaseCmd {
    private int lootedGold;
    private int lootedElixir;
    private String defenderName;
    private boolean isWon;
    private List<TroopTrainingSlot> troopUsed;

    public RequestPVPBattleResult(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            defenderName = readString(bf);
            isWon = readByte(bf) == 1;
            lootedGold = readInt(bf);
            lootedElixir = readInt(bf);
            int troopSize = readInt(bf);
            this.troopUsed = new ArrayList<>(troopSize);

            for (int i = 0; i < troopSize; i++) {
                String troopType = readString(bf);
                int troopAmount = readInt(bf);
                this.troopUsed.add(new TroopTrainingSlot(troopType, troopAmount));
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestPVPBattleResult: Unpacked data successfully" +
                            ", defenderName: " + defenderName +
                            ", lootedGold: " + lootedGold +
                            ", lootedElixir: " + lootedElixir +
                            ", troopUsed size: " + troopUsed.size());
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestPVPBattleResult: Error unpacking data: " + e.getMessage(), e);

        }
    }

    // Getters
    public int getLootedGold() {
        return lootedGold;
    }
    public int getLootedElixir() {
        return lootedElixir;
    }

    public boolean getWon() {
        return isWon;
    }
    public List<TroopTrainingSlot> getTroopUsed() {
        return troopUsed;
    }

    public String getDefenderName() {
        return defenderName;
    }

    @Override
    public String toString() {
        return  "RequestPVPBattleResult{" +
                ", lootedGold=" + lootedGold +
                ", lootedElixir=" + lootedElixir +
                ", troopUsed=" + troopUsed +
                '}';
    }
}
