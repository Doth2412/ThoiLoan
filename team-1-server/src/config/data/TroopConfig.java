package config.data;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration holder for troop data
 */
public class TroopConfig {
    private Map<String, Map<Integer, TroopData>> troopDataMap;
    private Map<String, TroopData> troopBaseDataMap;

    /**
     * Default constructor
     */
    public TroopConfig() {
        this.troopDataMap = new HashMap<>();
        this.troopBaseDataMap = new HashMap<>();
    }

    /**
     * Constructor with all fields
     */
    public TroopConfig(Map<String, Map<Integer, TroopData>> troopDataMap, Map<String, TroopData> troopBaseDataMap) {
        this.troopDataMap = troopDataMap;
        this.troopBaseDataMap = troopBaseDataMap;
    }

    public Map<String, Map<Integer, TroopData>> getTroopDataMap() {
        return troopDataMap;
    }

    public void setTroopDataMap(Map<String, Map<Integer, TroopData>> troopDataMap) {
        this.troopDataMap = troopDataMap;
    }

    public Map<String, TroopData> getTroopBaseDataMap() {
        return troopBaseDataMap;
    }

    public void setTroopBaseDataMap(Map<String, TroopData> troopBaseDataMap) {
        this.troopBaseDataMap = troopBaseDataMap;
    }

    @Override
    public String toString() {
        return "TroopConfig{" +
                "troopDataMap=" + troopDataMap +
                ", troopBaseDataMap=" + troopBaseDataMap +
                '}';
    }
}