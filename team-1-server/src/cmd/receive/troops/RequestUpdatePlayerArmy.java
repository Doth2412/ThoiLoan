package cmd.receive.troops;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.Debug;
import model.enums.TroopTrainingSlot;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;


/**
 * Request model for updating the barrack queue.
 * This class unpacks data sent from the client's CmdSendUpdateBarrackQueue.
 */
public class RequestUpdatePlayerArmy extends BaseCmd {

    private List<TroopTrainingSlot> playerArmy;

    public RequestUpdatePlayerArmy(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            int armySize = readInt(bf);
            this.playerArmy = new ArrayList<>(armySize);
            for (int i = 0; i < armySize; i++) {
                String troopType = readString(bf);
                int troopAmount = readInt(bf);
                this.playerArmy.add(new TroopTrainingSlot(troopType, troopAmount));
            }
            Debug.warn("RequestUpdatePlayerArmy: Unpacked data successfully - " +
                    ", playerArmy size: " + playerArmy.size());

        } catch (Exception e) {
            Debug.warn("Error unpacking RequestUpdatePlayerArmy: " + e.getMessage());
            this.playerArmy = new ArrayList<>();
        }
    }


    public List<TroopTrainingSlot> getPlayerArmy() {
        return playerArmy;
    }

    // Setters
    @Override
    public String toString() {
        return "RequestUpdateBarrackQueue{" +
                ", playerArmy=" + playerArmy +
                '}';
    }
}