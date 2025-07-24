package model.building;

import model.enums.TroopTrainingSlot;
import model.util.Position;
import model.enums.BuildingOperationalState;

import java.util.List;
import java.util.Queue;
import java.util.LinkedList;


/**
 * Server-side model for the Barrack building.
 * This structure is designed to closely mirror the client-side Barrack.js model
 * to ensure seamless data synchronization. It uses a startTime to validate client actions.
 */
public class Barrack extends Building {
    /**
     * The queue of troops being trained. Each element represents a stack of a single troop type.
     * This directly corresponds to the `trainingQueue` array in Barrack.js.
     */
    private List<TroopTrainingSlot> trainingQueue;

    /**
     * The timestamp (epoch milliseconds) of when the current training batch started.
     * The server uses this time to validate completion requests from the client.
     */

    // Default constructor for frameworks like Gson/Jackson
    public Barrack() {
        super();
        this.trainingQueue = new LinkedList<>();
    }

    // Full constructor
    public Barrack(int buildingIndex, String buildingID, int level, Position position,
                   BuildingOperationalState buildingState) {
        super(buildingIndex, buildingID, level, position, buildingState);
        this.trainingQueue = new LinkedList<>();
    }


    // Getters and Setters
    public List<TroopTrainingSlot> getTrainingQueue() {
        return trainingQueue;
    }

    public void setTrainingQueue(List<TroopTrainingSlot> trainingQueue) {
        this.trainingQueue = trainingQueue != null ? trainingQueue : new LinkedList<>();
    }

    @Override
    public String toString() {
        return "Barrack{" +
                "trainingQueue=" + trainingQueue +
                ", startTime=" + getStateStartingTime() +
                ", " + super.toString() +
                '}';
    }
}
