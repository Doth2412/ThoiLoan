package config.data;

import java.util.HashMap;
import java.util.Map;

// Assuming this class will hold a collection of dungeon configurations.
// import java.util.List;
// import java.util.Map;

public class DungeonConfig {
    private Map<String, DungeonMap> dungeonMaps;

    public DungeonConfig() {
        this.dungeonMaps = new HashMap<>();
    }

    public Map<String, DungeonMap> getDungeonMaps() {
        return dungeonMaps;
    }

    public void setDungeonMaps(Map<String, DungeonMap> dungeonMaps) {
        this.dungeonMaps = dungeonMaps;
    }

    public void addDungeonMap(String mapName, DungeonMap dungeonMap) {
        this.dungeonMaps.put(mapName, dungeonMap);
    }

    public DungeonMap getDungeonMap(String mapName) {
        return this.dungeonMaps.get(mapName);
    }

    // Example inner class for a dungeon level or data
    // public static class DungeonLevel {
    // private int id;
    // private String name;
    // private List<String> monsters;
    // private String boss;
    // // getters and setters
    // }

    // Getters and setters for the main config fields
    // public List<DungeonLevel> getLevels() {
    // return levels;
    // }

    // public void setLevels(List<DungeonLevel> levels) {
    // this.levels = levels;
    // }
}