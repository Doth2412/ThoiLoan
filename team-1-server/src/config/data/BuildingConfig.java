package config.data;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration holder for building data
 */
public class BuildingConfig {
    private Map<String, Map<Integer, ResourceStorageData>> resourceStorageMap;
    private Map<String, Map<Integer, ResourceGeneratorData>> resourceGeneratorMap;
    private Map<String, Map<Integer, TownHallData>> townHallDataMap;
    private Map<String, Map<Integer, DefensiveBuildingData>> defensiveBuildingDataMap;
    private Map<String, Map<Integer, BarrackData>> barrackDataMap;
    private Map<String, Map<Integer, ArmyCampData>>armyCampDataMap ;
    private Map<String, Map<Integer, ObstacleData>> obstacleDataMap;
    private Map<String, Map<Integer, BuilderHutData>> builderHutDataMap;

    /**
     * Default constructor
     */
    public BuildingConfig() {
        this.resourceStorageMap = new HashMap<>();
        this.resourceGeneratorMap = new HashMap<>();
        this.townHallDataMap = new HashMap<>();
        this.defensiveBuildingDataMap = new HashMap<>();
        this.barrackDataMap = new HashMap<>();
        this.armyCampDataMap = new HashMap<>();
        this.obstacleDataMap = new HashMap<>();
        this.builderHutDataMap = new HashMap<>();
    }

    /**
     * Constructor with all fields
     */
    public BuildingConfig(Map<String, Map<Integer, ResourceStorageData>> resourceStorageMap,
            Map<String, Map<Integer, ResourceGeneratorData>> resourceGeneratorMap,
            Map<String, Map<Integer, TownHallData>> townHallDataMap,
            Map<String, Map<Integer, DefensiveBuildingData>> defensiveBuildingDataMap,
            Map<String, Map<Integer, BarrackData>> barrackDataMap,
            Map<String, Map<Integer, ArmyCampData>> armyCampDataMap,
            Map<String, Map<Integer, ObstacleData>> obstacleDataMap,
            Map<String, Map<Integer, BuilderHutData>> builderHutDataMap) {
        this.resourceStorageMap = resourceStorageMap;
        this.resourceGeneratorMap = resourceGeneratorMap;
        this.townHallDataMap = townHallDataMap;
        this.defensiveBuildingDataMap = defensiveBuildingDataMap;
        this.barrackDataMap = barrackDataMap;
        this.armyCampDataMap = armyCampDataMap;
        this.obstacleDataMap = obstacleDataMap;
        this.builderHutDataMap = builderHutDataMap;
    }

    public Map<String, Map<Integer, ResourceStorageData>> getResourceStorageMap() {
        return resourceStorageMap;
    }

    public void setResourceStorageMap(Map<String, Map<Integer, ResourceStorageData>> resourceStorageMap) {
        this.resourceStorageMap = resourceStorageMap;
    }

    public Map<String, Map<Integer, ResourceGeneratorData>> getResourceGeneratorMap() {
        return resourceGeneratorMap;
    }

    public void setResourceGeneratorMap(Map<String, Map<Integer, ResourceGeneratorData>> resourceGeneratorMap) {
        this.resourceGeneratorMap = resourceGeneratorMap;
    }

    public Map<String, Map<Integer, TownHallData>> getTownHallDataMap() {
        return townHallDataMap;
    }

    public void setTownHallDataMap(Map<String, Map<Integer, TownHallData>> townHallDataMap) {
        this.townHallDataMap = townHallDataMap;
    }

    public Map<String, Map<Integer, DefensiveBuildingData>> getDefensiveBuildingDataMap() {
        return defensiveBuildingDataMap;
    }

    public void setDefensiveBuildingDataMap(Map<String, Map<Integer, DefensiveBuildingData>> defensiveBuildingDataMap) {
        this.defensiveBuildingDataMap = defensiveBuildingDataMap;
    }

    public Map<String, Map<Integer, BarrackData>> getBarrackDataMap() {
        return barrackDataMap;
    }

    public void setBarrackDataMap(Map<String, Map<Integer, BarrackData>> barrackDataMap) {
        this.barrackDataMap = barrackDataMap;
    }

    public Map<String, Map<Integer, ArmyCampData>> getArmyCampDataMap() {
        return armyCampDataMap;
    }

    public void setArmyCampDataMap(Map<String, Map<Integer, ArmyCampData>> armyCampDataMap) {
        this.armyCampDataMap = armyCampDataMap;
    }

    public Map<String, Map<Integer, ObstacleData>> getObstacleDataMap() {
        return obstacleDataMap;
    }

    public void setObstacleDataMap(Map<String, Map<Integer, ObstacleData>> obstacleDataMap) {
        this.obstacleDataMap = obstacleDataMap;
    }

    public Map<String, Map<Integer, BuilderHutData>> getBuilderHutDataMap() {
        return builderHutDataMap;
    }

    public void setBuilderHutDataMap(Map<String, Map<Integer, BuilderHutData>> builderHutDataMap) {
        this.builderHutDataMap = builderHutDataMap;
    }

    @Override
    public String toString() {
        return "BuildingConfig{" +
                "resourceStorageMap=" + resourceStorageMap +
                ", resourceGeneratorMap=" + resourceGeneratorMap +
                ", townHallDataMap=" + townHallDataMap +
                ", defensiveBuildingDataMap=" + defensiveBuildingDataMap +
                ", barrackDataMap=" + barrackDataMap +
                ", armyCampDataMap=" + armyCampDataMap +
                ", obstacleDataMap=" + obstacleDataMap +
                ", builderHutDataMap=" + builderHutDataMap +
                '}';
    }
}