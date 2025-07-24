package cmd.receive.battle;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import model.enums.TroopTrainingSlot;
import util.LoggerUtil;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

public class RequestBattleResult extends BaseCmd {

    private int mapIndex;
    private int stars;
    private int lootedGold;
    private int lootedElixir;
    private int defenderPlayerId;

    private List<TroopTrainingSlot> troopUsed;

    public RequestBattleResult(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            mapIndex = readInt(bf);
            stars = readInt(bf);
            lootedGold = readInt(bf);
            lootedElixir = readInt(bf);
            defenderPlayerId = readInt(bf);
            int troopSize = readInt(bf);
            this.troopUsed = new ArrayList<>(troopSize);

            for (int i = 0; i < troopSize; i++) {
                String troopType = readString(bf);
                int troopAmount = readInt(bf);
//                this.troopUsed.add(new TroopTrainingSlot(troopType, troopAmount));
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "RequestBattleResult: Unpacked data successfully - stars: " + stars +
                            ", lootedGold: " + lootedGold +
                            ", lootedElixir: " + lootedElixir +
                            ", troopUsed size: " + troopUsed.size());
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "RequestCancelBuyBuilding: Error unpacking data: " + e.getMessage(), e);

        }
    }

    // Getters
    public int getMapIndex() {
        return mapIndex;
    }
    public int getStars() {
        return stars;
    }
    public int getLootedGold() {
        return lootedGold;
    }
    public int getLootedElixir() {
        return lootedElixir;
    }

    public int getDefenderPlayerId() {
        return defenderPlayerId;
    }
    public List<TroopTrainingSlot> getTroopUsed() {
        return troopUsed;
    }

    @Override
    public String toString() {
        return  "RequestBattleResult{" +
                "mapIndex=" + mapIndex +
                ", stars=" + stars +
                ", lootedGold=" + lootedGold +
                ", lootedElixir=" + lootedElixir +
                ", troopUsed=" + troopUsed +
                '}';
    }
}
