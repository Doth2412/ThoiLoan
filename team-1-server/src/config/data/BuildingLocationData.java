package config.data;

/**
 * POJO for building location data configuration
 */
public class BuildingLocationData {
    private int posX;
    private int posY;

    /**
     * Default constructor
     */
    public BuildingLocationData() {
        this.posX = 0;
        this.posY = 0;
    }

    /**
     * Constructor with all fields
     */
    public BuildingLocationData(int posX, int posY) {
        this.posX = posX;
        this.posY = posY;
    }

    public int getPosX() {
        return posX;
    }

    public void setPosX(int posX) {
        this.posX = posX;
    }

    public int getPosY() {
        return posY;
    }

    public void setPosY(int posY) {
        this.posY = posY;
    }

    @Override
    public String toString() {
        return "BuildingLocationData{" +
                "posX=" + posX +
                ", posY=" + posY +
                '}';
    }
}