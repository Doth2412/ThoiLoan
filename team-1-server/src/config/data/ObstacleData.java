package config.data;

/**
 * POJO for obstacle data configuration
 */
public class ObstacleData {
    private Size size;
    private ResourceType resourceRequired;
    private int buildTime;
    private int removeCost;
    private String type; // Added for InitGame.json "obs" type
    private int posX; // Added for InitGame.json "obs" posX
    private int posY; // Added for InitGame.json "obs" posY

    /**
     * Default constructor
     */
    public ObstacleData() {
        this.size = new Size();
        this.resourceRequired = ResourceType.NONE;
        this.buildTime = 0;
        this.removeCost = 0;
        this.type = ""; // Initialize new field
        this.posX = 0; // Initialize new field
        this.posY = 0; // Initialize new field
    }

    /**
     * Constructor with all fields
     */
    public ObstacleData(Size size, ResourceType resourceRequired, int buildTime, int removeCost, String type,
                        int posX, int posY) {
        this.size = size;
        this.resourceRequired = resourceRequired;
        this.buildTime = buildTime;
        this.removeCost = removeCost;
        this.type = type;
        this.posX = posX;
        this.posY = posY;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public ResourceType getResourceRequired() {
        return resourceRequired;
    }

    public void setResourceRequired(ResourceType resourceRequired) {
        this.resourceRequired = resourceRequired;
    }

    public int getBuildTime() {
        return buildTime;
    }

    public void setBuildTime(int buildTime) {
        this.buildTime = buildTime;
    }

    public int getRemoveCost() {
        return removeCost;
    }

    public void setRemoveCost(int removeCost) {
        this.removeCost = removeCost;
    }

    // Add getters and setters for new fields
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
        return "ObstacleData{" +
                "size=" + size +
                ", resourceRequired=" + resourceRequired +
                ", buildTime=" + buildTime +
                ", buildingCost=" + removeCost +
                ", type='" + type + '\'' +
                ", posX=" + posX +
                ", posY=" + posY +
                '}';
    }
}