package config.data;

import java.util.List;

/**
 * Data class for dungeon map configuration
 */
public class DungeonMap {
    private List<DungeonObject> house;
    private DungeonResource resourse;

    public DungeonMap() {
    }

    public List<DungeonObject> getHouse() {
        return house;
    }

    public void setHouse(List<DungeonObject> house) {
        this.house = house;
    }

    public DungeonResource getResourse() {
        return resourse;
    }

    public void setResourse(DungeonResource resourse) {
        this.resourse = resourse;
    }
}