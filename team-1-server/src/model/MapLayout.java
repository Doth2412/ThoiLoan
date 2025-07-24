package model;

import java.util.ArrayList;
import java.util.List;
import util.PositionValidator;

/**
 * Represents the game map layout and provides methods to manage object
 * placement
 */
public class MapLayout {
    public static final int MAP_WIDTH = 40;
    public static final int MAP_HEIGHT = 40;

    private List<GameObject> placedObjects;

    /**
     * Constructor for MapLayout
     */
    public MapLayout() {
        this.placedObjects = new ArrayList<>();
    }

    /**
     * Add a game object to the map
     * 
     * @param gameObject the object to add
     */
    public void addObject(GameObject gameObject) {
        placedObjects.add(gameObject);
    }

    /**
     * Get all placed objects on the map
     * 
     * @return list of placed game objects
     */
    public List<GameObject> getPlacedObjects() {
        return placedObjects;
    }

    /**
     * Check if a rectangular area is already occupied by any placed object
     * 
     * @param x      top-left x-coordinate of the area
     * @param y      top-left y-coordinate of the area
     * @param width  width of the area
     * @param height height of the area
     * @return true if the area is occupied, false otherwise
     */
    public boolean isOccupied(int x, int y, int width, int height) {
        // Convert GameObject list to Positionable list using adapters
        List<PositionValidator.Positionable> positionableObjects = new ArrayList<>();
        for (GameObject obj : placedObjects) {
            positionableObjects.add(new PositionValidator.GameObjectAdapter(obj));
        }

        // Use centralized collision detection
        return PositionValidator.hasCollisionWithObjects(x, y, width, height, positionableObjects, null);
    }

    /**
     * Check if a rectangular area is entirely within the map bounds
     * 
     * @param x      top-left x-coordinate of the area
     * @param y      top-left y-coordinate of the area
     * @param width  width of the area
     * @param height height of the area
     * @return true if the area is within bounds, false otherwise
     */
    public boolean isWithinMapBounds(int x, int y, int width, int height) {
        // Use centralized bounds checking
        return PositionValidator.isWithinMapBounds(x, y, width, height);
    }
}
