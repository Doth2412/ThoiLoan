package model;

/**
 * Represents a game object on the map with position and dimensions
 */
public class GameObject {
    private String id;
    private String type;
    private int x;
    private int y;
    private int width;
    private int height;

    /**
     * Constructor for GameObject
     * 
     * @param id     unique identifier of the object
     * @param type   type of the object (e.g., "TOW_1", "BARRACKS_1", "TREE_1")
     * @param x      top-left x-coordinate
     * @param y      top-left y-coordinate
     * @param width  width of the object
     * @param height height of the object
     */
    public GameObject(String id, String type, int x, int y, int width, int height) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Constructor for GameObject with default position (0,0)
     * 
     * @param id     unique identifier of the object
     * @param type   type of the object
     * @param width  width of the object
     * @param height height of the object
     */
    public GameObject(String id, String type, int width, int height) {
        this(id, type, 0, 0, width, height);
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    @Override
    public String toString() {
        return "GameObject{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", x=" + x +
                ", y=" + y +
                ", width=" + width +
                ", height=" + height +
                '}';
    }
}
