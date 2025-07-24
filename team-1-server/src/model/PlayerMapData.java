package model;

import config.data.DungeonResource;

public class PlayerMapData {
    private int mapIndex;
    private int stars;
    private DungeonResource remainingResources;

    public PlayerMapData(int mapIndex, int stars, DungeonResource remainingResources) {
        this.mapIndex = mapIndex;
        this.stars = stars;
        this.remainingResources = remainingResources;
    }

    public int getMapIndex() {
        return mapIndex;
    }

    public void setMapIndex(int mapIndex) {
        this.mapIndex = mapIndex;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public DungeonResource getRemainingResources() {
        return remainingResources;
    }

    public void setRemainingResources(DungeonResource remainingResources) {
        this.remainingResources = remainingResources;
    }
}
