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
public class RequestUpdateBarrackQueue extends BaseCmd {
    private String buildingType;
    private int buildingIndex;
    private long stateStartingTime;
    private List<TroopTrainingSlot> trainingQueue;

    public RequestUpdateBarrackQueue(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            this.buildingType = readString(bf);
            this.buildingIndex = readInt(bf);
            // Assuming client sends start time in seconds, converting to milliseconds
            this.stateStartingTime = readInt(bf) * 1000L;
            int queueSize = readInt(bf);
            this.trainingQueue = new ArrayList<>(queueSize);

            for (int i = 0; i < queueSize; i++) {
                String troopType = readString(bf);
                int troopAmount = readInt(bf);
                this.trainingQueue.add(new TroopTrainingSlot(troopType, troopAmount));
            }
            Debug.warn("RequestUpdateBarrackQueue: Unpacked data successfully - " +
                    "buildingType: " + buildingType +
                    ", buildingIndex: " + buildingIndex +
                    ", startTime: " + stateStartingTime +
                    ", trainingQueue size: " + trainingQueue.size());

        } catch (Exception e) {
            Debug.warn("Error unpacking RequestUpdateBarrackQueue: " + e.getMessage());
            this.buildingType = "";
            this.buildingIndex = -1;
            this.stateStartingTime = 0;
            this.trainingQueue = new ArrayList<>();
        }
    }

    // Getters
    public String getBuildingType() {
        return buildingType;
    }

    public int getBuildingIndex() {
        return buildingIndex;
    }

    public long getStateStartingTime() {
        return stateStartingTime;
    }

    public List<TroopTrainingSlot> getTrainingQueue() {
        return trainingQueue;
    }

    // Setters
    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public void setBuildingIndex(int buildingIndex) {
        this.buildingIndex = buildingIndex;
    }

    public void setStateStartingTime(long stateStartingTime) {
        this.stateStartingTime = stateStartingTime;
    }

    public void setTrainingQueue(List<TroopTrainingSlot> trainingQueue) {
        this.trainingQueue = trainingQueue;
    }

    @Override
    public String toString() {
        return "RequestUpdateBarrackQueue{" +
                "buildingType='" + buildingType + '\'' +
                ", buildingIndex=" + buildingIndex +
                ", startTime=" + stateStartingTime +
                ", trainingQueue=" + trainingQueue +
                '}';
    }
}